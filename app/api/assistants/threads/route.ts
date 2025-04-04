import { openai } from "@/app/openai";

export const runtime = "nodejs";
export const maxDuration = 40; // Maximum duration in seconds for Vercel free plan

// Create a new thread
export async function POST() {
  const thread = await openai.beta.threads.create();
  return Response.json({ threadId: thread.id });
}
