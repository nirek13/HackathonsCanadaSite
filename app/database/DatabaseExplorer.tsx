'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Download, ExternalLink, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import type { HackathonRecord } from '@/lib/hackathons';
import { AddCalendarDropdown } from '@/components/AddCalendarDropdown';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
};

type DateFilter = 'all' | 'upcoming' | 'ongoing' | 'past';
type FormatFilter = 'all' | 'in-person' | 'virtual' | 'hybrid' | 'unknown';

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const isValid = !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());
  if (!isValid) return `${start} - ${end}`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sMonth = months[startDate.getMonth()];
  const sDay = startDate.getDate();
  const sYear = startDate.getFullYear();
  const eMonth = months[endDate.getMonth()];
  const eDay = endDate.getDate();
  const eYear = endDate.getFullYear();

  if (sMonth === eMonth && sYear === eYear && sDay === eDay) return `${sMonth} ${sDay}, ${sYear}`;
  if (sMonth === eMonth && sYear === eYear) return `${sMonth} ${sDay} - ${eDay}, ${sYear}`;
  return `${sMonth} ${sDay}, ${sYear} - ${eMonth} ${eDay}, ${eYear}`;
}

function fallbackImage(event: HackathonRecord) {
  return event.fgimage || event.bgimage || '/favicon.ico';
}

