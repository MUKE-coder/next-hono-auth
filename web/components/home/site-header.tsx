'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Eye,
  GitGraph,
  Home,
  LogIn,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import MainLogo from './main-logo';

export default function SiteHeader() {
  const menuItems = [
    {
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      title: 'Track Application',
      href: '/tracking',
      icon: GitGraph,
    },
  ];
  
  const ctaItems = [
    {
      title: 'Login',
      href: '/auth/login',
      icon: LogIn,
      variant: 'outline' as const,
    },
    {
      title: 'Join UNMU',
      href: '/auth/register',
      icon: UserPlus,
      variant: 'default' as const,
    },
  ];
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 py-2 px-5 border-b border-red-100/20 md:block hidden max-w-7xl mx-auto">
        <div className="container mx-auto flex h-14 items-center">
          <MainLogo
            src="/images/unmu-logo.png"
            alt="UNMU - Uganda Nurses and Midwives Union"
            width={40}
            height={40}
            showText={true}
            text="UNMU"
            variant="compact"
          />

          <nav className="flex flex-1 justify-center">
            <ul className="flex space-x-6">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-red-600 group"
                  >
                    <item.icon className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4 ml-4">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-red-600 hover:bg-red-50"
              href="/auth/login"
            >
              Log in
            </Button>
            <Button
              className="h-10 px-6 text-xs font-medium bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-200 transition-all duration-300"
              href="/auth/register"
            >
              Join UNMU
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header - Simplified */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-red-100/30 py-3 px-4 md:hidden">
        <div className="flex items-center justify-center">
          <MainLogo
            src="/images/unmu-logo.png"
            alt="UNMU - Uganda Nurses and Midwives Union"
            width={35}
            height={35}
            showText={true}
            text="UNMU"
            variant="compact"
          />
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-red-100 md:hidden">
        <div className="grid grid-cols-4 h-16">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors active:scale-95"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Mobile CTAs */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-red-50 border-t border-red-100">
          <Button
            variant="outline"
            size="sm"
            className="h-10 text-xs border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            href="/auth/login"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>

          <Button
            size="sm"
            className="h-10 text-xs bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            href="/auth/register"
          >
            <UserPlus className="h-4 w-4" />
            <span>Join UNMU</span>
          </Button>
        </div>
      </nav>

      {/* Add bottom padding to body content on mobile to account for bottom nav */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 120px; /* Adjust based on your bottom nav height */
          }
        }
      `}</style>
    </>
  );
}