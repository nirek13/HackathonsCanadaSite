import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { getHackathons, type HackathonRecord } from '@/lib/hackathons';
import { DatabaseExplorer } from './DatabaseExplorer';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Hackathons North America Database',
  description: 'Browse and filter hackathons across North America.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.54 5.32a16.59 16.59 0 0 0-4.12-1.3.06.06 0 0 0-.06.03c-.18.33-.38.76-.52 1.1a15.42 15.42 0 0 0-5.67 0 11.42 11.42 0 0 0-.53-1.1.06.06 0 0 0-.06-.03 16.55 16.55 0 0 0-4.13 1.3.05.05 0 0 0-.02.02C1.8 9.17 1.1 12.92 1.43 16.63a.07.07 0 0 0 .03.05 16.75 16.75 0 0 0 5.07 2.56.06.06 0 0 0 .07-.02c.39-.53.75-1.1 1.06-1.69a.06.06 0 0 0-.03-.08 10.9 10.9 0 0 1-1.58-.75.06.06 0 0 1-.01-.1c.1-.08.2-.16.29-.24a.06.06 0 0 1 .06-.01c3.3 1.5 6.87 1.5 10.13 0a.06.06 0 0 1 .07 0c.09.08.19.16.29.24a.06.06 0 0 1-.01.1c-.5.29-1.03.54-1.58.75a.06.06 0 0 0-.03.08c.32.59.67 1.16 1.06 1.69a.06.06 0 0 0 .07.02 16.69 16.69 0 0 0 5.07-2.56.06.06 0 0 0 .03-.05c.39-4.28-.66-8-2.99-11.29a.04.04 0 0 0-.02-.02ZM8.68 14.38c-.99 0-1.8-.91-1.8-2.02 0-1.11.79-2.01 1.8-2.01 1 0 1.82.9 1.8 2.01 0 1.11-.8 2.02-1.8 2.02Zm6.64 0c-.99 0-1.8-.91-1.8-2.02 0-1.11.79-2.01 1.8-2.01 1 0 1.82.9 1.8 2.01 0 1.11-.8 2.02-1.8 2.02Z" />
    </svg>
  );
}

export default async function DatabasePage() {
  let events: HackathonRecord[] = [];
  let loadError: string | null = null;

  try {
    events = await getHackathons();
  } catch (error) {
    console.error('Failed to load hackathons from MongoDB:', error);
    loadError = 'Could not load hackathons from MongoDB. Check database connection settings.';
  }

  return (
    <>
      <DatabaseExplorer events={events} loadError={loadError} />
      <footer className="w-full py-10 bg-white-100">
        <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="https://discord.com/invite/wp42amwcWy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join us on Discord"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
          >
            <DiscordIcon className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="https://www.linkedin.com/company/hackathonsna/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on LinkedIn"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
          >
            <Linkedin className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="https://www.instagram.com/hackathoncanada/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
          >
            <Instagram className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="mailto:hackathonscanada@gmail.com"
            aria-label="Email Hackathons North America"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hna-blue/20 text-hna-blue transition hover:-translate-y-0.5 hover:border-hna-blue/45"
          >
            <Mail className="h-4.5 w-4.5" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Image src="/favicon.ico" alt="HNA logo" width={28} height={32} className="h-8 w-auto" />
          <p
            className="text-sm uppercase tracking-[0.28em] text-hna-blue/70 sm:text-base"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            HNA
          </p>
        </div>
        </div>
      </footer>
    </>
  );
}
