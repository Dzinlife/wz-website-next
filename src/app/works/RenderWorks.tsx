import { fetchPages } from "@/actions/notion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const Works: React.FC = async () => {
  const pages = await fetchPages();

  if (!pages) return notFound();

  return (
    <div className="w-96 mx-auto bg-red-100">
      {/* {JSON.stringify(pages.results)} */}
      {pages.results.map((post: any) => {
        return (
          <div key={post.id} className="text-7xl">
            {/* {JSON.stringify(post.properties.Slug)} */}
            <Link
              href={`/works/${post.properties.Slug.rich_text[0].plain_text}`}
            >
              {post.properties.Title.title[0].plain_text}
              <img src={post.properties.Banner.files[0]?.name} />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Works;
