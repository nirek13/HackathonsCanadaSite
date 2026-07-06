'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/database', label: 'hackathons' },
  { href: '/account', label: 'account', auth: true },
];

const mono = { fontFamily: 'var(--font-space-mono)' } as const;

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-xs uppercase tracking-[0.28em] transition-colors ${
        active ? 'text-hna-red' : 'text-hna-blue/55 hover:text-hna-blue'
      }`}
      style={mono}
    >
      {label}
    </Link>
  );
}

function AuthButtons({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <SignInButton mode="redirect">
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-full border border-hna-red/35 bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-hna-red transition hover:border-hna-red hover:bg-hna-red/5"
          style={mono}
        >
          sign in
        </button>
      </SignInButton>
      <SignUpButton mode="redirect">
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-full border border-hna-red bg-hna-red px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-hna-red/90"
          style={mono}
        >
          sign up
        </button>
      </SignUpButton>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hna-blue/10 bg-hna-neutral">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5 sm:px-10 md:px-16 lg:px-24">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-[0.45em] text-hna-blue/55 transition-colors hover:text-hna-blue"
          style={mono}
        >
          <Image src="/favicon.ico" alt="HNA logo" width={20} height={20} className="h-5 w-5 sm:h-6 sm:w-6" />
          HNA
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) =>
            link.auth ? (
              <Show key={link.href} when="signed-in">
                <NavLink href={link.href} label={link.label} active={isActive(link.href)} />
              </Show>
            ) : (
              <NavLink key={link.href} href={link.href} label={link.label} active={isActive(link.href)} />
            ),
          )}
        </div>

        <div className="hidden items-center md:flex">
          <Show when="signed-out">
            <AuthButtons />
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8 border border-hna-blue/10',
                },
              }}
            />
          </Show>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hna-blue/15 text-hna-blue/70 transition hover:border-hna-blue/30 hover:text-hna-blue md:hidden"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-hna-blue/10 bg-hna-neutral md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-5 sm:px-10">
              {navLinks.map((link) =>
                link.auth ? (
                  <Show key={link.href} when="signed-in">
                    <NavLink
                      href={link.href}
                      label={link.label}
                      active={isActive(link.href)}
                      onClick={closeMobile}
                    />
                  </Show>
                ) : (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={isActive(link.href)}
                    onClick={closeMobile}
                  />
                ),
              )}
              <Show when="signed-out">
                <AuthButtons onNavigate={closeMobile} />
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="text-xs uppercase tracking-[0.22em] text-hna-blue/55" style={mono}>
                    your account
                  </span>
                </div>
              </Show>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
