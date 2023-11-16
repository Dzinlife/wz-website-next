import { fetchPages } from "@/utils/notion";
import { allPosts, Post } from "contentlayer/generated";
import Link from "next/link";
import { notFound } from "next/navigation";

const Works: React.FC = async () => {
  const pages = await fetchPages();

  if (!pages) return notFound();

  return (
    <div className="w-96 mx-auto bg-red-100">
      {/* {JSON.stringify(pages.results)} */}
      {pages.results.map((post) => {
        return (
          <div key={post.id} className="text-7xl">
            {/* {post.properties.Title.title[0].plain_text} */}
            {/* {JSON.stringify(post.properties.Slug)} */}
            <Link
              prefetch={true}
              href={`/works/${post.properties.Slug.rich_text[0].plain_text}`}
            >
              {post.properties.Title.title[0].plain_text}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Works;
