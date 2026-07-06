'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, MapPin, Search } from 'lucide-react';
import type { HackathonRecord } from '@/lib/hackathons';
import { AddCalendarDropdown } from '@/components/AddCalendarDropdown';
import { AsciiArt } from "@/components/ui/ascii-art";

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

function statusBadgeClass(state: Exclude<DateFilter, 'all'>): string {
  switch (state) {
    case 'upcoming':
      return 'border-hna-green/30 bg-hna-green/15 text-hna-green';
    case 'ongoing':
      return 'border-hna-warmth/35 bg-hna-warmth/15 text-hna-warmth';
    case 'past':
      return 'border-hna-blue/20 bg-hna-blue/10 text-hna-blue/60';
  }
}

function eventToneClass(event: HackathonRecord, index: number): string {
  const marker = `${event.name} ${sourceLabel(event.source)}`.toLowerCase();
  const brandTones: Array<{ key: string; tone: string }> = [
    { key: 'google', tone: 'from-[#f4ebd9] via-[#faf4ea] to-[#edf2ea]' },
    { key: 'microsoft', tone: 'from-[#e8edf5] via-[#f4ebd9] to-[#f5ebe3]' },
    { key: 'github', tone: 'from-[#ede8e3] via-[#f4ebd9] to-[#e8edf5]' },
    { key: 'hack canada', tone: 'from-[#f5e8ea] via-[#f4ebd9] to-[#eaeef5]' },
    { key: 'stan', tone: 'from-[#f0ebe3] via-[#f4ebd9] to-[#edf2ea]' },
  ];
  const matchedTone = brandTones.find(({ key }) => marker.includes(key));
  if (matchedTone) return matchedTone.tone;

  const defaultTones = [
    'from-[#f4ebd9] via-[#faf4ea] to-white',
    'from-[#e8edf5] via-[#f3f0e8] to-white',
    'from-[#f0ebe3] via-[#f8f2e8] to-white',
    'from-[#edf2ea] via-[#f4ebd9] to-white',
  ];
  return defaultTones[index % defaultTones.length];
}

function hasActiveFilters(query: string, dateFilter: DateFilter, formatFilter: FormatFilter, sourceFilter: string) {
  return query.trim().length > 0 || dateFilter !== 'all' || formatFilter !== 'all' || sourceFilter !== 'all';
}

const HACKATHONS_PAGE_SIZE = 8;

interface DatabaseExplorerProps {
  events: HackathonRecord[];
  loadError: string | null;
}

