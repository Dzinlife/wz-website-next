"use client";

import { NotionRenderer } from "react-notion-x";
import Image from "next/image";
import Link from "next/link";

const Renderer: React.FC<{
  data: any;
}> = ({ data }) => {
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
