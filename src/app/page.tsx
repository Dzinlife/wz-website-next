"use client";

import Image from "next/image";
import me from "../assets/me.png";
import classNames from "classnames";
import { useLayout } from "@/utils/useLayout";

export default function Home() {
  const layout = useLayout();

  return (
    <main className="flex min-h-screen ">
      <div
        className={classNames(
          "fixed h-full w-full left-0 top-0 bg-no-repeat pointer-events-none",
          {
            "bg-contain": layout === "landscape",
            "bg-left-top": layout === "landscape",
            "bg-cover": layout === "portrait",
            "bg-bottom": layout === "portrait",
            "-z-10": layout === "portrait",
          }
        )}
        style={{
          backgroundImage: `url(${me.src})`,
        }}
      ></div>
    </main>
  );
}
