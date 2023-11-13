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

  const routeRef = useRef<typeof route | undefined>(undefined);

  // if (routeRef.current.currentRoute !== route) {
  //   const prevRoute = routeRef.current.currentRoute;
  //   routeRef.current = {
  //     currentRoute: route,
  //     prevRoute,
  //   };
  // }

  useEffect(() => {
    return () => {
      routeRef.current = route;
    };
  }, [route]);

  const prevRoute = routeRef.current;

  const routes = [null, "works", "contact"];

  const direction = useMemo(() => {
    return routes.findIndex((routeName) => routeName === route) -
      routes.findIndex((routeName) => routeName === prevRoute) >
      0
      ? "right"
      : "left";
  }, [routes, route, prevRoute]);

  const transitionStyles = useMemo(() => {
    return {
      entering: { opacity: 1, transform: "translate3d(0,0,0)" },
      entered: { opacity: 1, transfrom: "translate3d(0,0,0)" },
      exiting: {
        opacity: 0,
        transform:
          direction === "left"
            ? "translate3d(-100px,0,0)"
            : "translate3d(100px,0,0)",
      },
      exited: {
        opacity: 0,
        transform:
          direction === "left"
            ? "translate3d(-100px,0,0)"
            : "translate3d(100px,0,0)",
      },
    } as Partial<Record<TransitionStatus, React.CSSProperties>>;
  }, [direction]);

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
        <style jsx>{`
          .transition-wrapper {
            pointer-events: none;
            transition: ${duration}ms ease-in-out;
            position: absolute;
            top: 0;
            width: 100%;
            willchange: "content";

            & > * {
              pointer-events: auto;
            }
          }
        `}</style>
        <TransitionGroup>
          <Transition
            exit={false}
            timeout={duration}
            key={route}
            mountOnEnter
            unmountOnExit
          >
            {(state) => (
              <div
                className="transition-wrapper"
                style={{
                  ...transitionStyles[state],
                }}
              >
                {children}
              </div>
            )}
          </Transition>
        </TransitionGroup>
      </body>
    </html>
  );
}
