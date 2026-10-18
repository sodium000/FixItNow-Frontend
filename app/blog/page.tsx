"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Tag,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Wrench,
  Zap,
  Droplets,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

// ============================================================================
// DATA
// ============================================================================

const BLOG_CATEGORIES = [
  { id: "all", label: "All Posts", icon: BookOpen },
  { id: "tips", label: "Home Tips", icon: Home },
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "plumbing", label: "Plumbing", icon: Droplets },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "safety", label: "Safety", icon: ShieldCheck },
] as const;

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
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    featured: true,
    tags: ["maintenance", "cost-saving", "home-care"],
  },
  {
    id: "2",
    slug: "signs-your-electrical-wiring-needs-upgrading",
    title: "5 Warning Signs Your Electrical Wiring Needs Upgrading",
    excerpt:
      "Outdated electrical wiring is a leading cause of house fires. Learn to identify the warning signs before they become dangerous — and know when to call a certified electrician.",
    category: "electrical",
    author: "Kazi Nabil",
    authorRole: "Certified Electrician",
    publishedAt: "2026-09-22",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["electrical", "safety", "wiring"],
  },
  {
    id: "3",
    slug: "how-to-fix-a-leaking-kitchen-faucet",
    title: "How to Fix a Leaking Kitchen Faucet: Step-by-Step Guide",
    excerpt:
      "A dripping faucet wastes thousands of liters of water annually. This step-by-step guide shows you what a professional plumber does — and when DIY is enough vs. when to call in expert help.",
    category: "plumbing",
    author: "Farhana Akter",
    authorRole: "Master Plumber",
    publishedAt: "2026-09-15",
    readTime: "8 min",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["plumbing", "diy", "faucet"],
  },
  {
    id: "4",
    slug: "how-to-prepare-your-home-for-monsoon",
    title: "How to Prepare Your Home for Monsoon Season in Bangladesh",
    excerpt:
      "Heavy rains, humidity, and flooding can wreak havoc on unprepared homes. Here's your complete checklist for waterproofing, drainage, and structural inspections before monsoon hits.",
    category: "tips",
    author: "Raisul Islam",
    authorRole: "Home Inspector",
    publishedAt: "2026-09-10",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1504493133-dca1b3d3a5d5?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["monsoon", "waterproofing", "tips"],
  },
  {
    id: "5",
    slug: "ac-servicing-guide-bangladesh",
    title: "The Complete AC Servicing Guide for Bangladesh's Climate",
    excerpt:
      "Bangladesh's hot and humid climate puts extraordinary strain on air conditioners. Learn the optimal servicing schedule, what technicians actually check, and how to extend your AC's lifespan.",
    category: "maintenance",
    author: "Tanvir Ahmed",
    authorRole: "HVAC Specialist",
    publishedAt: "2026-08-28",
    readTime: "9 min",
    image:
      "https://images.unsplash.com/photo-1631049308264-1e82507c4e97?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["ac", "cooling", "maintenance"],
  },
  {
    id: "6",
    slug: "home-safety-checklist-2026",
    title: "Ultimate Home Safety Checklist: 25 Points Every Homeowner Needs",
    excerpt:
      "From smoke detectors to secure window grilles, this comprehensive 25-point safety checklist protects your family and property. Download, print, and check off each item this weekend.",
    category: "safety",
    author: "Mahmud Hasan",
    authorRole: "Safety Inspector",
    publishedAt: "2026-08-15",
    readTime: "10 min",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["safety", "checklist", "security"],
  },
  {
    id: "7",
    slug: "choosing-right-paint-for-bangladeshi-walls",
    title: "How to Choose the Right Paint for Bangladesh's Humid Walls",
    excerpt:
      "Not all paints handle humidity the same way. This guide explains the difference between emulsion, weatherproof, and anti-fungal paints — and which rooms need which finish.",
    category: "tips",
    author: "Sumi Rahman",
    authorRole: "Interior Consultant",
    publishedAt: "2026-08-05",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["paint", "interior", "tips"],
  },
  {
    id: "8",
    slug: "when-to-call-an-emergency-plumber",
    title: "When to Call an Emergency Plumber: A Homeowner's Decision Guide",
    excerpt:
      "Burst pipes, sewage backup, or a running toilet at midnight — knowing when a plumbing issue is an emergency can save your home from serious water damage. Use this guide to decide quickly.",
    category: "plumbing",
    author: "Farhana Akter",
    authorRole: "Master Plumber",
    publishedAt: "2026-07-28",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1608355484820-61591e5eff97?w=800&auto=format&fit=crop&q=80",
    featured: false,
    tags: ["plumbing", "emergency", "water-damage"],
  },
];

const TRENDING_POSTS = BLOG_POSTS.slice(0, 3);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============================================================================
// COMPONENTS
// ============================================================================

function FeaturedPost({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative h-64 overflow-hidden lg:h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime} read
            </span>
          </div>
          <h2 className="text-2xl font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary lg:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{post.author}</p>
                <p className="text-[10px] text-muted-foreground">{formatDate(post.publishedAt)}</p>
              </div>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:gap-2.5"
            >
              Read article
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <h3 className="flex-1 text-base font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {post.author.split(" ").map((n) => n[0]).join("")}
            </div>
            <p className="text-xs font-medium text-foreground">{post.author}</p>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-1.5 transition-all"
          >
            Read more <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPosts = React.useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredPost = BLOG_POSTS.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || activeCategory !== "all" || searchQuery !== "");

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background pt-32 pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(120,119,198,0.08),transparent)]"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">FixItNow Blog</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Expert Home Service{" "}
              <span className="text-primary">Insights & Guides</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Practical advice from certified professionals to help you maintain, repair,
              and improve your home with confidence.
            </p>

            {/* Search Bar */}
            <div className="mt-8 relative mx-auto max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="blog-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, tips, guides..."
                className="h-12 w-full rounded-2xl border border-input bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 py-8">
          {BLOG_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`blog-category-${cat.id}`}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
          <span className="ml-auto self-center text-xs text-muted-foreground">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Featured Post */}
        {activeCategory === "all" && searchQuery === "" && featuredPost && (
          <div className="mb-10">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Blog Grid */}
          <div className="lg:col-span-2">
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-20 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold text-foreground">No articles found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search or selecting a different category.
                </p>
                <button
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  className="mt-4 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {regularPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending Posts */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Trending Articles</h2>
              </div>
              <div className="space-y-4">
                {TRENDING_POSTS.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </p>
                      <span className="mt-1 text-[10px] text-muted-foreground">
                        {post.readTime} · {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Popular Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["maintenance", "plumbing", "electrical", "safety", "tips", "ac", "diy", "monsoon", "paint"].map((tag) => (
                  <button
                    key={tag}
                    id={`tag-${tag}`}
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors capitalize"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <Sparkles className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Get weekly home tips</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Join 2,400+ homeowners getting expert advice every week.
              </p>
              <input
                id="blog-newsletter-email"
                type="email"
                placeholder="Your email address"
                className="mt-4 h-9 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button
                id="blog-newsletter-subscribe"
                className="mt-2 h-9 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Subscribe for free
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
