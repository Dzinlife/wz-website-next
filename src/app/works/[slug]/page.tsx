import LoadingPage from "@/components/LoadingPage";
import Fetcher from "./Fetcher";
import { Suspense } from "react";

export const runtime = "edge";

const Work: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return (
    <div className="max-w-[800px] px-8 box-content mx-auto">
      <Suspense fallback={<LoadingPage />}>
        <Fetcher slug={params.slug} />
      </Suspense>
    </div>
  );
};

export default Work;
