import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { BowSVG } from "@/components/Decorations";

const card: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(184,0,10,0.07)",
  boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
  background: "#FFFAF4",
};

export default function Learn() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-8">
      <div className="mb-2 flex items-center gap-3">
        <BowSVG style={{ width: 30, height: 19, opacity: 0.5 }} />
        <div className="font-serif text-xl italic font-bold text-ink">Learn</div>
      </div>
      <p className="mb-6 text-sm text-muted">
        Plain-language reading on cycles, PCOS, puberty, pregnancy, and menopause.
      </p>

      <div className="flex flex-col gap-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            style={{ ...card, padding: 18 }}
            className="flex items-start gap-4 transition-transform hover:-translate-y-0.5"
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-xl"
              style={{ background: "rgba(184,0,10,0.08)" }}
            >
              {article.emoji}
            </div>
            <div className="min-w-0">
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-crimson opacity-70">
                {article.category}
              </div>
              <div className="font-serif text-base italic font-semibold text-ink">
                {article.title}
              </div>
              <p className="mt-1 text-sm text-muted">{article.excerpt}</p>
              <div className="mt-2 text-xs text-muted opacity-60">{article.readTime}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
