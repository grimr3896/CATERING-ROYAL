'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const mobileLinkVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-between">
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-muted rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary-foreground'
                    : 'text-foreground/70'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="active-nav-link"
                    className="absolute inset-0 z-[-1] bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Logo />
                  </div>
                  <motion.nav
                    initial="closed"
                    animate={mobileMenuOpen ? 'open' : 'closed'}
                    variants={mobileNavVariants}
                    className="flex flex-col items-start space-y-2 p-4 text-lg font-medium"
                  >
                    {navLinks.map((link) => (
                      <motion.div
                        key={link.href}
                        variants={mobileLinkVariants}
                        className="w-full"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'transition-colors hover:text-foreground/80 block w-full p-2 rounded-md',
                            pathname === link.href
                              ? 'text-foreground bg-muted'
                              : 'text-foreground/60'
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                     <motion.div variants={mobileLinkVariants} className="w-full border-t mt-4 pt-4">
                      <Button asChild className="w-full">
                        <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>Book Your Event</Link>
                      </Button>
                    </motion.div>
                  </motion.nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center justify-end flex-1 md:flex-initial">
             <Button asChild className="hidden md:flex">
                <Link href="/booking">Book Your Event</Link>
              </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
