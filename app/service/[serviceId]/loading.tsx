import { Loader2 } from "lucide-react";

export default function ServiceDetailsLoading() {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mx-auto max-w-6xl">
        {/* Back Link Skeleton */}
        <div className="h-5 w-32 bg-muted rounded-md animate-pulse" />

        {/* Main 2-column details grid */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Service Image Skeleton */}
          <div className="relative min-h-64 sm:min-h-96 rounded-3xl border border-border bg-muted/60 animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs font-medium">Loading service details...</span>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded-full animate-pulse" />
            </div>

            <div className="h-9 w-3/4 bg-muted rounded-xl animate-pulse" />
            <div className="h-4 w-full bg-muted/70 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-muted/70 rounded-md animate-pulse" />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="h-20 rounded-2xl border border-border bg-card p-4 space-y-2 animate-pulse">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-5 w-24 bg-muted rounded" />
              </div>
              <div className="h-20 rounded-2xl border border-border bg-card p-4 space-y-2 animate-pulse">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-5 w-28 bg-muted rounded" />
              </div>
              <div className="h-14 rounded-2xl border border-border bg-card p-4 animate-pulse" />
              <div className="h-14 rounded-2xl border border-border bg-card p-4 animate-pulse" />
            </div>

            <div className="h-12 w-48 bg-primary/20 rounded-xl animate-pulse mt-2" />
          </div>
        </div>

        {/* Info Box Skeleton */}
        <div className="mt-12 h-36 rounded-3xl border border-border bg-card p-6 animate-pulse" />
      </div>
    </main>
  );
}
