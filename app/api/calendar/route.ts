import { NextRequest, NextResponse } from 'next/server';
import { getHackathons, type HackathonRecord } from '@/lib/hackathons';

function parseIsoDate(input: string): Date | null {
  if (!input) return null;
  const parsed = new Date(`${input}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  return `${year}${month}${day}`;
}

function escapeICSText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function toICSEvent(event: HackathonRecord, index: number): string | null {
  const startDate = parseIsoDate(event.startdate);
  const endDateRaw = parseIsoDate(event.enddate) ?? startDate;
  if (!startDate || !endDateRaw) return null;

  const endDateExclusive = new Date(endDateRaw);
  endDateExclusive.setUTCDate(endDateExclusive.getUTCDate() + 1);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const lines = [
    'BEGIN:VEVENT',
    `UID:${escapeICSText(event.event_key || `${event.name}-${index}`)}@hackathonscanada.org`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${toICSDate(startDate)}`,
    `DTEND;VALUE=DATE:${toICSDate(endDateExclusive)}`,
    `SUMMARY:${escapeICSText(event.name || 'Hackathon')}`,
    `LOCATION:${escapeICSText(event.location || 'TBD')}`,
    `DESCRIPTION:${escapeICSText(`${event.hybridinfo || 'Hackathon'}${event.url ? ` - ${event.url}` : ''}`)}`,
    event.url ? `URL:${escapeICSText(event.url)}` : '',
    'END:VEVENT',
  ].filter(Boolean);

  return lines.join('\r\n');
}

function buildCalendar(events: HackathonRecord[]): string {
  const body = events
    .map((event, index) => toICSEvent(event, index))
    .filter((entry): entry is string => Boolean(entry))
    .join('\r\n');

  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hackathons Canada//Hackathon Database//EN', 'CALSCALE:GREGORIAN', body, 'END:VCALENDAR'].join('\r\n');
}

export async function GET(request: NextRequest) {
  const eventKey = request.nextUrl.searchParams.get('eventKey');
  const events = await getHackathons();

  const selected = eventKey ? events.filter((event) => event.event_key === eventKey) : events;
  if (selected.length === 0) {
    return NextResponse.json({ error: 'No events found for calendar export.' }, { status: 404 });
  }

  const ics = buildCalendar(selected);
  const filename = eventKey ? 'hackathon.ics' : 'hackathons-canada-all.ics';

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
