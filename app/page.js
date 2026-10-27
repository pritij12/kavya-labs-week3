import Link from 'next/link';
import { getSafeSession } from '../lib/session';
import { SignOutButton } from '../components/Buttons';

export const dynamic = 'force-dynamic';

// WEEK 1 landing page + WEEK 2 login buttons.
// If login is not set up, the page still shows (the visitor is treated as signed out).

const features = [
  { icon: '🤖', title: 'Custom AI assistants', text: 'Chatbots and copilots trained on your own business knowledge.' },
  { icon: '📄', title: 'Document intelligence', text: 'Ask questions about PDFs and get answers with sources.' },
  { icon: '🎯', title: 'Smart recommendations', text: 'Personalised suggestions that help customers find what they love.' },
  { icon: '⚡', title: 'Rapid prototypes', text: 'From idea to a working demo in days, not months.' },
  { icon: '🔐', title: 'Secure by design', text: 'Safe sign-in, careful data handling and clean, reviewed code.' },
  { icon: '📊', title: 'Dashboards and analytics', text: 'Clear numbers so you can see what is working.' },
];

export default async function Home() {
  const session = await getSafeSession();
  const ctaHref = session ? '/dashboard' : '/login';

  return (
    <>
      {/* Top bar */}
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" aria-label="Main">
          <a href="#hero" className="text-xl font-extrabold text-indigo-600">⚡ Kavya Labs</a>
          <div className="flex items-center gap-4 text-sm">
            <a href="#features" className="hidden hover:text-indigo-600 sm:inline">Features</a>
            <a href="#contact" className="hidden hover:text-indigo-600 sm:inline">Contact</a>
            {session ? (
              <>
                <Link href="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
                  Dashboard
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link href="/login" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
            <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm">Bengaluru AI startup</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              AI products, built fast and shipped clean.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">
              Kavya Labs turns ideas into working AI software, with clear weekly progress and no surprises.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={ctaHref} className="rounded-lg bg-white px-7 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">
                {session ? 'Go to dashboard' : 'Get started'}
              </Link>
              <a href="#contact" className="rounded-lg border border-white/60 px-7 py-3 font-semibold hover:bg-white/10">
                Contact us
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-center text-3xl font-bold">What we build</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
            Everything you need to bring an AI idea to your users.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="text-3xl" aria-hidden="true">{f.icon}</div>
                <h3 className="mt-3 text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm md:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-indigo-600">⚡ Kavya Labs</p>
            <p className="mt-2 text-gray-600">AI products, built fast and shipped clean.</p>
          </div>
          <div>
            <p className="font-semibold">Links</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li><a href="#hero" className="hover:text-indigo-600">Home</a></li>
              <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <p className="mt-2 text-gray-600">
              <a href="mailto:hello@kavyalabs.example" className="hover:text-indigo-600">hello@kavyalabs.example</a>
              <br />Bengaluru, India
            </p>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-gray-500">
          © 2026 Kavya Labs (a fictional company from a virtual startup exercise). All rights reserved.
        </div>
      </footer>
    </>
  );
}
