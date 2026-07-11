import Link from 'next/link';
import { CloudRain } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-primary text-white shadow-md">
      <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange rounded-md px-2 py-1">
        <CloudRain className="w-8 h-8" aria-hidden="true" />
        <span className="text-xl font-bold tracking-wide">VarunaSutra</span>
      </Link>
      <div className="flex gap-4">
        <Link 
          href="/methodology" 
          className="hover:text-accent-orange transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange rounded-md px-2 py-1"
        >
          Methodology
        </Link>
      </div>
    </nav>
  );
}
