"use client";

import { fetchPageBySlug, notion as _notion } from "@/utils/notion";
import Image from "next/image";
import { notFound } from "next/navigation";
import Renderer from "./Renderer";
import { useAsyncMemo } from "@/utils/useAsyncMemo";
import { Suspense, cache } from "react";
import useSWR from "swr";
import { NotionRenderer } from "react-notion-x";

const Work: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return (
    <div>
      <div>123</div>
      <Suspense fallback={<div>loading</div>}>
        <Renderer slug={params.slug} />
      </Suspense>
    </div>
  );
};

export default Work;
