import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { clerkAppearance } from '@/lib/clerk-appearance';

export const metadata: Metadata = {
  title: 'Sign Up | Hackathons North America',
  description: 'Create your Hackathons North America account.',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-hna-neutral px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.36em] text-hna-blue/55"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            join the community
          </p>
          <h1
            className="mt-3 text-3xl tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-newsreader)' }}
          >
            create your account
          </h1>
        </div>
        <SignUp
          appearance={clerkAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/account"
        />
      </div>
    </div>
  );
}
