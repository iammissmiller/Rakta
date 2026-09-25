import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, ARTICLES } from "@/lib/articles";
import { BowSVG } from "@/components/Decorations";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-6 sm:px-8">
      <Link href="/learn" className="mb-6 inline-block text-sm text-crimson">
        ← Back to Learn
      </Link>

      <div className="mb-6 text-center">
        <div className="mb-3 text-4xl">{article.emoji}</div>
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-crimson opacity-70">
          {article.category}
        </div>
        <h1 className="font-serif text-2xl italic font-bold text-ink">{article.title}</h1>
        <div className="mt-2 text-xs text-muted opacity-60">{article.readTime}</div>
      </div>

      <div className="flex flex-col gap-6">
        {article.sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="mb-2 font-serif text-base italic font-semibold text-ink">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="mb-3 text-[15px] leading-relaxed text-ink-light">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div
        className="mt-10 flex items-center gap-3 rounded-2xl px-4 py-3 text-xs text-muted"
        style={{ background: "rgba(184,0,10,0.05)" }}
      >
        <BowSVG style={{ width: 20, height: 13, opacity: 0.5, flexShrink: 0 }} />
        General information, not a substitute for medical advice. If something
        feels off for you personally, a doctor is always the right call.
      </div>
    </div>
  );
}
