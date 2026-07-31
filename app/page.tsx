import HeroBanner from "@/components/Banner/banner";
import ServicesGrid from "@/components/serviceSection/ServicesGrid";
import WhyUsSection from "@/components/WhyusSection/whyussection";





export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/4 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/25 blur-[120px] z-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[110px] z-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/40 to-transparent z-0"
      />

      <div className="relative z-10">
        <HeroBanner />
        <ServicesGrid />
        <WhyUsSection></WhyUsSection>
      </div>
    </div>
  );
}
