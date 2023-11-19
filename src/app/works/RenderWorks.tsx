import { fetchPages } from "@/actions/notion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoadingImage from "@/components/LoadingImage";

const Works: React.FC = async () => {
  const pages = await fetchPages();

  if (!pages) return notFound();

  return (
    <>
      {pages.results.map((post: any) => {
        return (
          <div key={post.id} className="mb-28 group">
            <Link
              href={`/works/${post.properties.Slug.rich_text[0].plain_text}`}
              scroll={false}
              prefetch={true}
            >
              <div className="transition-opacity text-lg leading-8 font-bold font-[Mark] opacity-0 group-hover:opacity-100">
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
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default Works;
