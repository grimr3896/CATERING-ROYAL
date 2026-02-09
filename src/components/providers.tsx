'use client';

import { SiteContentProvider } from '@/context/SiteContentContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SiteContentProvider>{children}</SiteContentProvider>;
}
