"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, {
  createContext,
  useContext,
  useEffect,
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
import { create } from "domain";
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
  const duration = 700;

  const { layout, offsetCenter } = useLayout();

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

  const prevOffsetCenterRef = useRef<typeof offsetCenter | undefined>(
    undefined
  );

  useEffect(() => {
    setTimeout(() => {
      prevOffsetCenterRef.current = offsetCenter;
    });
  }, [offsetCenter]);

  const [enterWidth, setEnterWidth] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => {});

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!layout) return null;

  let pageTransitionOffset = enterWidth + 80;
  if (routeRef.current.prevRoute === "")
    pageTransitionOffset += prevOffsetCenterRef.current ?? 0;

  if (route === "") pageTransitionOffset += 60;

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
        ref={contentRef}
      >
        <style jsx global>{`
          .transition-group {
            & > *[class^="page-transition-"],
            & > *[class*=" page-transition-"] {
              &:not(.page-transition-enter-done) {
                position: absolute;
                width: 100%;
              }
            }
          }
        `}</style>
        <style jsx global>{`
          .page-transition-appear {
            opacity: 0;
            ${direction < 0
              ? `transform: translate3d(-${pageTransitionOffset}px, 0, 0);`
              : ""}
            ${direction > 0
              ? `transform: translate3d(${pageTransitionOffset}px, 0, 0);`
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
              ? `transform: translate3d(-${pageTransitionOffset}px, 0, 0);`
              : ""}
            ${direction > 0
              ? `transform: translate3d(${pageTransitionOffset}px, 0, 0);`
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
            transition: ${duration}ms ease;
          }

          .page-transition-exit-active {
            opacity: 0;
            ${direction < 0
              ? `transform: translate3d(${pageTransitionOffset}px, 0, 0);`
              : ""}
            ${direction > 0
              ? `transform: translate3d(-${pageTransitionOffset}px, 0, 0);`
              : ""}
          }
        `}</style>

        <ContentBodyContext.Provider value={contentRef.current}>
          <TransitionGroup className="transition-group">
            <CSSTransition
              in={true}
              exit={true}
              appear
              timeout={duration}
              onEnter={(dom: HTMLElement) => {
                setEnterWidth((dom.childNodes[0] as HTMLElement)?.offsetWidth);
              }}
              mountOnEnter
              unmountOnExit
              classNames="page-transition"
              key={pathname}
            >
              <FrozenRouter>{children}</FrozenRouter>
            </CSSTransition>
          </TransitionGroup>
        </ContentBodyContext.Provider>
      </div>
    </>
  );
}
