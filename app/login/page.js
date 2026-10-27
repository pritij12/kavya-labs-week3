import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSafeSession } from '../../lib/session';
import { SignInButton } from '../../components/Buttons';

export const dynamic = 'force-dynamic';

const messages = {
  AccessDenied: 'Your account is not allowed to sign in.',
  Configuration: 'Login is not set up yet. Check the environment variables.',
};

// WEEK 2: Login page
export default async function Login({ searchParams }) {
  const session = await getSafeSession();
  if (session) redirect('/dashboard'); // already logged in

  const error = searchParams?.error;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Link href="/" className="mb-6 text-sm text-indigo-600 hover:underline">← Back to home</Link>
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold">Sign in to Kavya Labs</h1>
        <p className="mb-6 mt-1 text-sm text-gray-600">Use your Google account to continue.</p>
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {messages[error] || 'Sign-in failed. Please try again.'}
          </p>
        )}
        <SignInButton />
      </div>
    </main>
  );
}
