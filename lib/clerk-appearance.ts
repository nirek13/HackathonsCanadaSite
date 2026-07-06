export const clerkAppearance = {
  variables: {
    colorPrimary: '#1d2a44',
    colorBackground: '#f4ebd9',
    colorText: '#1d2a44',
    colorTextSecondary: 'rgba(29, 42, 68, 0.6)',
    colorInputBackground: '#ffffff',
    colorInputText: '#1d2a44',
    borderRadius: '0.75rem',
    fontFamily: 'var(--font-figtree), sans-serif',
    fontFamilyButtons: 'var(--font-space-mono), monospace',
  },
  elements: {
    rootBox: 'mx-auto w-full',
    card: 'rounded-3xl border border-hna-blue/10 bg-hna-neutral shadow-[0_24px_60px_-42px_rgba(29,42,68,0.6)]',
    headerTitle: 'font-[family-name:var(--font-newsreader)] text-2xl tracking-tight',
    headerSubtitle: 'font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em]',
    socialButtonsBlockButton:
      'rounded-full border border-hna-blue/20 bg-white text-hna-blue hover:bg-hna-blue hover:text-white transition',
    socialButtonsBlockButtonText: 'font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.15em]',
    formButtonPrimary:
      'rounded-full bg-hna-red text-white hover:bg-hna-red/90 font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em]',
    footerActionLink: 'text-hna-blue hover:text-hna-blue/70',
    formFieldInput: 'rounded-xl border border-hna-blue/10 bg-white',
    dividerLine: 'bg-hna-blue/10',
    dividerText: 'font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-[0.2em] text-hna-blue/50',
    userButtonPopoverCard: 'rounded-2xl border border-hna-blue/10 shadow-lg',
    userButtonPopoverActionButton: 'hover:bg-hna-blue/5',
    userPreviewMainIdentifier: 'font-[family-name:var(--font-newsreader)]',
    userPreviewSecondaryIdentifier: 'font-[family-name:var(--font-space-mono)] text-xs',
  },
};
