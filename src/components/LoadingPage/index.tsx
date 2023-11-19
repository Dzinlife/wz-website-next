"use client";

import { useLayout } from "@/utils/useLayout";
import spin from "../../assets/ring-resize.svg";
import Image from "next/image";

const LoadingPage: React.FC = () => {
  const { minHeight } = useLayout();

  return (
    <div style={{ minHeight }} className="flex items-center justify-center">
      <Image src={spin} alt="" />
    </div>
  );
};

export default LoadingPage;
