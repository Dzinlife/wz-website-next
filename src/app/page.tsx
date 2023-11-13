"use client";

import ReactDOM from "react-dom";
import Image from "next/image";
import me from "../assets/me.png";
import classNames from "classnames";
import { useLayout } from "@/utils/useLayout";
import Hello from "@/components/Hello";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";

export default function Home() {
  const { layout, paddingLeft, helloWidth } = useLayout();

  const [showMe, setShowMe] = useState(false);

  useEffect(() => {
    setShowMe(true);
  }, []);

  return (
    <main>
      {ReactDOM.createPortal(
        <CSSTransition
          in={showMe}
          appear
          exit={false}
          timeout={500}
          classNames="page-transition"
          mountOnEnter
          unmountOnExit
        >
          <div
            className={classNames(
              "page-transition-wrapper",
              "sticky bottom-0 min-h-screen w-full bg-no-repeat pointer-events-none -z-10 mt-[-100vh]",
              {
                hidden: !layout,
                "bg-contain bg-left-top": layout === "landscape",
                "bg-cover bg-bottom -z-10": layout === "portrait",
              }
            )}
            style={{
              backgroundImage: `url(${me.src})`,
            }}
          />
        </CSSTransition>,
        document.body
      )}
      <div
        className={classNames("w-[512px] pt-[0px] z-20", {
          "pb-24": layout === "landscape",
          "pb-96": layout === "portrait",
        })}
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
