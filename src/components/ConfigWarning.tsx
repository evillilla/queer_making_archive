import { isSupabaseConfigured } from '../lib/supabaseClient';
import './ConfigWarning.css';

export function ConfigWarning() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="config-warning">
      Backend not connected — submissions, reports, and admin login won't work until
      VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set for this deployment.
    </div>
  );
}
