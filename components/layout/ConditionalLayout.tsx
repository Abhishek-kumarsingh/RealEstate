'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WelcomeChatbox from '@/components/chat/WelcomeChatbox';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're on a dashboard page
  const isDashboard = pathname.startsWith('/dashboard');
  
  // For dashboard pages, return children without header/footer
  if (isDashboard) {
    return <>{children}</>;
  }
  
  // For regular pages, include header and footer
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <WelcomeChatbox />
    </>
  );
}
