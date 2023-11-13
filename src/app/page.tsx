"use client";

import Image from "next/image";
import me from "../assets/me.png";
import classNames from "classnames";
import { useLayout } from "@/utils/useLayout";
import Hello from "@/components/Hello";

export default function Home() {
  const { layout, paddingLeft, helloWidth } = useLayout();

  return (
    <main className="flex min-h-screen ">
      <div
        className={classNames(
          "fixed h-full w-full left-0 top-0 bg-no-repeat z-10",
          {
            hidden: !layout,
            "bg-contain bg-left-top": layout === "landscape",
            "bg-cover bg-bottom": layout === "portrait",
          }
        )}
        style={{
          backgroundImage: `url(${me.src})`,
        }}
      />
      <div
        className={classNames("w-[512px] pt-[240px] z-20 pb-96", {})}
        style={
          layout && {
            marginLeft: paddingLeft,
            width: helloWidth,
          }
        }
      >
        <Hello />
      </div>
    </main>
  );
}
