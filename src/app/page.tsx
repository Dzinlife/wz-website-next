"use client";
import ReactDOM from "react-dom";
import me from "../assets/me.svg";
import classNames from "classnames";
import { useLayout } from "@/utils/useLayout";
import Hello from "@/components/Hello";
import { CSSTransition } from "react-transition-group";
import { useEffect, useLayoutEffect, useState } from "react";
import { FrozenRouter } from "./clientLayout";
import { usePathname } from "next/navigation";

export default function Home() {
  const { layout, offsetLeft, helloWidth } = useLayout();

  const [showMe, setShowMe] = useState(false);

  const pathname = usePathname();

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowMe(pathname === "/");
      });
    });
  }, [pathname]);

  return (
    <main>
      {layout
        ? ReactDOM.createPortal(
            <CSSTransition
              in={showMe}
              appear
              exit={true}
              timeout={700}
              classNames="page-transition"
              mountOnEnter
              unmountOnExit
            >
              <FrozenRouter key={pathname}>
                <div
                  className={classNames(
                    "sticky bottom-0 h-screen w-[200vw] top-0 bg-no-repeat pointer-events-none -z-10 mt-[-100vh]",
                    {
                      "bg-contain bg-left-top": layout === "landscape",
                      "bg-[length:60%_auto] bg-left-bottom -z-10":
                        layout === "portrait",
                    }
                  )}
                  style={{
                    backgroundImage: `url(${me.src})`,
                  }}
                ></div>
              </FrozenRouter>
            </CSSTransition>,
            document.body
          )
        : null}
      <div
        className={classNames("w-[512px] pt-[0px] z-20", {
          "pb-24": layout === "landscape",
          "pb-96": layout === "portrait",
        })}
        style={
          layout && {
            marginLeft: offsetLeft,
            width: helloWidth,
          }
        }
      >
        <Hello />
      </div>
    </main>
  );
}
