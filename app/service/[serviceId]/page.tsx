import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { getServiceByIdAction, getServicesAction } from "../serviceAction";

type ServiceDetails = {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  categoryId?: string;
  category?: { id?: string; name?: string; description?: string };
  image?: string | null;
  imageUrl?: string | null;
  estimatedDuration?: string;
  warrantyPeriod?: string;
  technician?: {
    experienceYrs?: number;
    hourlyRate?: string | number;
    isVerified?: boolean;
    city?: string | null;
    address?: string | null;
    avgRating?: number;
    totalReviews?: number;
    user?: { name?: string };
  };
};

type ServiceListResult = {
  success: boolean;
  data: ServiceDetails[];
  error?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const result = await getServiceByIdAction(serviceId);
  if (!result.success || !result.data) {
    return { title: "Service details" };
  }

  return {
    title: result.data.name,
    description:
      result.data.description || `Details and booking information for ${result.data.name}.`,
  };
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const result = await getServiceByIdAction(serviceId);
  if (!result.success) {
    throw new Error(result.error || "Unable to load service details.");
  }
  if (!result.data) notFound();

  const service = result.data as ServiceDetails;
  const relatedResult = (await getServicesAction()) as ServiceListResult;
  const relatedServices = relatedResult.success
    ? relatedResult.data
        .filter(
          (item) =>
            item.id !== service.id &&
            (!service.categoryId ||
              item.categoryId === service.categoryId ||
              item.category?.id === service.categoryId),
        )
        .slice(0, 4)
    : [];

  const technician = service.technician;
  const location = technician?.city || technician?.address;
  const rating = Number(technician?.avgRating || 0);
  const price = Number(service.price);

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/service"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="relative min-h-64 overflow-hidden rounded-3xl border border-border bg-muted sm:min-h-96">
            <Image
              src={service.imageUrl || service.image || "/service.jpg"}
              alt={service.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              {service.category?.name && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {service.category.name}
                </span>
              )}
              {technician?.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified professional
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {service.name}
            </h1>
            {service.description && (
              <p className="mt-4 whitespace-pre-line leading-7 text-muted-foreground">
                {service.description}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Service price
                </p>
                <p className="mt-1 text-xl font-bold">
                  ৳{Number.isFinite(price) ? price.toLocaleString("en-BD") : "Contact for quote"}
                </p>
              </div>
              {technician?.user?.name && (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Professional
                  </p>
                  <p className="mt-1 font-semibold">{technician.user.name}</p>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{location}</span>
                </div>
              )}
              {rating > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({technician?.totalReviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <Link
              href={`/booking?serviceId=${encodeURIComponent(service.id)}`}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:w-fit"
            >
              Book this service <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-bold">Service information</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Category", service.category?.name],
              [
                "Experience",
                technician?.experienceYrs
                  ? `${technician.experienceYrs} years`
                  : undefined,
              ],
              ["Estimated duration", service.estimatedDuration],
              ["Warranty", service.warrantyPeriod],
            ]
              .filter((entry): entry is [string, string] => Boolean(entry[1]))
              .map(([label, value]) => (
                <div key={label} className="rounded-xl bg-muted/60 p-4">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">{value}</dd>
                </div>
              ))}
          </dl>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-bold">Reviews & ratings</h2>
          {rating > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Customers have rated this professional {rating.toFixed(1)} out of
              5 from {technician?.totalReviews || 0} reviews.
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No customer ratings are available for this professional yet.
            </p>
          )}
        </section>

        {relatedServices.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">Related services</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/service/${related.id}`}
                  className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
                >
                  <p className="font-semibold">{related.name}</p>
                  {related.category?.name && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {related.category.name}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View details <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
