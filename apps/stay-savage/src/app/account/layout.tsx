'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@ecom/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AccountNav } from '@/components/AccountNav';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/auth/login?redirect=/account');
    }
  }, [isAuthenticated, router]);

  const handleSignOut = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="flex flex-col gap-2 mb-10 max-w-3xl">
            <Eyebrow>Your Account</Eyebrow>
            <Heading variant="inner" as="h1">
              {user?.firstName ? `Welcome back, ${user.firstName}` : 'Your account'}
            </Heading>
            {user?.email ? (
              <p className="text-bone/60 text-[14px]">{user.email}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
            <AccountNav onSignOut={handleSignOut} />
            <div>{children}</div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
