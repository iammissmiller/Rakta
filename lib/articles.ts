export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  emoji: string;
  excerpt: string;
  readTime: string;
  sections: ArticleSection[];
}

export const ARTICLES: Article[] = [
  {
    slug: "understanding-your-cycle",
    title: "Understanding Your Cycle: The Four Phases",
    category: "Cycle Basics",
    emoji: "🌙",
    excerpt:
      "Your cycle isn't just \"the days you bleed\" — it's four distinct phases, each with its own hormones, energy, and mood patterns.",
    readTime: "4 min read",
    sections: [
      {
        paragraphs: [
          "A menstrual cycle is usually described as 28 days, but anywhere from 21 to 35 days is considered typical — everyone's rhythm is a little different. What matters more than the exact number is understanding the four phases your body moves through, since each one feels genuinely different.",
        ],
      },
      {
        heading: "Menstrual phase (roughly days 1–5)",
        paragraphs: [
          "This is when your period happens — the lining your uterus built up in the previous cycle sheds. Hormone levels are at their lowest here, which is often why energy dips and rest feels necessary rather than optional.",
        ],
      },
      {
        heading: "Follicular phase (roughly days 6–13)",
        paragraphs: [
          "Estrogen starts rising, and for a lot of people this is when energy, mood, and motivation genuinely pick up. Your body is preparing an egg for potential release — a good window for starting new things if your schedule allows it.",
        ],
      },
      {
        heading: "Ovulation (roughly days 14–16)",
        paragraphs: [
          "An egg is released. Estrogen peaks right around here, and many people report feeling their most confident and energetic during this short window.",
        ],
      },
      {
        heading: "Luteal phase (roughly days 17–28)",
        paragraphs: [
          "Progesterone rises to prepare the body in case of pregnancy, then falls sharply if it doesn't happen — that hormonal drop is a big part of what's behind PMS symptoms like mood changes, bloating, and fatigue in the days before a period.",
        ],
      },
      {
        heading: "Why this matters",
        paragraphs: [
          "Knowing which phase you're in can make a lot of things — low-energy days, mood swings, sudden motivation — feel a lot less random. Rakta's dashboard shows your current phase automatically once you've logged a period start date.",
        ],
      },
    ],
  },
  {
    slug: "pcos-pmos-explained",
    title: "PCOS & PMOS: What's Actually Going On",
    category: "PCOS / PMOS",
    emoji: "🌸",
    excerpt:
      "A plain-language look at one of the most common — and most misunderstood — hormonal conditions.",
    readTime: "5 min read",
    sections: [
      {
        paragraphs: [
          "PCOS (also referred to as PMOS) affects a significant share of women of reproductive age, yet it's still widely misunderstood. At its core, it's a hormonal imbalance that can affect ovulation, metabolism, and several other systems in the body — not just periods.",
        ],
      },
      {
        heading: "Common signs",
        paragraphs: [
          "Irregular or unpredictable periods, acne, excess hair growth, hair thinning, weight changes that feel hard to explain, and fatigue are all commonly reported. Not everyone has every symptom, and severity varies a lot from person to person — this is part of why it can take a while to get a clear picture of what's going on.",
        ],
      },
      {
        heading: "Why cycles become irregular",
        paragraphs: [
          "PCOS can interfere with regular ovulation, which is why cycle length often varies more than a \"typical\" 28-day pattern — sometimes by a lot, month to month. This is exactly why Rakta's Tracker treats PCOS-flagged cycles differently: instead of assuming a fixed length, it looks at your actual logged period-start dates over time to build a real picture of your pattern.",
        ],
      },
      {
        heading: "What actually helps",
        paragraphs: [
          "There's no single fix, but small, consistent things tend to help many people: balanced meals that avoid big blood-sugar spikes, regular movement, and enough sleep. None of that replaces medical care — a doctor can check hormone levels and talk through options like medication if needed.",
        ],
        // note: no specific dosages or drug names — general education only
      },
      {
        heading: "When to see a doctor",
        paragraphs: [
          "If your periods are consistently unpredictable, or you're noticing several of the signs above together, it's worth bringing up with a doctor. PCOS is manageable, and getting an actual diagnosis is the first real step — self-diagnosing from symptoms alone can miss other things that look similar.",
        ],
      },
    ],
  },
  {
    slug: "starting-your-period",
    title: "Starting Your Period: A Guide for First-Timers",
    category: "Puberty",
    emoji: "🌷",
    excerpt:
      "Everything can feel confusing the first time — here's what's actually normal, in plain terms.",
    readTime: "4 min read",
    sections: [
      {
        paragraphs: [
          "Most people get their first period somewhere between ages 9 and 15 — there's no single \"right\" age, and starting earlier or later than your friends doesn't mean anything is wrong.",
        ],
      },
      {
        heading: "What it actually feels like",
        paragraphs: [
          "For most people it starts gradually — you might notice a brownish or reddish stain before a full flow shows up. Cramping, if it happens, is usually mild in the first year or two, though it varies a lot person to person.",
        ],
      },
      {
        heading: "The first year is often irregular — and that's normal",
        paragraphs: [
          "It's very common for the first year or two of periods to be unpredictable — sometimes close together, sometimes months apart. Your body is still figuring out its rhythm. This is exactly the kind of thing worth tracking from the start, so you and (if you want) a trusted adult can see the pattern as it settles.",
        ],
      },
      {
        heading: "What you'll actually need",
        paragraphs: [
          "Pads are usually the easiest starting point — they're simple to use and don't require any extra know-how. Tampons and menstrual cups are options too, whenever you feel ready to try them; there's no rush and no \"correct\" choice.",
        ],
      },
      {
        heading: "It's okay to talk about it",
        paragraphs: [
          "Periods can feel like a big secret to carry alone, especially the first time. Talking to a parent, older sibling, school nurse, or trusted adult — or asking Saheli — is completely normal. There's genuinely nothing to be embarrassed about; every single woman goes through this.",
        ],
      },
    ],
  },
  {
    slug: "managing-period-pain",
    title: "Managing Period Pain and Cramps",
    category: "Cycle Basics",
    emoji: "🍓",
    excerpt:
      "Cramps are common, but \"common\" doesn't mean you just have to grit your teeth through them.",
    readTime: "3 min read",
    sections: [
      {
        paragraphs: [
          "Period cramps happen because the uterus contracts to help shed its lining — those contractions are what you feel as cramping, usually in the lower abdomen and sometimes the lower back or thighs.",
        ],
      },
      {
        heading: "Things that genuinely help",
        paragraphs: [
          "A warm heating pad or hot water bottle on the lower abdomen is one of the most reliably effective, low-effort options. Gentle movement — a short walk, light stretching, or easy yoga — can help too, even though resting feels more intuitive. Staying hydrated and cutting back on caffeine during your period can also take the edge off for some people.",
        ],
      },
      {
        heading: "Food that supports you here",
        paragraphs: [
          "Magnesium-rich foods (nuts, leafy greens, dark chocolate) and warm, easy-to-digest meals tend to sit well during this phase. Very salty or heavily processed food can sometimes worsen bloating, which indirectly makes cramping feel worse too.",
        ],
      },
      {
        heading: "When cramps are more than \"normal\"",
        paragraphs: [
          "Mild-to-moderate cramping in the first couple of days is common. But pain severe enough to interfere with school, work, or daily life — or that doesn't ease up with rest and warmth — isn't something to just push through silently. That level of pain is worth mentioning to a doctor; it can sometimes point to something like endometriosis that's genuinely worth checking for.",
        ],
      },
    ],
  },
  {
    slug: "pregnancy-changing-body",
    title: "Pregnancy and Your Changing Body: The Basics",
    category: "Pregnancy",
    emoji: "🤰",
    excerpt:
      "A first look at what each trimester generally brings — and why tracking still matters even without a period to log.",
    readTime: "5 min read",
    sections: [
      {
        paragraphs: [
          "Pregnancy is usually counted in weeks from the first day of your last period (not from conception), which is why Rakta's Tracker calculates your pregnancy week the same way — it's the standard method doctors use too.",
        ],
      },
      {
        heading: "First trimester (weeks 1–13)",
        paragraphs: [
          "This is when a lot of the big, early changes happen — fatigue, nausea (not only in the morning, despite the name), and heightened senses of taste and smell are all common. It's also completely normal to feel nothing unusual at all this early; every pregnancy is different.",
        ],
      },
      {
        heading: "Second trimester (weeks 14–27)",
        paragraphs: [
          "Often described as the most comfortable stretch — nausea typically eases, energy often returns, and this is usually when a visible bump becomes noticeable. Many people also start feeling movement for the first time during this window.",
        ],
      },
      {
        heading: "Third trimester (weeks 28 onward)",
        paragraphs: [
          "The body is doing a lot of visible work here — back pain, swelling, and shortness of breath become more common as things get more physically crowded. Braxton Hicks contractions (practice tightenings, different from labor) can also start showing up.",
        ],
      },
      {
        heading: "Why keep logging anything at all",
        paragraphs: [
          "Even without a period to track, logging symptoms — nausea, swelling, mood, sleep — builds a record that's genuinely useful to look back on and to share with a doctor at checkups. Rakta's Tracker switches automatically to this symptom-based view once your profile is set to pregnant.",
        ],
      },
      {
        heading: "Always worth a call to your doctor",
        paragraphs: [
          "Heavy bleeding, severe abdominal pain, sudden swelling, or reduced fetal movement are always worth contacting a doctor about right away, not waiting out. When in doubt, it's always fine to check — that's what they're there for.",
        ],
      },
    ],
  },
  {
    slug: "perimenopause-and-menopause",
    title: "Perimenopause & Menopause: What to Expect",
    category: "Menopause",
    emoji: "🌙",
    excerpt:
      "The transition usually starts years before periods actually stop — here's what that in-between stretch tends to look like.",
    readTime: "4 min read",
    sections: [
      {
        paragraphs: [
          "Menopause itself is a single point in time — officially marked once it's been 12 full months since your last period, typically somewhere between ages 45 and 55. But the lead-up, called perimenopause, can last several years and is often where most of the noticeable changes actually happen.",
        ],
      },
      {
        heading: "What perimenopause tends to feel like",
        paragraphs: [
          "Periods often become irregular — sometimes closer together, sometimes skipped entirely for a while — as hormone levels fluctuate rather than declining smoothly. Hot flashes, night sweats, mood changes, and disrupted sleep are all commonly reported during this stretch.",
        ],
      },
      {
        heading: "Why tracking symptoms (not just periods) matters here",
        paragraphs: [
          "Since periods become unpredictable — and eventually stop — tracking a fixed \"cycle day\" stops being meaningful. What's actually useful during this stage is tracking how you're feeling day to day: hot flashes, sleep quality, mood. Rakta's Tracker switches to exactly this kind of symptom-frequency view once your profile is set to menopausal, instead of trying to force a period prediction that doesn't apply anymore.",
        ],
      },
      {
        heading: "Things that can genuinely help",
        paragraphs: [
          "Layering clothing and keeping the bedroom cool can ease hot flashes and night sweats. Regular movement and consistent sleep habits tend to help with mood and energy. For symptoms that are significantly affecting daily life, there are real medical options worth discussing with a doctor — this transition doesn't have to just be endured quietly.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
