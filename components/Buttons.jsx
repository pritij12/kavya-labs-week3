'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';

export function SignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true); // show "Signing in..." right away
        signIn('google', { callbackUrl: '/dashboard' });
      }}
      className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signOut({ callbackUrl: '/' });
      }}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

// Buttons shown next to each user in the admin table
export function UserActions({ user }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function send(method, body) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) alert((await res.json()).error || 'Something went wrong.');
    } catch {
      alert('Network error. Please try again.');
    }
    setBusy(false);
    router.refresh(); // reload the table
  }

  const btn = 'rounded border px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50';
  return (
    <div className="flex flex-wrap gap-2">
      <button disabled={busy} className={btn} onClick={() => send('PATCH', { action: 'toggleRole' })}>
        {user.role === 'ADMIN' ? 'Remove admin' : 'Make admin'}
      </button>
      <button disabled={busy} className={btn} onClick={() => send('PATCH', { action: 'toggleStatus' })}>
        {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
      </button>
      <button
        disabled={busy}
        className={`${btn} text-red-600`}
        onClick={() => confirm(`Delete ${user.email}?`) && send('DELETE')}
      >
        Delete
      </button>
    </div>
  );
}
