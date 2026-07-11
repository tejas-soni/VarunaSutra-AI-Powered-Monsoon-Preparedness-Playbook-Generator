import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto py-6 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
      <p className="text-sm text-muted">
        VarunaSutra &copy; {new Date().getFullYear()}. Built for PromptWars Monsoon Challenge.
      </p>
      <div className="mt-2 space-x-4">
        <Link href="/methodology" className="text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
          How it works
        </Link>
      </div>
    </footer>
  );
}
