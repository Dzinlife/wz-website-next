"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useLayout } from "@/utils/useLayout";
import classNames from "classnames";

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
  const duration = 300;

  const { layout } = useLayout();

  const pathname = usePathname();

  const route = useSelectedLayoutSegment() || "";
  const routes = useSelectedLayoutSegments();

  const routeRef = useRef({
    currentPath: pathname,
    prevPath: undefined as typeof pathname | undefined,
    currentRoute: route,
    prevRoute: undefined as typeof route | undefined,
    currentRoutes: routes,
    prevRoutes: undefined as typeof routes | undefined,
  });

  if (routeRef.current.currentPath !== pathname) {
    const prevPath = routeRef.current.currentPath;
    const prevRoute = routeRef.current.currentRoute;
    const prevRoutes = routeRef.current.currentRoutes;

    routeRef.current = {
      currentPath: pathname,
      currentRoute: route,
      currentRoutes: routes,
      prevPath,
      prevRoute,
      prevRoutes,
    };
  }

  const prevPath = routeRef.current.prevPath;

  const rules = useMemo(() => ["/$", "/works$", "/works/.*$", "/contact$"], []);

  const direction = useMemo(() => {
    if (prevPath === undefined) return 0;

    return rules.findIndex((rule) => new RegExp(rule).test(pathname)) -
      rules.findIndex((rule) => new RegExp(rule).test(prevPath)) >
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
      <div className="hidden">
        <Link href="/" prefetch={true}>
          About
        </Link>
        <Link href="/works" prefetch={true}>
          Works
        </Link>
        <Link href="/contact" prefetch={true}>
          Contact
        </Link>
      </div>
      <div
        className={classNames("flex-1", {
          "mt-[40px]": layout === "landscape",
          "mt-[16px]": layout === "portrait",
        })}
        ref={(ref) => {
          if (!contentRef.current) {
            contentRef.current = ref;
            update({});
          }
        }}
      >
        <style jsx global>{`
          .transition-group {
            & > *[class^="page-transition-"],
            & > *[class*=" page-transition-"] {
              &:not(.page-transition-enter-done) {
                // position: absolute;
              }
            }
          }
        `}</style>
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
            transition: ${duration}ms ease;
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
            transition: ${duration}ms ease;
          }
          .page-transition-exit {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: ${duration}ms ease-in;
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

                if (node.classList.contains("page-transition-appear")) {
                  node.style.opacity = "0";
                  setTimeout(() => {
                    node.style.opacity = "";
                  });
                }

                node.addEventListener("transitionend", done, false);
              }}
              timeout={duration}
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
