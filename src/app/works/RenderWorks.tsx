import { fetchPages } from "@/actions/notion";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoadingImage from "./LoadingImage";

const Works: React.FC = async () => {
  const pages = await fetchPages();

  if (!pages) return notFound();

  const item = (post: any) => {
    return (
      <>
        <div className="transition-opacity text-lg leading-8 font-bold font-[Mark] group-hover:opacity-100">
          {post.properties.Title.title[0].plain_text}
        </div>
        <div className="bg-gray-100">
          <LoadingImage
            src={post.properties.Banner.files[0]?.file.url}
            width={800}
            height={400}
            alt={post.properties.Title.title[0].plain_text}
          />
        </div>
      </>
    );
  };

  return (
    <>
      {pages.results.map((post: any) => {
        return (
          <div key={post.id} className="group mb-[12%]">
            {post.properties.Slug.rich_text[0]?.plain_text ? (
              <Link
                href={`/works/${post.properties.Slug.rich_text[0]?.plain_text}`}
                scroll={false}
              >
                {item(post)}
              </Link>
            ) : (
              item(post)
            )}
          </div>
        );
      })}
    </>
  );
};

export default Works;
