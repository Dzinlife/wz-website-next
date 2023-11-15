import { allPosts, Post } from "contentlayer/generated";

export const generateStaticParams = async () => {
  return allPosts.map((post) => {
    return { slug: post.url };
  });
};

const Work: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const post = allPosts.find((post) => post.url === params.slug);

  return (
    <div>
      {post?.date}
      {post?.body.raw}
      {/* <div>{JSON.stringify(allPosts)}</div> */}
    </div>
  );
};

export default Work;
