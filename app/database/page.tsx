import type { Metadata } from 'next';
import { getHackathons, type HackathonRecord } from '@/lib/hackathons';
import { DatabaseExplorer } from './DatabaseExplorer';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Hackathons Canada Database',
  description: 'Browse and filter hackathons in Canada.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default async function DatabasePage() {
  let events: HackathonRecord[] = [];
  let loadError: string | null = null;

  try {
    events = await getHackathons();
  } catch {
    loadError = 'Could not load hackathons from MongoDB. Check database connection settings.';
  }

  return <DatabaseExplorer events={events} loadError={loadError} />;
}
