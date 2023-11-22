"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useLayout } from "@/utils/useLayout";
import classNames from "classnames";
import { PAGE_TRANSITION_DURATION } from "@/constants";

const FrozenRouter: React.FC<React.PropsWithChildren> = (props) => {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
};

export const ContentBodyContext = createContext<HTMLElement | null>(null);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layout } = useLayout();

  const pathname = usePathname();

  const routeRef = useRef({
    currentPath: pathname,
    prevPath: undefined as typeof pathname | undefined,
  });

  if (routeRef.current.currentPath !== pathname) {
    const prevPath = routeRef.current.currentPath;

    routeRef.current = {
      currentPath: pathname,
      prevPath,
    };
  }

  const prevPath = routeRef.current.prevPath;

  const scrollRestorationRef = useRef(false);

  useEffect(() => {
    history.scrollRestoration = "manual";

    const handler = () => {
      scrollRestorationRef.current = true;
    };
    window.addEventListener("popstate", handler);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const scrollRef = useRef(
    typeof window === "undefined" ? [0, 0] : [window.scrollY, window.scrollY]
  );

  useEffect(() => {
    scrollRef.current[0] = scrollRef.current[1];
    scrollRef.current[1] = window.scrollY;
  }, [pathname]);

  const rules = useMemo(
    () => [/^\/$/, /^\/works$/, /^\/works.*$/, /^\/contact$/],
    []
  );

  const direction = useMemo(() => {
    if (prevPath === undefined) return 0;

    return rules.findIndex((rule) => rule.test(pathname)) -
      rules.findIndex((rule) => rule.test(prevPath)) >
      0
      ? 1
      : -1;
  }, [rules, pathname, prevPath]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const [, update] = useState({});

  if (!layout) return null;

  let pageTransitionOffset = "50%";

  return (
    <>
      <Header />
      <div
        className={classNames("flex-1 pb-20", {
          "pt-[40px]": layout === "landscape",
          "pt-[16px]": layout === "portrait",
        })}
        ref={(ref) => {
          if (!contentRef.current) {
            contentRef.current = ref;
            update({});
          }
        }}
      >
        <style jsx global>{`
          .page-transition-appear {
            opacity: 0;
            ${direction < 0
              ? `transform: translate3d(-${pageTransitionOffset}, 0, 0);`
              : ""}
            ${direction > 0
              ? `transform: translate3d(${pageTransitionOffset}, 0, 0);`
              : ""}
          }
          .page-transition-appear-active {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: ${PAGE_TRANSITION_DURATION / 2}ms ease;
          }
          .page-transition-enter {
            opacity: 0;
            ${direction < 0
              ? `transform: translate3d(-${pageTransitionOffset}, 0, 0);`
              : ""}
            ${direction > 0
              ? `transform: translate3d(${pageTransitionOffset}, 0, 0);`
              : ""}
          }
          .page-transition-enter-active {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: ${PAGE_TRANSITION_DURATION / 2}ms ease;
          }
          .page-transition-exit {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: ${PAGE_TRANSITION_DURATION / 2}ms ease-in;
          }

          .page-transition-exit-active {
            opacity: 0;
            ${direction < 0
              ? `transform: translate3d(${pageTransitionOffset}, 0, 0);`
              : ""}
            ${direction > 0
              ? `transform: translate3d(-${pageTransitionOffset}, 0, 0);`
              : ""}
          }
        `}</style>

        <ContentBodyContext.Provider value={contentRef.current}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              appear
              unmountOnExit
              addEndListener={(node, done) => {
                if (node.classList.contains("page-transition-exit")) {
                  node.style.opacity = "0";
                }

                if (node.classList.contains("page-transition-enter")) {
                  if (scrollRestorationRef.current) {
                    scrollRestorationRef.current = false;
                    const y = scrollRef.current[0];
                    window.scrollTo(0, y);
                  }
                }

                if (node.classList.contains("page-transition-appear")) {
                  node.style.opacity = "0";
                  setTimeout(() => {
                    node.style.opacity = "";
                  });
                }

                node.addEventListener("transitionend", done, false);
              }}
              // timeout={PAGE_TRANSITION_DURATION / 2}
              classNames="page-transition"
              key={pathname}
            >
              <FrozenRouter>{children}</FrozenRouter>
            </CSSTransition>
          </SwitchTransition>
        </ContentBodyContext.Provider>
      </div>
    </>
  );
}
