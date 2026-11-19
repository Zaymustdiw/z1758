import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../types';
import { validatePasswordStrength } from '../utils';

interface AuthModalProps {
  theme: Theme;
  onSuccessToast?: (msg: string) => void;
}

type AuthTab = 'code' | 'password';
type AuthIntent = 'signin' | 'signup';

export function AuthModal({ theme, onSuccessToast }: AuthModalProps) {
  const {
    user,
    isEmailVerified,
    isAuthModalOpen,
    pendingEmailLinkUrl,
    closeAuthModal,
    clearPendingEmailLinkUrl,
    signIn,
    signUpWithEmail,
    signInWithEmail,
    sendEmailCode,
    verifyEmailCodeSignIn,
    verifyEmailWithActionCode,
    sendVerificationEmail,
    refreshVerificationStatus,
  } = useAuth();

  const [authTab, setAuthTab] = useState<AuthTab>('code');
  const [intent, setIntent] = useState<AuthIntent>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (pendingEmailLinkUrl) {
      setAuthTab('code');
      setCodeSent(true);
      setCodeInput(pendingEmailLinkUrl);
      setInfoMessage('Confirm your email address below to complete your sign-in.');
    }
  }, [pendingEmailLinkUrl]);

  useEffect(() => {
    setError(null);
    if (!pendingEmailLinkUrl) {
      setInfoMessage(null);
    }
  }, [authTab, intent, isAuthModalOpen, pendingEmailLinkUrl]);

  const isDark = theme === 'dark';
  const modalBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const inputStyle = isDark
    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-indigo-400'
    : 'bg-[#F7F7F5] border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-indigo-600';
  const accentBtn = 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20';

  const mapAuthError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('auth/operation-not-allowed')) {
      return 'Enable "Email/Password" and "Email link (passwordless sign-in)" in Firebase Console → Authentication → Sign-in method.';
    }
    if (msg.includes('auth/unauthorized-continue-uri') || msg.includes('auth/invalid-continue-uri')) {
      return 'Add this app domain under Firebase Console → Authentication → Settings → Authorized domains.';
    }
    if (msg.includes('auth/invalid-action-code') || msg.includes('auth/expired-action-code')) {
      return 'This verification code or link is invalid or expired. Please request a fresh code.';
    }
    if (msg.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (
      msg.includes('auth/invalid-credential') ||
      msg.includes('auth/wrong-password') ||
      msg.includes('auth/user-not-found')
    ) {
      return 'Invalid email or password.';
    }
    if (msg.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('auth/too-many-requests')) {
      return 'Too many attempts. Please wait a moment before trying again.';
    }
    if (msg.includes('auth/popup-closed-by-user')) {
      return 'Sign-in popup was closed before completion.';
    }
    return msg.includes('Invalid or expired')
      ? msg
      : 'Authentication failed. Please check your details and try again.';
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signIn();
      closeAuthModal();
      onSuccessToast?.('Signed in with Google.');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (intent === 'signup' && !displayName.trim()) {
      setError('Please enter your full name for your new account.');
      return;
    }

    setSubmitting(true);
    try {
      await sendEmailCode(cleanEmail, intent === 'signup' ? displayName : undefined);
      setCodeSent(true);
      setCooldown(60);
      setInfoMessage(
        `Sign-in code & verification link sent to ${cleanEmail}. Click the link in your email or paste the verification code below.`
      );
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCodeSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanEmail = email.trim();
    const targetCode = codeInput.trim() || pendingEmailLinkUrl || '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter the email address that received the code.');
      return;
    }
    if (!targetCode) {
      setError('Paste the verification code or link from your email.');
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmailCodeSignIn(cleanEmail, targetCode, intent === 'signup' ? displayName : undefined);
      setCodeSent(false);
      setCodeInput('');
      clearPendingEmailLinkUrl();
      closeAuthModal();
      onSuccessToast?.('Email verified and signed in.');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (intent === 'signup') {
      if (!displayName.trim()) {
        setError('Please enter your display name.');
        return;
      }
      const pwCheck = validatePasswordStrength(password);
      if (!pwCheck.valid) {
        setError(pwCheck.message);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (intent === 'signup') {
        await signUpWithEmail(displayName, email, password);
        setCooldown(60);
        setInfoMessage('Verification email sent! Click the inbox link or paste the verification code below.');
      } else {
        await signInWithEmail(email, password);
        closeAuthModal();
        onSuccessToast?.('Signed in successfully.');
      }
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyPasswordActionCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!codeInput.trim()) {
      setError('Paste the verification code or link from your email.');
      return;
    }

    setSubmitting(true);
    try {
      const verified = await verifyEmailWithActionCode(codeInput);
      if (verified) {
        setCodeInput('');
        onSuccessToast?.('Email verified! Full access unlocked.');
        closeAuthModal();
      } else {
        setInfoMessage('Code applied. Refreshing verification status...');
      }
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (cooldown > 0) return;
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);
    try {
      await sendVerificationEmail();
      setCooldown(60);
      setInfoMessage('Verification email sent. Check your inbox (and spam folder).');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckVerification = async () => {
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);
    try {
      const verified = await refreshVerificationStatus();
      if (verified) {
        onSuccessToast?.('Email verified! Full access unlocked.');
        closeAuthModal();
      } else {
        setError('Email is still unverified. Click the link in your inbox or paste the code below.');
      }
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto ${modalBg}`}
          >
            <button
              type="button"
              onClick={closeAuthModal}
              aria-label="Close sign in dialog"
              className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {user && !isEmailVerified ? (
              <div className="space-y-5 pt-2">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-amber-500/15 text-amber-500">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h2 className={`text-2xl font-bold ${textColor}`}>Verify Your Email</h2>
                  <p className={`text-sm leading-relaxed ${subTextColor}`}>
                    Your account (<span className="font-semibold">{user.email}</span>) must be verified before checkout, reviews, and profile storage.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {infoMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{infoMessage}</span>
                  </div>
                )}

                <form onSubmit={handleApplyPasswordActionCode} className="space-y-2.5">
                  <label className={`text-xs font-bold block ${subTextColor}`}>
                    Paste Verification Code or Link from Email
                  </label>
                  <div className="relative">
                    <KeyRound className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Paste code (oobCode) or full link..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !codeInput.trim()}
                    className={`w-full min-h-[44px] py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 ${accentBtn}`}
                  >
                    {submitting ? 'Verifying...' : 'Apply Verification Code'}
                  </button>
                </form>

                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCheckVerification}
                    disabled={submitting}
                    className={`w-full min-h-[44px] py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer disabled:opacity-50 ${
                      isDark
                        ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                        : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                    I&apos;ve Clicked the Link — Check Status
                  </button>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={submitting || cooldown > 0}
                    className={`w-full min-h-[44px] py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer disabled:opacity-50 ${
                      isDark
                        ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend Verification Email'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow-sm shadow-indigo-500/25">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textColor}`}>
                      {intent === 'signin' ? 'Sign In to Z1758' : 'Create Verified Account'}
                    </h2>
                    <p className={`text-xs ${subTextColor}`}>
                      Instant email code sign-in, password, or Google
                    </p>
                  </div>
                </div>

                {/* Sign In vs Sign Up Intent Switch */}
                <div
                  className={`grid grid-cols-2 p-1 rounded-xl border ${
                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIntent('signin')}
                    className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      intent === 'signin' ? accentBtn : subTextColor
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntent('signup')}
                    className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      intent === 'signup' ? accentBtn : subTextColor
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Auth Method Toggle: Email Code vs Password */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthTab('code')}
                    className={`flex-1 min-h-[38px] px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      authTab === 'code'
                        ? isDark
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                          : 'bg-zinc-950 text-white border-zinc-950'
                        : isDark
                        ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        : 'border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Email Code / Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('password')}
                    className={`flex-1 min-h-[38px] px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      authTab === 'password'
                        ? isDark
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                          : 'bg-zinc-950 text-white border-zinc-950'
                        : isDark
                        ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        : 'border-zinc-200 text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Email &amp; Password</span>
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {infoMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{infoMessage}</span>
                  </div>
                )}

                {authTab === 'code' ? (
                  !codeSent ? (
                    <form onSubmit={handleSendCode} className="space-y-3">
                      {intent === 'signup' && (
                        <div className="relative">
                          <UserIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                          <input
                            type="text"
                            placeholder="Full Name"
                            maxLength={100}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                          />
                        </div>
                      )}
                      <div className="relative">
                        <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                        <input
                          type="email"
                          placeholder="Email Address"
                          maxLength={254}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                        />
                      </div>
                      <p className={`text-[11px] leading-relaxed ${subTextColor}`}>
                        We&apos;ll email a one-tap sign-in link &amp; verification code to {intent === 'signup' ? 'create and verify' : 'access'} your account without a password.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full min-h-[46px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${accentBtn}`}
                      >
                        <span>
                          {submitting
                            ? 'Sending Code...'
                            : intent === 'signup'
                            ? 'Send Sign-Up Code to Email'
                            : 'Send Sign-In Code to Email'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyCodeSignIn} className="space-y-3">
                      <div className="relative">
                        <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                        <input
                          type="email"
                          placeholder="Confirm Email Address"
                          maxLength={254}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                        />
                      </div>
                      <div className="relative">
                        <KeyRound className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                        <input
                          type="text"
                          placeholder="Paste oobCode or email link..."
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono outline-none transition-colors ${inputStyle}`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full min-h-[46px] py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 ${accentBtn}`}
                      >
                        {submitting ? 'Verifying Code...' : 'Verify Code & Sign In'}
                      </button>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCodeSent(false);
                            clearPendingEmailLinkUrl();
                          }}
                          className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${subTextColor} hover:underline`}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Change email</span>
                        </button>
                        <button
                          type="button"
                          disabled={submitting || cooldown > 0}
                          onClick={handleSendCode}
                          className={`text-xs font-bold cursor-pointer disabled:opacity-50 ${
                            isDark ? 'text-indigo-400' : 'text-indigo-600'
                          }`}
                        >
                          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    {intent === 'signup' && (
                      <div className="relative">
                        <UserIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                        <input
                          type="text"
                          placeholder="Full Name"
                          maxLength={100}
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                        />
                      </div>
                    )}
                    <div className="relative">
                      <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                      <input
                        type="email"
                        placeholder="Email Address"
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                      />
                    </div>
                    <div className="relative">
                      <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${subTextColor}`} />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
                      />
                    </div>
                    {intent === 'signup' && (
                      <p className={`text-[11px] ${subTextColor}`}>
                        Min 8 characters with uppercase, lowercase, and a number. Verification email sent immediately.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full min-h-[46px] py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 ${accentBtn}`}
                    >
                      {submitting
                        ? 'Processing...'
                        : intent === 'signin'
                        ? 'Sign In with Password'
                        : 'Create Account & Verify Email'}
                    </button>
                  </form>
                )}

                <div className="relative flex items-center py-1">
                  <div className={`flex-grow border-t ${isDark ? 'border-zinc-800' : 'border-gray-200'}`} />
                  <span className={`px-3 text-xs uppercase font-bold ${subTextColor}`}>or</span>
                  <div className={`flex-grow border-t ${isDark ? 'border-zinc-800' : 'border-gray-200'}`} />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                  className={`w-full min-h-[46px] py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700'
                      : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
