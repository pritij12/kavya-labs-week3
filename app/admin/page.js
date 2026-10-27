import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSafeSession } from '../../lib/session';
import { prisma } from '../../lib/prisma';
import { UserActions } from '../../components/Buttons';

export const dynamic = 'force-dynamic';

// WEEK 3: Admin dashboard (user management + analytics)
export default async function Admin() {
  const session = await getSafeSession();
  if (!session) redirect('/login');

  // Only admins can see this page
  if (session.user.role !== 'ADMIN') {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">403: Admins only</h1>
        <p className="my-3 text-gray-600">You do not have permission to see this page.</p>
        <Link href="/" className="text-indigo-600 underline">Go home</Link>
      </main>
    );
  }

  let users = [];
  let failed = false;
  try {
    users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {
    failed = true;
  }

  // Analytics
  const DAY = 24 * 60 * 60 * 1000;
  const within7Days = (date) => date && Date.now() - date.getTime() < 7 * DAY;
  const stats = [
    { label: 'Total users', value: users.length },
    { label: 'Active accounts', value: users.filter((u) => u.status === 'ACTIVE').length },
    { label: 'Suspended', value: users.filter((u) => u.status === 'SUSPENDED').length },
    { label: 'Admins', value: users.filter((u) => u.role === 'ADMIN').length },
    { label: 'New (7 days)', value: users.filter((u) => within7Days(u.createdAt)).length },
    { label: 'Logged in (7 days)', value: users.filter((u) => within7Days(u.lastLoginAt)).length },
  ];

  // Signups per day for the last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: users.filter((u) => u.createdAt.toDateString() === d.toDateString()).length,
    });
  }
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Admin dashboard</h1>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← My dashboard</Link>
      </div>

      {failed && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          Could not load users. Check DATABASE_URL and that you ran <code>npx prisma db push</code>.
        </p>
      )}

      {/* Analytics: number cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-2xl font-extrabold text-indigo-600">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Analytics: simple bar chart */}
      <section className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold">Signups per day (last 7 days)</h2>
        <div className="flex h-40 items-end gap-3">
          {days.map((d, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-xs">{d.count}</span>
              <div
                className="w-full rounded-t bg-indigo-500"
                style={{ height: `${(d.count / max) * 80}%`, minHeight: '4px' }}
              />
              <span className="mt-1 text-xs text-gray-500">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* User management */}
      <section className="mt-8 overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.status}</td>
                <td className="p-3">{u.createdAt.toLocaleDateString()}</td>
                <td className="p-3">
                  {u.id === session.user.id ? <span className="text-gray-400">(you)</span> : <UserActions user={u} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
