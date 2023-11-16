"use client";

import { NotionRenderer } from "react-notion-x";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
// import "./styles.css";
// import "react-notion-x/src/styles.css";

const Renderer: React.FC<{
  slug: string;
}> = ({ slug }) => {
  const { data, error, isLoading } = useSWR<
    React.ComponentProps<typeof NotionRenderer>["recordMap"]
  >(`/api/notion?slug=${slug}`, {
    suspense: true,
    fetcher: (...args: Parameters<typeof fetch>) =>
      fetch(...args).then((res) => res.json()),
  });

  return (
    <NotionRenderer
      recordMap={data}
      fullPage={false}
      darkMode={false}
      previewImages={true}
      components={{
        nextImage: Image,
        nextLink: Link,
      }}
    />
  );
};

export default Renderer;
