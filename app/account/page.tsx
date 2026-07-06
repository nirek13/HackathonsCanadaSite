import { currentUser } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Account | Hackathons North America',
  description: 'Manage your Hackathons North America account.',
};

export default async function AccountPage() {
  const user = await currentUser();

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    'Builder';

  const email = user?.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId)?.emailAddress;

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-hna-neutral px-6 py-12 sm:px-10 md:px-16 lg:px-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="text-[11px] uppercase tracking-[0.36em] text-hna-blue/55"
          style={{ fontFamily: 'var(--font-space-mono)' }}
        >
          your account
        </p>
        <h1
          className="mt-3 text-4xl tracking-tight sm:text-5xl"
          style={{ fontFamily: 'var(--font-newsreader)' }}
        >
          hello, {displayName.split(' ')[0]?.toLowerCase() ?? 'builder'}.
        </h1>

        <section className="mt-10 rounded-3xl border border-hna-blue/10 bg-white/70 p-6 shadow-[0_24px_60px_-42px_rgba(29,42,68,0.6)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={displayName}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full border border-hna-blue/10 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-hna-blue/10 bg-hna-blue/5 text-2xl uppercase text-hna-blue/60">
                {displayName.charAt(0)}
              </div>
            )}
            <div>
              <p
                className="text-2xl tracking-tight"
                style={{ fontFamily: 'var(--font-newsreader)' }}
              >
                {displayName}
              </p>
              {email && (
                <p
                  className="mt-1 text-sm text-hna-blue/60"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {email}
                </p>
              )}
              <p
                className="mt-3 text-[10px] uppercase tracking-[0.22em] text-hna-blue/45"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                member since{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-CA', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/database"
            className="rounded-2xl border border-hna-blue/10 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-hna-blue/25"
          >
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-hna-blue/55"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              explore
            </p>
            <p className="mt-2 text-xl tracking-tight" style={{ fontFamily: 'var(--font-newsreader)' }}>
              browse hackathons
            </p>
          </Link>
          <Link
            href="mailto:hackathonscanada@gmail.com"
            className="rounded-2xl border border-hna-blue/10 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-hna-blue/25"
          >
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-hna-blue/55"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              connect
            </p>
            <p className="mt-2 text-xl tracking-tight" style={{ fontFamily: 'var(--font-newsreader)' }}>
              contact the team
            </p>
          </Link>
        </section>
      </div>
    </div>
  );
}
