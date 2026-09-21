import { useCallback, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'qma:admin-passcode';

function loadStoredPasscode(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useAdminAccess() {
  const [passcode, setPasscode] = useState<string | null>(loadStoredPasscode);
  const [error, setError] = useState('');

  const signIn = useCallback(async (candidate: string) => {
    setError('');
    if (!supabase) {
      setError(
        isSupabaseConfigured
          ? 'Could not reach the server — check your connection and try again.'
          : 'Backend not configured for this deployment (missing Supabase environment variables).',
      );
      return;
    }
    try {
      const { data, error: rpcError } = await supabase.rpc('verify_admin_passcode', {
        p_passcode: candidate,
      });
      if (rpcError || !data) {
        setError('Incorrect passcode.');
        return;
      }
      setPasscode(candidate);
      try {
        sessionStorage.setItem(STORAGE_KEY, candidate);
      } catch {
        // session won't survive a refresh, but the current tab still works
      }
    } catch {
      setError('Could not reach the server — check your connection and try again.');
    }
  }, []);

  const signOut = useCallback(() => {
    setPasscode(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // nothing to clean up if storage was never available
    }
  }, []);

  return { isAdmin: Boolean(passcode), passcode, signIn, signOut, error };
}
