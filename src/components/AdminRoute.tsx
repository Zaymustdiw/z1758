import React from 'react';
import { ShieldAlert, Lock, MailWarning, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../types';

interface AdminRouteProps {
  children: React.ReactNode;
  theme: Theme;
  onExit: () => void;
}

export function AdminRoute({ children, theme, onExit }: AdminRouteProps) {
  const { user, loading, authReady, isEmailVerified, isAdmin, adminLoading, openAuthModal } = useAuth();

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900';
  const subText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const accentBtn = isDark
    ? 'bg-zinc-100 hover:bg-white text-zinc-950'
    : 'bg-zinc-950 hover:bg-zinc-800 text-white';

  if (!authReady || loading || adminLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className={`max-w-md w-full rounded-3xl border p-8 text-center shadow-xl ${cardBg}`}>
          <div
            className={`w-12 h-12 mx-auto mb-4 rounded-full border-4 animate-spin ${
              isDark ? 'border-zinc-700 border-t-zinc-100' : 'border-zinc-200 border-t-zinc-950'
            }`}
          />
          <h2 className="text-lg font-bold">Verifying Admin Permissions...</h2>
          <p className={`text-sm mt-1 ${subText}`}>Checking authentication, email verification, and server-side role records.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className={`max-w-md w-full rounded-3xl border p-8 text-center shadow-xl space-y-5 ${cardBg}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">401 — Authentication Required</h2>
          <p className={`text-sm ${subText}`}>
            This admin route is protected. Sign in with an authorized administrator account to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={openAuthModal} className={`px-6 py-3 rounded-xl font-bold text-sm cursor-pointer ${accentBtn}`}>
              Sign In
            </button>
            <button
              onClick={onExit}
              className={`px-6 py-3 rounded-xl font-bold text-sm border cursor-pointer flex items-center justify-center gap-2 ${
                isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className={`max-w-md w-full rounded-3xl border p-8 text-center shadow-xl space-y-5 ${cardBg}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <MailWarning className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Email Verification Required</h2>
          <p className={`text-sm ${subText}`}>
            Your email address (<span className="font-semibold">{user.email}</span>) is not verified. Server-side security rules block all admin access until email verification is complete.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={openAuthModal} className={`px-6 py-3 rounded-xl font-bold text-sm cursor-pointer ${accentBtn}`}>
              Verify Email
            </button>
            <button
              onClick={onExit}
              className={`px-6 py-3 rounded-xl font-bold text-sm border cursor-pointer flex items-center justify-center gap-2 ${
                isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className={`max-w-md w-full rounded-3xl border p-8 text-center shadow-xl space-y-5 ${cardBg}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">403 — Access Denied</h2>
          <p className={`text-sm ${subText}`}>
            Account <span className="font-semibold">{user.email}</span> does not hold administrator privileges. All admin operations are enforced by server-side Firestore security rules.
          </p>
          <button
            onClick={onExit}
            className={`px-6 py-3 rounded-xl font-bold text-sm cursor-pointer inline-flex items-center gap-2 ${accentBtn}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
