import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileText, ShieldCheck } from "lucide-react";

const preparationSteps = [
  {
    title: "Describe the problem",
    description:
      "Include the symptoms, when they started, and any relevant service history.",
    icon: FileText,
  },
  {
    title: "Review the listing",
    description:
      "Compare the service scope, price, location, and professional details shown.",
    icon: ShieldCheck,
  },
  {
    title: "Confirm before work",
    description:
      "Discuss the diagnosis, work needed, and final price with the professional.",
    icon: ClipboardCheck,
  },
];

export default function BookingGuidanceSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Before your appointment
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Make your service visit easier to plan.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Clear information helps you compare options and have a productive
            conversation with your home-service professional.
          </p>
          <Link
            href="/service"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Explore available services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {preparationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-semibold text-card-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