export function DatabaseExplorer({ events, loadError }: DatabaseExplorerProps) {
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(HACKATHONS_PAGE_SIZE);

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

  useEffect(() => {
    setVisibleCount(HACKATHONS_PAGE_SIZE);
  }, [query, dateFilter, formatFilter, sourceFilter]);

  const visibleHackathons = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const canSeeMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-hna-neutral text-hna-blue overflow-x-hidden">
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-10 md:px-16 lg:px-24 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
  <div className="relative w-full">
    <div className="flex flex-col gap-2">
      <Link
        href="/"
        className="flex items-center gap-2 text-xs uppercase tracking-[0.45em] text-hna-blue/55"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        <Image src="/favicon.ico" alt="HNA logo" width={16} height={16} className="h-8 w-8" />
        HNA
      </Link>
      <div className="relative flex items-end">
        <h1
          className="max-w-3xl text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          style={{ fontFamily: 'var(--font-newsreader)' }}
        >
          discover your next <span className="text-hna-red">build weekend.</span>
        </h1>
        <div className="absolute right-0 -translate-x-1/3 translate-y-1/3 pointer-events-none">
          <AsciiArt
            src="https://i.imgur.com/NviPNAY.jpeg"
            resolution={100}
            color="#1d2a44"
            animationStyle="none"
            invert={true}
            className="aspect-square w-40 sm:w-52 lg:w-64 bg-transparent opacity-40 mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  </div>
</div>

        <section className="mt-10 border border-hna-blue/10 bg-white/70 p-4 shadow-[0_24px_60px_-42px_rgba(29,42,68,0.6)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
            {!loadError && (
              <aside className="border border-hna-blue/10 border-l-4 border-l-hna-red bg-hna-neutral-soft p-4 lg:sticky lg:top-6">

                <label className="mt-3 flex items-center gap-2 border border-hna-blue/10 bg-white px-3 py-2.5">
                  <Search className="h-4 w-4 text-hna-blue/50" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search events..."
                    className="w-full bg-transparent text-sm text-hna-blue outline-none placeholder:text-hna-blue/45"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  />
                </label>

                <div className="mt-3 border border-hna-blue/10 bg-white px-3 py-2.5">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-hna-blue/55"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    source
                  </p>
                  <select
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value)}
                    className="w-full bg-transparent text-sm text-hna-blue outline-none"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source === 'all' ? 'All sources' : source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 border border-hna-blue/10 bg-white p-3">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-hna-blue/55"
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
                            ? 'border-hna-red bg-hna-red text-white'
                            : 'border-hna-blue/20 bg-white text-hna-blue/70 hover:border-hna-blue/40'
                        }`}
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 border border-hna-blue/10 bg-white p-3">
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.22em] text-hna-blue/55"
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
                            ? 'border-hna-red bg-hna-red text-white'
                            : 'border-hna-blue/20 bg-white text-hna-blue/70 hover:border-hna-blue/40'
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
                    className="mt-3 w-full border border-hna-blue/20 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-hna-blue/70 transition hover:border-hna-blue/45"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    clear filters
                  </button>
                ) : null}

                <a
                  href="/api/calendar"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-hna-red bg-hna-red px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white transition hover:-translate-y-0.5 hover:bg-hna-red/90"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  <Download className="h-4 w-4" />
                  Subscribe to all
                </a>
              </aside>
            )}

            <div>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-hna-blue/10 pb-6">
                <div>
                  <p
                    className="text-[11px] uppercase tracking-[0.36em] text-hna-red"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    live database
                  </p>
                  <h2
                    className="mt-2 text-3xl leading-tight tracking-tight sm:text-4xl"
                    style={{ fontFamily: 'var(--font-newsreader)' }}
                  >
                    {filtered.length} hackathon{filtered.length === 1 ? '' : 's'}
                  </h2>
                </div>
                <p
                  className="text-[10px] uppercase tracking-[0.22em] text-hna-blue/50"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {events.length} total in north america
                </p>
              </div>

              {loadError && <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">{loadError}</div>}

              {!loadError && events.length === 0 && (
                <div className="mt-4 border border-hna-blue/10 bg-hna-neutral-muted p-8 text-center text-hna-blue/65">
                  No hackathons found in the database yet.
                </div>
              )}

              {!loadError && events.length > 0 && filtered.length === 0 && (
                <div className="mt-4 border border-hna-blue/10 bg-hna-neutral-muted p-8 text-center text-hna-blue/65">
                  No results with the current search and filters. Try clearing one filter.
                </div>
              )}

              {!loadError && filtered.length > 0 && (
                <div className="mt-6 space-y-10">
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {visibleHackathons.map((event, index) => {
                      const dateState = getDateState(event);
                      const formatState = getFormatState(event);

                      return (
                    <article
                      key={event.event_key}
                      className="group relative flex flex-col overflow-hidden rounded-3xl border border-hna-blue/10 bg-white shadow-[0_18px_48px_-28px_rgba(29,42,68,0.4)] transition duration-300 hover:-translate-y-1.5 hover:border-hna-red/30 hover:shadow-[0_32px_64px_-24px_rgba(114,28,36,0.22)]"
                    >
                      <div className="relative aspect-video overflow-hidden bg-hna-blue">
                        {event.bgimage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.bgimage}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`h-full w-full bg-linear-to-br ${eventToneClass(event, index)}`} />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-hna-blue/80 via-hna-blue/25 to-hna-blue/5" />
                        <span
                          className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur-sm ${statusBadgeClass(dateState)}`}
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          {dateState}
                        </span>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fallbackImage(event)}
                            alt={`${event.name} logo`}
                            className="h-11 w-11 shrink-0 rounded-xl border border-white/25 bg-white/90 object-cover shadow-md"
                          />
                          <h2
                            className="text-xl leading-tight tracking-tight text-white sm:text-2xl"
                            style={{ fontFamily: 'var(--font-newsreader)' }}
                          >
                            {event.name}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <p
                          className="text-[11px] uppercase tracking-[0.24em] text-hna-red"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          {formatDateRange(event.startdate, event.enddate)}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-sm text-hna-blue/75">
                          <MapPin className="h-4 w-4 shrink-0 text-hna-red/70" />
                          <span className="truncate">{event.location || 'Location TBA'}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className="rounded-full bg-hna-neutral px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-hna-blue/70"
                            style={{ fontFamily: 'var(--font-space-mono)' }}
                          >
                            {formatState}
                          </span>
                          <span
                            className="rounded-full bg-hna-neutral px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-hna-blue/70"
                            style={{ fontFamily: 'var(--font-space-mono)' }}
                          >
                            {sourceLabel(event.source)}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-hna-blue/8 pt-5">
                          <AddCalendarDropdown event={event} />
                          {event.url ? (
                            <Link
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-hna-blue px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition group-hover:bg-hna-red"
                              style={{ fontFamily: 'var(--font-space-mono)' }}
                            >
                              visit
                              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </article>
                      );
                    })}
                  </div>
                  {canSeeMore ? (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + HACKATHONS_PAGE_SIZE)}
                        className="border border-hna-red/25 bg-white px-8 py-3 text-[10px] uppercase tracking-[0.28em] text-hna-red/80 transition hover:border-hna-red hover:bg-hna-red hover:text-white"
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        See more
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
