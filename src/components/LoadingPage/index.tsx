"use client";

import spin from "../../assets/ring-resize.svg";
import Image from "next/image";
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div style={{ height: 464 }} className="flex items-center justify-center">
      <Image src={spin} alt="" />
    </div>
  );
};

export default React.memo(LoadingPage);
