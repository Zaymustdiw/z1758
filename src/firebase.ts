import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  applyActionCode,
  updateProfile,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const BOOTSTRAPPED_ADMIN_EMAIL = 'rexafrfr@gmail.com';
export const PENDING_EMAIL_LINK_STORAGE_KEY = 'z1758_email_link_pending';

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const signUpWithEmailAccount = async (
  displayName: string,
  email: string,
  password: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim().slice(0, 100) });
  }
  await sendEmailVerification(credential.user);
  return credential.user;
};

export const signInWithEmailAccount = async (email: string, password: string): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
};

export const sendVerificationEmailToUser = async (user: User) => {
  await sendEmailVerification(user);
};

export const sendEmailSignInCodeLink = async (email: string, displayName?: string) => {
  const cleanEmail = email.trim();
  const actionCodeSettings = {
    url: `${window.location.origin}/?authEmail=${encodeURIComponent(cleanEmail)}`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
  try {
    window.localStorage.setItem(
      PENDING_EMAIL_LINK_STORAGE_KEY,
      JSON.stringify({
        email: cleanEmail,
        displayName: (displayName || '').trim().slice(0, 100),
        sentAt: Date.now(),
      })
    );
  } catch {
    // Ignore localStorage restrictions
  }
};

export const resolveEmailActionUrlFromInput = (rawInput: string): string => {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // Support pasting raw oobCode query parameter or code token directly
  const cleanedCode = trimmed.replace(/^oobCode=/i, '');
  return `${window.location.origin}/?mode=signIn&oobCode=${encodeURIComponent(cleanedCode)}`;
};

export const extractOobCodeFromInput = (rawInput: string): string => {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.searchParams.get('oobCode') || '';
    } catch {
      return '';
    }
  }
  return trimmed.replace(/^oobCode=/i, '');
};

export const checkIsEmailSignInLink = (url: string): boolean => {
  return isSignInWithEmailLink(auth, url);
};

export const completeEmailCodeSignIn = async (
  email: string,
  actionUrlOrCode: string,
  displayName?: string
): Promise<User> => {
  const targetUrl = resolveEmailActionUrlFromInput(actionUrlOrCode);
  if (!isSignInWithEmailLink(auth, targetUrl)) {
    throw new Error('Invalid or expired verification code/link.');
  }
  const result = await signInWithEmailLink(auth, email.trim(), targetUrl);
  if (displayName && displayName.trim() && !result.user.displayName) {
    await updateProfile(result.user, { displayName: displayName.trim().slice(0, 100) });
  }
  await result.user.reload();
  await result.user.getIdToken(true);
  try {
    window.localStorage.removeItem(PENDING_EMAIL_LINK_STORAGE_KEY);
  } catch {
    // Ignore localStorage restrictions
  }
  return result.user;
};

export const applyVerificationActionCode = async (rawInput: string): Promise<void> => {
  const oobCode = extractOobCodeFromInput(rawInput);
  if (!oobCode) {
    throw new Error('Please paste a valid verification code or link from your email.');
  }
  await applyActionCode(auth, oobCode);
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
