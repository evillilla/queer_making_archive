import { useState } from 'react';
import { Shield } from 'lucide-react';
import type { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminAccess.css';

export function AdminAccess({ admin }: { admin: ReturnType<typeof useAdminAuth> }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        admin.signIn(email, password);
      }}
    >
      <input
        type="email"
        placeholder="Admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
