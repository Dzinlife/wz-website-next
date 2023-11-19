import { Suspense, use } from "react";
import RenderWorks from "./RenderWorks";
import LoadingPage from "@/components/LoadingPage";

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
