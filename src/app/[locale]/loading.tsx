import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-14">
      <Skeleton className="h-12 w-1/3 rounded-2xl" />
      <Skeleton className="mt-4 h-5 w-2/3 rounded-xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-3xl border border-primary/10 p-4">
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <Skeleton className="mt-4 h-6 w-3/4 rounded-xl" />
            <Skeleton className="mt-2 h-4 w-full rounded-lg" />
            <Skeleton className="mt-1 h-4 w-2/3 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
