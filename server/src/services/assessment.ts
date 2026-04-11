import OpenAI from "openai";
import { env } from "../config/env.js";

export type MCQ = {
  question: string;
  options: [string, string, string, string];
  correct: "A" | "B" | "C" | "D";
  topic: string;
};

const tierByScore = [
  { max: 4, tier: "BEGINNER" as const },
  { max: 9, tier: "INTERMEDIATE" as const },
  { max: 12, tier: "ADVANCED" as const },
  { max: 15, tier: "PLACEMENT_READY" as const },
];

export function resolveTier(score: number) {
  const found = tierByScore.find((row) => score <= row.max);
  return found?.tier ?? "PLACEMENT_READY";
}

export async function generateQuestions(topics: string[]) {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = new OpenAI({ 
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_API_KEY.startsWith("AIza") ? "https://generativelanguage.googleapis.com/v1beta/openai/" : undefined,
  });
  
  const promptTopics = topics.length ? topics.join(", ") : "DSA, DBMS, OS, CN"; 
  const completion = await client.chat.completions.create({
    model: env.OPENAI_API_KEY.startsWith("AIza") ? "gemini-2.5-flash" : "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical interviewer. Generate exactly 15 MCQs with 4 options and one correct option. Return JSON only.",
      },
      {
        role: "user",
        content: `Topics: ${promptTopics}. Return format: [{\"question\":\"...\",\"options\":[\"...\",\"...\",\"...\",\"...\"],\"correct\":\"A\",\"topic\":\"...\"}]`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned) as MCQ[];
  if (!Array.isArray(parsed) || parsed.length !== 15) {
    throw new Error("OpenAI response does not contain 15 valid questions.");
  }
  return parsed;
}

