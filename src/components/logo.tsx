import Link from 'next/link';
import { Utensils } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="SAVIE ROYAL Home">
      <Utensils className="h-6 w-6 text-primary" />
      <span className="text-xl font-semibold font-headline">SAVIE ROYAL</span>
    </Link>
  );
}
