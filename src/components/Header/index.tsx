"use client";
import Link from "next/link";
import { createDotSea } from "./dotSea";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useAsyncMemo } from "@/utils/useAsyncMemo";
import FontFaceObserver from "fontfaceobserver";
import Spring from "@/utils/tinySpring";

const Header: React.FC = () => {
  const dotSeaRef = useRef<ReturnType<typeof createDotSea>>(null!);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [curve, setCurve] = useState<[number, number][]>([]);

  const getPathPropByCurve = useCallback((_curve: typeof curve) => {
    if (_curve.length === 0) return "";

    let str = "M ";
    str += `${_curve[0][0]} ${_curve[0][1]}`;
    for (let i = 1; i < _curve.length; i += 1) {
      str += ` L ${_curve[i][0]} ${_curve[i][1]}`;
    }

    return str;
  }, []);

  const svgCurvePath = useMemo(
    () => getPathPropByCurve(curve),
    [curve, getPathPropByCurve]
  );

  const calcSegmentLength = useCallback(
    (a: [number, number], b: [number, number]) => {
      if (!a || !b) return;
      return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
    },
    []
  );

  const curveLength = useMemo(() => {
    return curve.reduce((acc, point, i) => {
      if (i === 0) return acc;
      return acc + (calcSegmentLength(curve[i - 1], point) || 0);
    }, 0);
  }, [curve, calcSegmentLength]);

  useEffect(() => {
    dotSeaRef.current = createDotSea({
      color: "white",

      width: window.innerWidth,
    });
    const { renderer, destroy, getCurve, setWidth, onUpdate } =
      dotSeaRef.current;

    onUpdate(() => setCurve(getCurve()));

    const resizeHandler = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", resizeHandler);

    setTimeout(() => {
      const c = canvasWrapperRef.current;
      if (!c) return;
      c.innerHTML = "";
      c.appendChild(renderer.domElement);
    });

    return () => {
      window.removeEventListener("resize", resizeHandler);
      destroy();
    };
  }, []);

  const tabs = useMemo(
    () => [
      {
        text: "ABOUT",
        href: "/",
      },
      {
        text: "WORKS",
        href: "/works",
      },
      {
        text: "CONTACT",
        href: "/contact",
      },
    ],
    []
  );

  const [width, height] = [window.innerWidth, window.innerHeight];

  const navBarMaxWidth = useMemo(() => {
    let bottleneck = Math.min(width, height);
    bottleneck = bottleneck > 512 ? 512 : bottleneck;
    return bottleneck * 0.72;
  }, [width, height]);

  const { data: fontLoaded } = useAsyncMemo(async () => {
    const font = "bold 13px Mark";
    await new FontFaceObserver("Mark", { weight: "bold" }).load(font);
    return true;
  }, []);

  const { tabsWithTextWidth, tabGap } = useMemo(() => {
    const font = "bold 13px Mark";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;

    const tabsWithTextWidth = tabs.map((tab) => {
      const metrics = ctx.measureText(tab.text);
      const textWidth = metrics.width;
      return {
        ...tab,
        textWidth,
      };
    });

    const totalTextWidth = tabsWithTextWidth.reduce(
      (acc, tab) => acc + tab.textWidth,
      0
    );

    const tabGap =
      (navBarMaxWidth - totalTextWidth) / (tabsWithTextWidth.length - 1);

    return {
      tabsWithTextWidth,
      tabGap,
    };
  }, [navBarMaxWidth, tabs, fontLoaded]);

  const tabsWithOffset = useMemo(() => {
    if (!curveLength) return;

    const offsetLeft = (curveLength - navBarMaxWidth) / 2;

    return tabsWithTextWidth.reduce((acc, tab, i) => {
      if (i === 0) {
        return [
          {
            ...tab,
            offset: offsetLeft,
          },
        ];
      }

      acc.push({
        ...tab,
        offset: acc[i - 1].offset + acc[i - 1].textWidth + tabGap,
      });

      return acc;
    }, [] as ((typeof tabsWithTextWidth)[0] & { offset: number })[]);
  }, [navBarMaxWidth, tabsWithTextWidth, curveLength, tabGap]);

  const splitCurve = useCallback(
    (_curve: typeof curve, start: number, to: number) => {
      if (!_curve.length) return [];

      let length = 0;
      let i = 0;

      while (length < start) {
        const add = calcSegmentLength(_curve[i], _curve[i + 1]) || 0;
        if (!add) break;
        length += add;
        i += 1;
      }

      const startIndex = i - 1;
      const startExcessLength = length - start;

      while (length < to) {
        const add = calcSegmentLength(_curve[i], _curve[i + 1]) || 0;
        if (!add) break;
        length += add;
        i += 1;
      }

      const endIndex = i - 1;
      const endExcessLength = length - to;

      const startIndexLineLength =
        calcSegmentLength(_curve[startIndex], _curve[startIndex + 1]) || 0;

      if (!startIndexLineLength) return [];

      const startExcessPercent =
        (startIndexLineLength - startExcessLength) / startIndexLineLength;
      _curve[startIndex][0] +=
        (_curve[startIndex + 1][0] - _curve[startIndex][0]) *
        startExcessPercent;
      _curve[startIndex][1] +=
        (_curve[startIndex + 1][1] - _curve[startIndex][1]) *
        startExcessPercent;

      const endIndexLineLength = calcSegmentLength(
        _curve[endIndex],
        _curve[endIndex + 1]
      );

      if (!endIndexLineLength) return [];

      const endExcessPercent =
        (endIndexLineLength - endExcessLength) / endIndexLineLength;
      _curve[endIndex + 1][0] =
        _curve[endIndex][0] +
        (_curve[endIndex + 1][0] - _curve[endIndex][0]) * endExcessPercent;
      _curve[endIndex + 1][1] =
        _curve[endIndex][1] +
        (_curve[endIndex + 1][1] - _curve[endIndex][1]) * endExcessPercent;

      const resultPathArr = _curve.slice(startIndex, endIndex + 2);

      return resultPathArr;
    },
    [calcSegmentLength]
  );

  const route = useSelectedLayoutSegment();

  const { currentTab, routeIndex } = useMemo(() => {
    const tabs =
      tabsWithOffset ||
      (tabsWithTextWidth as ((typeof tabsWithTextWidth)[0] & {
        offset?: number;
      })[]);

    if (!route)
      return {
        currentTab: tabs[0],
        routeIndex: 0,
      };

    const routeIndex = tabs.findIndex((n) => route === n.href.substring(1));

    return {
      currentTab: tabs[routeIndex],
      routeIndex,
    };
  }, [tabsWithOffset, route, tabsWithTextWidth]);

  const [prevRouteIndex, setPrevRouteIndex] = useState(routeIndex);

  const direction = useMemo(() => {
    if (prevRouteIndex === routeIndex) return 0;
    if (prevRouteIndex < routeIndex) return 1;
    if (prevRouteIndex > routeIndex) return -1;
  }, [routeIndex, prevRouteIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevRouteIndex(routeIndex);
    }, 500);

    return () => {
      setPrevRouteIndex(routeIndex);
      clearTimeout(timer);
    };
  }, [routeIndex]);

  const springLeftRef = useRef(Spring());
  const springRightRef = useRef(Spring());

  useEffect(() => {
    springLeftRef.current.transitionTo(currentTab.offset);
    springRightRef.current.transitionTo(
      currentTab.offset ? currentTab.offset + currentTab.textWidth : undefined
    );

    switch (direction) {
      case 1: {
        springLeftRef.current.setConfig({ stiffness: 90, damping: 20 });
        springRightRef.current.setConfig({ stiffness: 120, damping: 20 });
        break;
      }
      case -1: {
        springLeftRef.current.setConfig({ stiffness: 120, damping: 20 });
        springRightRef.current.setConfig({ stiffness: 90, damping: 20 });
        break;
      }
      case 0: {
        springLeftRef.current.setConfig({ stiffness: 200, damping: 20 });
        springRightRef.current.setConfig({ stiffness: 200, damping: 20 });
        break;
      }
    }
  }, [currentTab, direction]);

  const underlineCurvePath = useMemo(() => {
    const left = springLeftRef.current.getValue();
    const right = springRightRef.current.getValue();

    if (!left || !right) return "";

    const underlineCurve = splitCurve(curve, left, right);
    return getPathPropByCurve(underlineCurve.map((p) => ((p[1] += 4), p)));
  }, [curve, getPathPropByCurve, splitCurve]);

  const svgPathId = useState(`${(Math.random() * 10 ** 10).toFixed(0)}`)[0];

  const router = useRouter();

  return (
    <header>
      <div className="relative top-[80px]">
        <div ref={canvasWrapperRef}></div>
        <svg className="w-full absolute left-0 top-[-32px] font-[Mark] font-bold text-[13px]">
          <defs>
            <path id={svgPathId} d={svgCurvePath}></path>
          </defs>
          {tabsWithOffset?.map((tab, i) => (
            <a
              key={i}
              href=""
              onClick={(e) => {
                e.preventDefault();
                router.push(tab.href);
              }}
            >
              <rect></rect>
              <text className="fill-white">
                <textPath xlinkHref={`#${svgPathId}`} startOffset={tab.offset}>
                  {tab.text}
                </textPath>
              </text>
            </a>
          ))}
          <path
            d={underlineCurvePath}
            fill="transparent"
            strokeWidth="2"
            stroke="white"
          ></path>
        </svg>
      </div>
      <div className="hidden">
        <Link href="/" prefetch={true}>
          About
        </Link>
        <Link href="/works">Works</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </header>
  );
};

export default Header;
