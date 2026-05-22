import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          That tool isn’t live yet — or the URL might be wrong.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all tools
        </Link>
      </div>
    </div>
  );
}
