import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Tag,
  Share2,
  Bookmark,
  CheckCircle2,
  Home,
  Zap,
  Droplets,
  ShieldCheck,
  BookOpen,
  MessageCircle,
} from "lucide-react";

// ============================================================================
// TYPES & DATA (shared with blog listing)
// ============================================================================

const BLOG_POSTS = [
  {
    id: "1",
    slug: "top-10-home-maintenance-tips-2026",
    title: "Top 10 Home Maintenance Tips to Save Thousands in 2026",
    excerpt:
      "A well-maintained home saves you from costly emergency repairs. Follow these 10 expert-recommended tips to keep your property in perfect shape year-round.",
    category: "maintenance",
    author: "Tanvir Ahmed",
    authorRole: "Senior Home Technician",
    publishedAt: "2026-10-01",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80",
    featured: true,
    tags: ["maintenance", "cost-saving", "home-care"],
    content: `
Taking care of your home proactively is the single best investment you can make as a homeowner. Studies consistently show that homes with regular maintenance schedules cost 30-50% less in emergency repairs over a 10-year period.

## 1. Check and Clean Gutters Every 6 Months
Clogged gutters cause water to back up and damage your roof, siding, and foundation. In Bangladesh's climate, debris accumulates rapidly. Clean them before the monsoon and again in autumn.

## 2. Service Your AC Unit Annually
An air conditioner running with dirty filters and coils uses 15% more electricity and has a 40% shorter lifespan. Schedule professional servicing every year — ideally before summer.

## 3. Test All Smoke and CO Detectors Monthly
Press the test button monthly. Replace batteries twice a year. Replace the entire unit every 10 years. This 30-second task has saved countless lives.

## 4. Inspect Plumbing Under Sinks Quarterly  
Slow drips under sinks cause mold, wood rot, and structural damage. Take 5 minutes every three months to check hose connections, P-traps, and the area under each sink.

## 5. Re-caulk Bathroom Tiles and Tubs Annually
Caulk degrades and cracks over time, allowing water to seep behind tiles and walls. Remove old caulk with a utility knife, clean the gap, and apply fresh silicone caulk annually.

## 6. Flush Your Water Heater Yearly
Mineral sediment builds up at the bottom of water heaters, reducing efficiency and causing premature failure. Attach a hose and flush 3-4 gallons annually to extend your heater's life significantly.

## 7. Clean Dryer Vents Every Year  
Lint-clogged dryer vents are a leading cause of house fires. Disconnect the vent hose from the back of the dryer and clean it with a long-handled brush annually.

## 8. Inspect Your Roof After Every Major Storm
Missing shingles, cracked flashing, and damaged gutters should be addressed immediately. Small roof repairs cost ৳2,000–৳8,000. A full roof replacement can cost ৳150,000+.

## 9. Check Door and Window Weatherstripping Annually
Worn weatherstripping allows conditioned air to escape, significantly raising your electricity bill. Press your hand along door and window edges on a windy day to feel for drafts.

## 10. Have Electrical Panels Inspected Every 5 Years
Overloaded circuits, old wiring, and faulty breakers are safety hazards. A licensed electrician can identify issues before they become dangerous — and identify ways to optimize your electrical load.

## The Bottom Line
The most expensive home repairs are almost always preventable ones that were ignored. Spend a little time and money regularly, and you'll save enormously in the long run. And when you do need expert help, FixItNow connects you with verified professionals who work to the same high standards described in this guide.
    `,
  },
  {
    id: "2",
    slug: "signs-your-electrical-wiring-needs-upgrading",
    title: "5 Warning Signs Your Electrical Wiring Needs Upgrading",
    excerpt:
      "Outdated electrical wiring is a leading cause of house fires. Learn to identify the warning signs before they become dangerous.",
    category: "electrical",
    author: "Kazi Nabil",
    authorRole: "Certified Electrician",
    publishedAt: "2026-09-22",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["electrical", "safety", "wiring"],
    content: `
Electrical fires account for a significant proportion of residential fires in Bangladesh each year. Most are preventable — if you know what warning signs to look for.

## Sign 1: Flickering or Dimming Lights
Occasional flickering during storms is normal. Persistent flickering — especially when you turn on appliances — indicates loose wiring connections or an overloaded circuit. Do not ignore this.

## Sign 2: Frequently Tripping Breakers
A circuit breaker that trips more than once a month is telling you something. It means the circuit is drawing more current than it was designed for, or there is a fault somewhere in the wiring.

## Sign 3: Outlets That Feel Warm or Show Scorch Marks
Warm outlets, discoloration around switch plates, or burn smells are immediate red flags. Unplug everything from that circuit and call a licensed electrician the same day.

## Sign 4: Old Two-Prong Outlets Throughout the Home
Modern appliances require grounded three-prong outlets. If your home still has predominantly two-prong outlets, the wiring is likely 30+ years old and may not meet current safety standards.

## Sign 5: A Fuse Box Instead of a Circuit Breaker Panel
Homes with fuse boxes (common in buildings constructed before the 1990s) have wiring systems that were not designed for today's electrical loads. Upgrading to a modern panel is strongly recommended.

## When to Call an Electrician Immediately
- Burning smell from outlets or walls
- Sparks when plugging in appliances  
- Buzzing or crackling sounds from walls
- Any sign of water near electrical panels

Never delay electrical repairs. The cost of professional diagnosis (৳1,500–৳3,000) is negligible compared to the potential consequences of electrical fires.
    `,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMarkdown(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-8 mb-3 text-xl font-bold text-foreground">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="ml-4 text-sm leading-7 text-muted-foreground list-disc">
          {line.replace("- ", "")}
        </li>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="mb-4 text-sm leading-7 text-muted-foreground">
          {line}
        </p>
      );
    }
  }
  return elements;
}

