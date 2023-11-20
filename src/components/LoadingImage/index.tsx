"use client";

import React, { useState } from "react";
import spin from "../../assets/ring-resize.svg";
import Image from "next/image";
import classNames from "classnames";

const LoadingImage: React.FC<{
  src: string;
  height: number;
  width: number;
  alt: string;
  onError?: React.ComponentProps<typeof Image>["onError"];
}> = ({ src, height, width, alt }) => {
  const [isImageReady, setIsImageReady] = useState(false);

  return (
    <div className="bg-gray-100 relative">
      {isImageReady ? null : (
        <Image
          src={spin}
          alt=""
          className="absolute inset-0 m-auto inline-block transition-opacity"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={classNames("transition-opacity opacity-0", {
          "opacity-100": isImageReady,
        })}
        onLoad={() => {
          setIsImageReady(true);
        }}
        onError={() => {
          location.reload();
        }}
      />
    </div>
  );
};

export default React.memo(LoadingImage);
