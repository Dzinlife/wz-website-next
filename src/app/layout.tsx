"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Link from "next/link";
import {
  CSSTransition,
  SwitchTransition,
  Transition,
  TransitionGroup,
  TransitionStatus,
} from "react-transition-group";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const duration = 500;

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

  const routes = [null, "works", "contact"];

  const direction = useMemo(() => {
    if (prevRoute === undefined) return;

    return routes.findIndex((routeName) => routeName === route) -
      routes.findIndex((routeName) => routeName === prevRoute) >
      0
      ? "right"
      : "left";
  }, [routes, route, prevRoute]);

  const [inProp, setInProp] = useState(true);

  useEffect(() => {
    setInProp(false);
    requestAnimationFrame(() => {
      setInProp(true);
    });
  }, [route]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="hidden">
          <Link href="/" prefetch={true}>
            About
          </Link>
          <Link href="/works">Works</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
            ${direction === "left"
              ? "transform: translate3d(-100px, 0, 0);"
              : ""}
            ${direction === "right"
              ? "transform: translate3d(100px, 0, 0);"
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
          }
          .page-transition-exit-active {
            opacity: 0;
            ${direction === "left"
              ? "transform: translate3d(100px, 0, 0);"
              : ""}
            ${direction === "right"
              ? "transform: translate3d(-100px, 0, 0);"
              : ""}
            transition: ${duration}ms ease;
          }
        `}</style>

        <CSSTransition
          in={inProp}
          exit={false}
          timeout={duration}
          classNames="page-transition"
          mountOnEnter
          unmountOnExit
        >
          {children}
        </CSSTransition>
      </body>
    </html>
  );
}
