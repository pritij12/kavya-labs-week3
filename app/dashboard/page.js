import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSafeSession } from '../../lib/session';
import { prisma } from '../../lib/prisma';
import { SignOutButton } from '../../components/Buttons';

export const dynamic = 'force-dynamic';

// The page only logged-in users can see
export default async function Dashboard() {
  const session = await getSafeSession();
  if (!session) redirect('/login');

  // Load the full user from the database (fall back to session data if the database is down)
  let saved = null;
  try {
    saved = await prisma.user.findUnique({ where: { id: session.user.id } });
  } catch {}
  const user = saved || session.user;

  if (user.status === 'SUSPENDED') {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Account suspended</h1>
        <p className="my-4 text-gray-600">Please contact an admin.</p>
        <SignOutButton />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">← Home</Link>
      <h1 className="mb-6 mt-2 text-3xl font-extrabold">Welcome, {user.name || 'friend'} 👋</h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {user.image && <img src={user.image} alt="" className="mb-4 h-16 w-16 rounded-full" />}
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role || 'USER'}</p>
        {saved?.createdAt && <p><b>Member since:</b> {saved.createdAt.toLocaleDateString()}</p>}
      </div>

      <div className="mt-6 flex gap-3">
        {user.role === 'ADMIN' && (
          <Link href="/admin" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
            Open admin dashboard
          </Link>
        )}
        <SignOutButton />
      </div>
    </main>
  );
}
