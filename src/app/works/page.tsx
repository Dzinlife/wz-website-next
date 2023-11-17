import { Suspense, use } from "react";
import RenderWorks from "./RenderWorks";

const Works: React.FC = async () => {
  return (
    <div className="w-96 mx-auto">
      <Suspense fallback={<div>loading</div>}>
        <RenderWorks />
      </Suspense>
    </div>
  );
};

export default Works;
