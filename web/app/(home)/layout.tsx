import SiteFooter from '@/components/home/site-footer';
import SiteHeader from '@/components/home/site-header';

import React, { ReactNode } from 'react';

export default function FrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      <SiteHeader />
      <div className="min-h-screen flex flex-col max-w-full">{children}</div>
      <SiteFooter />
    </div>
  );
}
