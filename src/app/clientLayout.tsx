"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useContext, useMemo, useRef } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useLayout } from "@/utils/useLayout";

export const FrozenRouter: React.FC<React.PropsWithChildren> = (props) => {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const duration = 700;

  const route = useSelectedLayoutSegment();

  const routeRef = useRef({
    currentRoute: route,
    prevRoute: undefined as typeof route | undefined,
  });

  if (routeRef.current.currentRoute !== route) {
    const prevRoute = routeRef.current.currentRoute;
    routeRef.current = {
      currentRoute: route,
      prevRoute,
    };
  }

  const prevRoute = routeRef.current.prevRoute;

  const routes = useMemo(() => [null, "works", "contact"], []);

  const direction = useMemo(() => {
    if (prevRoute === undefined) return 0;

    return routes.findIndex((routeName) => routeName === route) -
      routes.findIndex((routeName) => routeName === prevRoute) >
      0
      ? 1
      : -1;
  }, [routes, route, prevRoute]);

  const year = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  const { helloWidth } = useLayout();

  let test = helloWidth;

  if (route === null || prevRoute === null) test += helloWidth;

  return (
    <>
      <Header />
      <div className="hidden">
        <Link href="/" prefetch={true}>
          About
        </Link>
        <Link href="/works">Works</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <style jsx global>{`
        .transition-group {
          position: relative;
          width: 100%;
          & > *[class^="page-transition-"] {
            &:not(.page-transition-enter-done) {
              position: absolute;
              width: 100%;
            }
          }
        }
      `}</style>
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          ${direction < 0 ? `transform: translate3d(-${test}px, 0, 0);` : ""}
          ${direction > 0 ? `transform: translate3d(${test}px, 0, 0);` : ""}
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
          ${direction < 0 ? `transform: translate3d(${test}px, 0, 0);` : ""}
          ${direction > 0 ? `transform: translate3d(-${test}px, 0, 0);` : ""}
        }
      `}</style>
      <TransitionGroup className="transition-group">
        <CSSTransition
          in={true}
          exit={true}
          timeout={duration}
          mountOnEnter
          unmountOnExit
          classNames="page-transition"
          key={route}
        >
          <FrozenRouter>{children}</FrozenRouter>
        </CSSTransition>
      </TransitionGroup>
      <footer
        style={{ fontFamily: "Mark" }}
        className="ml-auto mt-auto text-[16px] font-bold leading-none pr-2"
      >
        FallInLife.com©{year}
      </footer>
    </>
  );
}
