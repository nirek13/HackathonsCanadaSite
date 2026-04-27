'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarPlus, ChevronDown, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { HackathonRecord } from '@/lib/hackathons';

interface AddCalendarDropdownProps {
  event: HackathonRecord;
  align?: 'left' | 'right';
  className?: string;
}

export function AddCalendarDropdown({ event, align = 'right', className = '' }: AddCalendarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const formatDate = (dateStr: string, addDay = false) => {
    const date = new Date(`${dateStr}T00:00:00Z`);
    if (addDay) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return date.toISOString().replace(/[-:]/g, '').split('T')[0];
  };

  const title = encodeURIComponent(event.name);
  const location = encodeURIComponent(event.location || 'TBD');
  const details = encodeURIComponent(`${event.hybridinfo || 'Hackathon'}${event.url ? ` - ${event.url}` : ''}`);
  const startDate = formatDate(event.startdate);
  const endDate = formatDate(event.enddate, true);

  const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  const outlookWebUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${details}&location=${location}`;
  const icsUrl = `/api/calendar?eventKey=${encodeURIComponent(event.event_key)}`;

  const options = [
    { name: 'Google Calendar', url: googleUrl, external: true },
    { name: 'Apple Calendar', url: icsUrl, external: false },
    { name: 'Outlook (Web)', url: outlookWebUrl, external: true },
    { name: 'Outlook (Desktop)', url: icsUrl, external: false },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/20 bg-white px-4 text-[10px] uppercase tracking-[0.15em] text-black transition hover:border-black hover:bg-black hover:text-white"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        <CalendarPlus className="h-4 w-4" />
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-50 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_12px_35px_-12px_rgba(0,0,0,0.3)] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="space-y-0.5">
              {options.map((opt) => (
                <a
                  key={opt.name}
                  href={opt.url}
                  target={opt.external ? '_blank' : undefined}
                  rel={opt.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[11px] uppercase tracking-[0.1em] text-black/70 transition hover:bg-black/5 hover:text-black"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {opt.name}
                  {opt.external && <ExternalLink className="h-3 w-3 opacity-40" />}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
