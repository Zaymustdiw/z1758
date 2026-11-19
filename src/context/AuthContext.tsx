import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  auth,
  db,
  BOOTSTRAPPED_ADMIN_EMAIL,
  PENDING_EMAIL_LINK_STORAGE_KEY,
  signInWithGoogle,
  signUpWithEmailAccount,
  signInWithEmailAccount,
  sendVerificationEmailToUser,
  sendEmailSignInCodeLink,
  completeEmailCodeSignIn,
  applyVerificationActionCode,
  checkIsEmailSignInLink,
  logOut,
} from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authReady: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  isAuthModalOpen: boolean;
  pendingEmailLinkUrl: string | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  clearPendingEmailLinkUrl: () => void;
  signIn: () => Promise<void>;
  signUpWithEmail: (displayName: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  sendEmailCode: (email: string, displayName?: string) => Promise<void>;
  verifyEmailCodeSignIn: (email: string, codeOrUrl: string, displayName?: string) => Promise<void>;
  verifyEmailWithActionCode: (codeOrUrl: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<void>;
  refreshVerificationStatus: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authReady: false,
  isEmailVerified: false,
  isAdmin: false,
  adminLoading: false,
  isAuthModalOpen: false,
  pendingEmailLinkUrl: null,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  clearPendingEmailLinkUrl: () => {},
  signIn: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  sendEmailCode: async () => {},
  verifyEmailCodeSignIn: async () => {},
  verifyEmailWithActionCode: async () => false,
  sendVerificationEmail: async () => {},
  refreshVerificationStatus: async () => false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingEmailLinkUrl, setPendingEmailLinkUrl] = useState<string | null>(null);
  const [verificationTick, setVerificationTick] = useState(0);

  const verifyUserPrivilegesAndSync = useCallback(async (currentUser: User | null) => {
    if (!currentUser || !currentUser.emailVerified) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);
    try {
      let hasAdminRecord = false;
      try {
        const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
        hasAdminRecord = adminSnap.exists();
      } catch (err) {
        console.error('Admin verification check failed:', err);
        hasAdminRecord = false;
      }

      const isBootstrappedAdmin =
        currentUser.emailVerified &&
        currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

      setIsAdmin(hasAdminRecord || isBootstrappedAdmin);

      const publicRef = doc(db, 'users', currentUser.uid);
      const publicSnap = await getDoc(publicRef);
      const displayName = (
        currentUser.displayName ||
        currentUser.email?.split('@')[0] ||
        'Z1758 Member'
      ).slice(0, 100);
      const photoURL = (currentUser.photoURL || '').slice(0, 500);

      if (!publicSnap.exists()) {
        await setDoc(publicRef, {
          uid: currentUser.uid,
          displayName,
          ...(photoURL ? { photoURL } : {}),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      const privateRef = doc(db, 'users', currentUser.uid, 'private', 'info');
      const privateSnap = await getDoc(privateRef);
      if (!privateSnap.exists()) {
        await setDoc(privateRef, {
          email: currentUser.email || '',
          emailVerified: true,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error syncing user security profile:', error);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  // Handle incoming Firebase Email Sign-In Link automatically on load
  useEffect(() => {
    const currentUrl = window.location.href;
    if (!checkIsEmailSignInLink(currentUrl)) return;

    let savedEmail = '';
    let savedDisplayName = '';
    try {
      const raw = window.localStorage.getItem(PENDING_EMAIL_LINK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        savedEmail = parsed.email || '';
        savedDisplayName = parsed.displayName || '';
      }
    } catch {
      // Ignore storage error
    }

    if (!savedEmail) {
      const urlEmail = new URL(currentUrl).searchParams.get('authEmail') || '';
      savedEmail = urlEmail;
    }

    if (savedEmail) {
      completeEmailCodeSignIn(savedEmail, currentUrl, savedDisplayName)
        .then(async (signedUser) => {
          setUser(signedUser);
          setVerificationTick((t) => t + 1);
          await verifyUserPrivilegesAndSync(signedUser);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(() => {
          setPendingEmailLinkUrl(currentUrl);
          setIsAuthModalOpen(true);
        });
    } else {
      setPendingEmailLinkUrl(currentUrl);
      setIsAuthModalOpen(true);
    }
  }, [verifyUserPrivilegesAndSync]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setAuthReady(true);
      await verifyUserPrivilegesAndSync(currentUser);
    });

    return () => unsubscribe();
  }, [verifyUserPrivilegesAndSync]);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signUpWithEmail = async (displayName: string, email: string, password: string) => {
    await signUpWithEmailAccount(displayName, email, password);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAccount(email, password);
  };

  const sendEmailCode = async (email: string, displayName?: string) => {
    await sendEmailSignInCodeLink(email, displayName);
  };

  const verifyEmailCodeSignIn = async (email: string, codeOrUrl: string, displayName?: string) => {
    const signedUser = await completeEmailCodeSignIn(email, codeOrUrl, displayName);
    setUser(signedUser);
    setVerificationTick((t) => t + 1);
    setPendingEmailLinkUrl(null);
    if (checkIsEmailSignInLink(window.location.href)) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    await verifyUserPrivilegesAndSync(signedUser);
  };

  const verifyEmailWithActionCode = async (codeOrUrl: string): Promise<boolean> => {
    await applyVerificationActionCode(codeOrUrl);
    return refreshVerificationStatus();
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user found.');
    }
    await sendVerificationEmailToUser(auth.currentUser);
  };

  const refreshVerificationStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    const updatedUser = auth.currentUser;
    setUser(updatedUser);
    setVerificationTick((t) => t + 1);
    await verifyUserPrivilegesAndSync(updatedUser);
    return Boolean(updatedUser.emailVerified);
  };

  const signOutUser = async () => {
    setIsAdmin(false);
    await logOut();
  };

  const isEmailVerified = Boolean(user?.emailVerified && verificationTick >= 0);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authReady,
        isEmailVerified,
        isAdmin,
        adminLoading,
        isAuthModalOpen,
        pendingEmailLinkUrl,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        clearPendingEmailLinkUrl: () => setPendingEmailLinkUrl(null),
        signIn,
        signUpWithEmail,
        signInWithEmail,
        sendEmailCode,
        verifyEmailCodeSignIn,
        verifyEmailWithActionCode,
        sendVerificationEmail,
        refreshVerificationStatus,
        signOut: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
