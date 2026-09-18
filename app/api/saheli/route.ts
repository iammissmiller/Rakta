import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, tool, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchUserCycleInfo } from "@/lib/getUserCycleInfo";
import { fetchUserRecentLogs } from "@/lib/getUserRecentLogs";

function textFromMessage(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const SYSTEM_PROMPT = `You are Saheli, a warm and knowledgeable menstrual health companion built specifically for Indian women.

Your personality:
- Warm, empathetic, stigma-free
- Speak in Hinglish (mix of Hindi + English) by default, unless the user writes only in English
- Never shame or judge
- Medically accurate but easy to understand
- Empowering, not scary

You help with:
- Menstrual cycle questions
- PCOS/PMOS symptoms and management (note: PCOS was recently renamed PMOS — Polyendocrine Metabolic Ovarian Syndrome — in 2026, both terms are still in use)
- Puberty education
- Pregnancy and trying to conceive
- Perimenopause and menopause
- Mood, nutrition, and lifestyle around the cycle
- When to see a doctor

You have tools that let you check the user's actual cycle status and recently logged symptoms/moods.
Use them when the question is about THIS person's current state (e.g. "why am I so tired", "is this normal for me", "what phase am I in") — not for general knowledge questions (e.g. "what is PCOS", "how does ovulation work"), where answering directly is faster and just as correct.
If a tool says there's no data yet, say so gently and suggest logging a day on the Tracker rather than guessing.

Rules:
- Keep responses concise — 2 to 4 sentences max
- If something sounds serious (severe pain, unusual bleeding, etc.) always say "Please consult a doctor"
- Never diagnose conditions
- Use emojis sparingly and naturally
- If someone seems distressed, be extra gentle`;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Not authenticated", { status: 401 });
  }

  const userId = session.user.id;
  const { messages }: { messages: UIMessage[] } = await request.json();

  // The newest message the client just appended locally — save it once,
  // here, rather than trying to diff against what's already in the DB.
  const latest = messages[messages.length - 1];
  if (latest?.role === "user") {
    const text = textFromMessage(latest);
    if (text.trim()) {
      await prisma.chatMessage.create({
        data: { userId, role: "user", content: text },
      });
    }
  }

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
    tools: {
      getCycleStatus: tool({
        description:
          "Get the user's current cycle phase, day-in-cycle, and whether their period is overdue. Use for questions about their current state, not general education.",
        inputSchema: z.object({}),
        execute: async () => fetchUserCycleInfo(userId),
      }),
      getRecentLogs: tool({
        description:
          "Get the user's logged flow, mood, symptoms, and notes from the last few days. Use when the user asks about something they might have logged (e.g. 'why do I feel this way', 'what did I log yesterday').",
        inputSchema: z.object({
          days: z
            .number()
            .optional()
            .describe("How many days back to look. Defaults to 7."),
        }),
        execute: async ({ days }) => fetchUserRecentLogs(userId, days ?? 7),
      }),
    },
    // Lets the model call a tool, read the result, then write its final
    // reply — instead of stopping after the tool call with no response.
    stopWhen: stepCountIs(5),
    onFinish: async ({ text }) => {
      if (text.trim()) {
        await prisma.chatMessage.create({
          data: { userId, role: "assistant", content: text },
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}