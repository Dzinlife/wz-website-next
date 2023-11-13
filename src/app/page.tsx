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
    <main className="flex min-h-screen ">
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
              "fixed h-full w-full left-0 top-0 bg-no-repeat pointer-events-none",
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
        className={classNames("w-[512px] pt-[0px] z-20 pb-96", {})}
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