// ============================================================================
// METADATA GENERATION
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return {
    title: post ? `${post.title} | FixItNow Blog` : "Blog Post | FixItNow",
    description: post?.excerpt ?? "Read expert home service advice on the FixItNow blog.",
  };
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === post?.category
  ).slice(0, 2);
  const otherPosts = BLOG_POSTS.filter(
    (p) => p.slug !== slug && !relatedPosts.includes(p)
  ).slice(0, Math.max(0, 2 - relatedPosts.length));
  const suggestedPosts = [...relatedPosts, ...otherPosts].slice(0, 2);

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background pt-20">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This article may have been moved or deleted.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Image */}
      <div className="relative h-[50vh] max-h-[500px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Article Content */}
          <article className="lg:col-span-2 -mt-16 relative">
            {/* Back Link */}
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>

            {/* Category Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.readTime} read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>

            {/* Author & Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {post.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                <button
                  id="share-article-btn"
                  className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-3 py-1.5 hover:bg-muted transition-colors"
                  title="Share article"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
                <button
                  id="bookmark-article-btn"
                  className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-3 py-1.5 hover:bg-muted transition-colors"
                  title="Save article"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Save
                </button>
              </div>
            </div>

            {/* Article Body */}
            <div className="mt-8 prose-sm">
              {post.content ? (
                <div>{formatMarkdown(post.content)}</div>
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              )}
            </div>

            {/* Tags */}
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?q=${tag}`}
                  className="rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors capitalize"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Need a professional?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    FixItNow connects you with verified local technicians for any home service need.
                  </p>
                  <Link
                    href="/service"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Browse Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 pt-4 lg:pt-0 lg:mt-16">
            {/* Author Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {post.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                A verified FixItNow professional with years of hands-on experience helping homeowners across Bangladesh.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Verified Professional</span>
              </div>
            </div>

            {/* Related Posts */}
            {suggestedPosts.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-sm font-bold text-foreground">More Articles</h2>
                <div className="space-y-4">
                  {suggestedPosts.map((relPost) => (
                    <Link
                      key={relPost.id}
                      href={`/blog/${relPost.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={relPost.image}
                          alt={relPost.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {relPost.title}
                        </p>
                        <span className="mt-1 text-[10px] text-muted-foreground">
                          {relPost.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* AI Assistant CTA */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <MessageCircle className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Have a question?</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask our AI assistant for personalized home-service guidance.
              </p>
              <button
                id="open-assistant-from-blog"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                onClick={() => {
                  (document.querySelector("[aria-label='Open support assistant']") as HTMLButtonElement)?.click();
                }}
              >
                Chat with assistant
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
