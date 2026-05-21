import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { localizedPath } from "@/lib/locale-path";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-primary/70">404</p>
      <h1 className="mt-3 font-headline text-6xl">Page Not Found</h1>
      <p className="mt-5 max-w-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href={localizedPath("/", defaultLocale)}
        className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}
