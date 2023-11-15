import { allPosts, Post } from "contentlayer/generated";
import Link from "next/link";

const Works: React.FC = () => {
  return (
    <div className="w-96 mx-auto">
      {allPosts.map((post) => {
        return (
          <div key={post._id} className="text-7xl">
            <Link passHref href={`/works/${post.url}`}>
              {post.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Works;
