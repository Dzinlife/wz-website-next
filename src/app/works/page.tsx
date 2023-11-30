import { Suspense } from "react";
import RenderWorks from "./RenderWorks";
import LoadingPage from "@/components/LoadingPage";

export const runtime = "edge";

export const revalidate = 300;

const Works: React.FC = async () => {
  return (
    <div className="max-w-[800px] px-8 box-content mx-auto">
      <Suspense fallback={<LoadingPage />}>
        <RenderWorks />
      </Suspense>
    </div>
  );
};

export default Works;
