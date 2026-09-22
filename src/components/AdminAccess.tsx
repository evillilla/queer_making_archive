import { useState } from 'react';
import { ShieldIcon } from './customIcons';
import type { useAdminAccess } from '../hooks/useAdminAccess';
import type { Entry } from '../data/types';
import { useThumbnailBackfill } from '../hooks/useThumbnailBackfill';
import './AdminAccess.css';

interface AdminAccessProps {
  admin: ReturnType<typeof useAdminAccess>;
  entries: Entry[];
  updateThumbnail: (id: string, url: string) => Promise<boolean>;
}

export function AdminAccess({ admin, entries, updateThumbnail }: AdminAccessProps) {
  const [open, setOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const backfill = useThumbnailBackfill(entries, updateThumbnail);

  if (admin.isAdmin) {
    return (
      <div className="admin-access admin-access-active">
        <ShieldIcon size={13} />
        Admin mode
        <button type="button" onClick={backfill.run} disabled={backfill.running}>
          {backfill.running ? 'Regenerating…' : 'Regenerate previews'}
        </button>
        <button type="button" onClick={() => admin.signOut()}>
          Log out
        </button>
        {backfill.result && (
          <span className="admin-access-backfill-result">
            {backfill.result.processed === 0
              ? 'Nothing to update'
              : `Updated ${backfill.result.updated}/${backfill.result.processed}`}
          </span>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="admin-access admin-access-trigger" onClick={() => setOpen(true)}>
        Admin
      </button>
    );
  }

  return (
    <form
      className="admin-access admin-access-form"
      onSubmit={(e) => {
        e.preventDefault();
        admin.signIn(passcode);
      }}
    >
      <input
        type="password"
        placeholder="Admin passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        autoFocus
      />
      <div className="admin-access-actions">
        <button type="submit">Log in</button>
        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      {admin.error && <p className="admin-access-error">{admin.error}</p>}
    </form>
  );
}
