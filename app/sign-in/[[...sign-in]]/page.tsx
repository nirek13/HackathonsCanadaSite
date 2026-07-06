import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { clerkAppearance } from '@/lib/clerk-appearance';

export const metadata: Metadata = {
  title: 'Sign In | Hackathons North America',
  description: 'Sign in to your Hackathons North America account.',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-hna-neutral px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.36em] text-hna-blue/55"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            welcome back
          </p>
          <h1
            className="mt-3 text-3xl tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-newsreader)' }}
          >
            sign in to HNA
          </h1>
        </div>
        <SignIn
          appearance={clerkAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/account"
        />
      </div>
    </div>
  );
}
