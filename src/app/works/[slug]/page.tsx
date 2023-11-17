import Fetcher from "./Fetcher";
import { Suspense } from "react";

export const runtime = "edge";

const Work: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Fetcher slug={params.slug} />
    </Suspense>
  );
};

export default Work;
