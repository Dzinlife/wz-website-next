import LoadingPage from "@/components/LoadingPage";
import Fetcher from "./Fetcher";
import { Suspense } from "react";

export const runtime = "edge";

const Work: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return (
    <div className="w-96 mx-auto">
      <Suspense fallback={<LoadingPage />}>
        <Fetcher slug={params.slug} />
      </Suspense>
    </div>
  );
};

export default Work;
