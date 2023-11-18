// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import { fetchPageBySlug, notionCompat } from "@/actions/notion";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get("slug");

  if (!slug) return new Response("Not Found", { status: 404 });

  const post = await fetchPageBySlug(slug);

  if (!post) return new Response("Not Found", { status: 404 });

  const recordMap = await notionCompat.getPage(post.id);

  return new Response(JSON.stringify(recordMap), {
    headers: {
      "content-type": "application/json",
    },
  });
}