function getDateState(event: HackathonRecord): Exclude<DateFilter, 'all'> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(`${event.startdate}T00:00:00`);
  const end = new Date(`${event.enddate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'upcoming';
  if (today < start) return 'upcoming';
  if (today > end) return 'past';
  return 'ongoing';
}

function getFormatState(event: HackathonRecord): Exclude<FormatFilter, 'all'> {
  const value = (event.hybridinfo || '').toLowerCase();
  if (value.includes('hybrid')) return 'hybrid';
  if (value.includes('virtual') || value.includes('online') || value.includes('remote')) return 'virtual';
  if (value.includes('in-person') || value.includes('in person') || value.includes('onsite') || value.includes('on-site')) {
    return 'in-person';
  }
  return 'unknown';
}

function sourceLabel(source?: string): string {
  return source?.trim() || 'community';
}

function eventToneClass(event: HackathonRecord, index: number): string {
  const marker = `${event.name} ${sourceLabel(event.source)}`.toLowerCase();
  const brandTones: Array<{ key: string; tone: string }> = [
    { key: 'google', tone: 'from-[#e8f0fe] via-[#fff7eb] to-[#eaf7ee]' },
    { key: 'microsoft', tone: 'from-[#eef7ff] via-[#f5f3ff] to-[#fff4ed]' },
    { key: 'github', tone: 'from-[#eef1f6] via-[#f6f7fb] to-[#f0f3fb]' },
    { key: 'hack canada', tone: 'from-[#f3ecff] via-[#fff1f4] to-[#eef5ff]' },
    { key: 'stan', tone: 'from-[#efe9ff] via-[#f6f2ff] to-[#fff3ef]' },
  ];
  const matchedTone = brandTones.find(({ key }) => marker.includes(key));
  if (matchedTone) return matchedTone.tone;

  const defaultTones = [
    'from-[#f8efe5] via-[#fffaf4] to-white',
    'from-[#eaf3ff] via-[#f3f8ff] to-white',
    'from-[#f0efe8] via-[#f7f5ef] to-white',
    'from-[#f4ebff] via-[#faf4ff] to-white',
  ];
  return defaultTones[index % defaultTones.length];
}

function cardFrameClass(index: number): string {
  const variants = [
    '[clip-path:polygon(0%_0%,95%_0%,100%_10%,100%_100%,7%_100%,0%_90%)]',
    '[clip-path:polygon(4%_0%,100%_0%,100%_88%,96%_100%,0%_100%,0%_12%)]',
    '[clip-path:polygon(0%_0%,93%_0%,100%_12%,100%_100%,0%_100%,0%_8%)]',
  ];
  return variants[index % variants.length];
}

function hasActiveFilters(query: string, dateFilter: DateFilter, formatFilter: FormatFilter, sourceFilter: string) {
  return query.trim().length > 0 || dateFilter !== 'all' || formatFilter !== 'all' || sourceFilter !== 'all';
}

interface DatabaseExplorerProps {
  events: HackathonRecord[];
  loadError: string | null;
}

export function DatabaseExplorer({ events, loadError }: DatabaseExplorerProps) {
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const sources = useMemo(() => {
    const unique = Array.from(new Set(events.map((event) => sourceLabel(event.source)))).sort((a, b) =>
      a.localeCompare(b),
    );
    return ['all', ...unique];
  }, [events]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((event) => {
      const format = getFormatState(event);
      const dateState = getDateState(event);
      const source = sourceLabel(event.source);

      const matchesQuery =
        normalized.length === 0 ||
        event.name.toLowerCase().includes(normalized) ||
        (event.location || '').toLowerCase().includes(normalized) ||
        (event.hybridinfo || '').toLowerCase().includes(normalized) ||
        source.toLowerCase().includes(normalized);

      const matchesDate = dateFilter === 'all' || dateState === dateFilter;
      const matchesFormat = formatFilter === 'all' || format === formatFilter;
      const matchesSource = sourceFilter === 'all' || source === sourceFilter;
      return matchesQuery && matchesDate && matchesFormat && matchesSource;
    });
  }, [events, query, dateFilter, formatFilter, sourceFilter]);

  return (
    <div className="min-h-screen bg-[#f4f2ef] text-[#171717]">
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-10 md:px-16 lg:px-24 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xs uppercase tracking-[0.45em] text-black/55" style={{ fontFamily: 'var(--font-space-mono)' }}>
              <Image src="/favicon.ico" alt="Hackathons Canada logo" width={16} height={16} className="h-8 w-8" />
              hackathons canada
            </Link>
       
            <h1
              className="mt-5 text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-newsreader)' }}
            >
              discover your next build weekend.
            </h1>
          </div>
        </div>

        <section className="mt-10 border border-black/10 bg-white/70 p-4 shadow-[0_24px_60px_-42px_rgba(0,0,0,0.6)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
            {!loadError && (
              <aside className="border border-black/10 bg-[#faf8f5] p-4 lg:sticky lg:top-6">

                <label className="mt-3 flex items-center gap-2 border border-black/10 bg-white px-3 py-2.5">
                  <Search className="h-4 w-4 text-black/50" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search events..."
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/45"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  />
                </label>

                <div className="mt-3 border border-black/10 bg-white px-3 py-2.5">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/55"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    source
                  </p>
                  <select
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value)}
                    className="w-full bg-transparent text-sm text-black outline-none"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source === 'all' ? 'All sources' : source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 border border-black/10 bg-white p-3">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/55"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    timeline
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'upcoming', 'ongoing', 'past'] as DateFilter[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDateFilter(value)}
                        className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition ${
                          dateFilter === value
                            ? 'border-black bg-black text-white'
                            : 'border-black/20 bg-white text-black/70 hover:border-black/40'
                        }`}
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 border border-black/10 bg-white p-3">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/55"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    format
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'hybrid', 'in-person', 'virtual', 'unknown'] as FormatFilter[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormatFilter(value)}
                        className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition ${
                          formatFilter === value
                            ? 'border-black bg-black text-white'
                            : 'border-black/20 bg-white text-black/70 hover:border-black/40'
                        }`}
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters(query, dateFilter, formatFilter, sourceFilter) ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setDateFilter('all');
                      setFormatFilter('all');
                      setSourceFilter('all');
                    }}
                    className="mt-3 w-full border border-black/20 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/70 transition hover:border-black/45"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    clear filters
                  </button>
                ) : null}

                <a
                  href="/api/calendar"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  <Download className="h-4 w-4" />
                  Subscribe to all
                </a>
              </aside>
            )}

            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p
                  className="text-[11px] uppercase tracking-[0.3em] text-black/60"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {filtered.length} of {events.length} hackathons
                </p>
              </div>

              {loadError && <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">{loadError}</div>}

              {!loadError && events.length === 0 && (
                <div className="mt-4 border border-black/10 bg-[#f8f6f3] p-8 text-center text-black/65">
                  No hackathons found in the database yet.
                </div>
              )}

              {!loadError && events.length > 0 && filtered.length === 0 && (
                <div className="mt-4 border border-black/10 bg-[#f8f6f3] p-8 text-center text-black/65">
                  No results with the current search and filters. Try clearing one filter.
                </div>
              )}

              {!loadError && filtered.length > 0 && (
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((event, index) => (
                    <article
                      key={event.event_key}
                      className={`group relative overflow-hidden border border-black/10 bg-linear-to-br ${eventToneClass(event, index)} ${cardFrameClass(index)} p-6 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.55)] transition hover:-translate-y-1.5`}
                    >
                      <div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-white/45 blur-xl" />
                      <div className="absolute -bottom-10 right-2 h-20 w-20 rounded-full bg-black/5 blur-xl" />
                      <div className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-black/20" />
                      <div className="relative flex flex-col gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fallbackImage(event)}
                            alt={`${event.name} logo`}
                            className="h-12 w-12 border border-black/10 bg-[#f4f2ef] object-cover"
                          />
                          <div className="min-w-0">
                            <h2
                              className="text-2xl leading-tight tracking-tight wrap-break-word"
                              style={{ fontFamily: 'var(--font-newsreader)' }}
                            >
                              {event.name}
                            </h2>
                            <p
                              className="mt-1 text-[10px] uppercase tracking-[0.24em] text-black/55"
                              style={{ fontFamily: 'var(--font-space-mono)' }}
                            >
                              {sourceLabel(event.source)}
                            </p>
                          </div>
                        </div>
                        <div className="self-start">
                          <AddCalendarDropdown event={event} />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className="border border-black/20 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black/70"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          {getDateState(event)}
                        </span>
                        <span
                          className="border border-black/20 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black/70"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          {getFormatState(event)}
                        </span>
                      </div>

                      <p
                        className="mt-4 text-[11px] uppercase tracking-[0.24em] text-black/60"
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        {formatDateRange(event.startdate, event.enddate)}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm text-black/75">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{event.location || 'Location TBA'}</span>
                      </div>

                      <div className="mt-2 text-sm text-black/75">{event.hybridinfo || 'Format TBA'}</div>

                      {event.url ? (
                        <Link
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1 border border-black/20 bg-white/75 px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition hover:border-black"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          Visit Event
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
