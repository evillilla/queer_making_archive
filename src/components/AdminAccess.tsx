import { useState } from 'react';
import { Shield } from 'lucide-react';
import type { useAdminAccess } from '../hooks/useAdminAccess';
import './AdminAccess.css';

export function AdminAccess({ admin }: { admin: ReturnType<typeof useAdminAccess> }) {
  const [open, setOpen] = useState(false);
  const [passcode, setPasscode] = useState('');

  if (admin.isAdmin) {
    return (
      <div className="admin-access admin-access-active">
        <Shield size={13} />
        Admin mode
        <button type="button" onClick={() => admin.signOut()}>
          Log out
        </button>
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
