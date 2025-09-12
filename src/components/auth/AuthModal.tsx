import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../FirebaseAuthProvider';
import { useLanguage } from '../LanguageProvider';

interface AuthModalProps {
  open: boolean;
  mode?: 'signin' | 'signup';
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, mode = 'signin', onOpenChange }: AuthModalProps) {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if ((password || '').length < 6) throw new Error(t('auth.password_short', 'Password must be at least 6 characters'));
        const { error } = await signUp(email, password);
        if (error) throw error;
      }
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || t('auth.generic_error', 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{authMode === 'signin' ? t('auth.sign_in', 'Sign in') : t('auth.create_account', 'Create account')}</DialogTitle>
          <DialogDescription>{t('auth.sync_progress', 'Sign in to sync your learning progress across devices.')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm">{t('auth.email', 'Email')}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm">{t('auth.password', 'Password')}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {authMode === 'signin' ? t('auth.sign_in', 'Sign in') : t('auth.create_account', 'Create account')}
            </Button>
            <button
              type="button"
              className="text-sm text-gray-600 hover:underline"
              onClick={() => setAuthMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
            >
              {authMode === 'signin' ? t('auth.switch_to_signup', 'Need an account? Sign up') : t('auth.switch_to_signin', 'Have an account? Sign in')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

