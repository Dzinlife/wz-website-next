"use client";
import { createDotSea } from "./dotSea";
import {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  useId,
  useTransition,
} from "react";
import {
  useRouter,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useAsyncMemo } from "@/utils/useAsyncMemo";
import FontFaceObserver from "fontfaceobserver";
import { useSpring } from "@/utils/useSpring";
import { useLayout } from "@/utils/useLayout";
import Wz from "./Wz";
import classNames from "classnames";

const Header: React.FC = () => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const route = useSelectedLayoutSegment();
  const routes = useSelectedLayoutSegments();

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

  const { layout, offsetLeft, minWidth } = useLayout(curveLength);

  const { data: dotSea } = useAsyncMemo(() => {
    return createDotSea({
      color: "white",
      width: window.innerWidth,
    });
  }, []);

  useEffect(() => {
    if (!dotSea) return;

    const { renderer, destroy, getCurve, setWidth, onUpdate } = dotSea;
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
  }, [dotSea]);

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

  const { data: fontLoaded } = useAsyncMemo(async () => {
    const font = "bold 13px Mark";
    await new FontFaceObserver("Mark", { weight: "bold" }).load(font);
    return true;
  }, []);

  const { tabsWithTextWidth, tabGap } = useMemo(() => {
    const MIN = 0;

    if (typeof document === "undefined")
      return { tabsWithTextWidth: [], tabGap: MIN };

    const font = "bold 13px Mark";
    const canvas = (() => {
      return document.createElement("canvas");
    })();
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

    const tabGap = (minWidth - totalTextWidth) / (tabsWithTextWidth.length - 1);

    return {
      tabsWithTextWidth,
      tabGap: Math.max(MIN, tabGap),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minWidth, tabs, fontLoaded]);

  const tabsWithOffset = useMemo(() => {
    if (!curveLength) return;

    return tabsWithTextWidth.reduce((acc, tab, i) => {
      if (i === 0) {
        return [
          {
            ...tab,
            offset: offsetLeft + tab.textWidth / 2,
          },
        ];
      }

      acc.push({
        ...tab,
        offset:
          acc[i - 1].offset +
          acc[i - 1].textWidth / 2 +
          tabGap +
          tab.textWidth / 2,
      });

      return acc;
    }, [] as ((typeof tabsWithTextWidth)[0] & { offset: number })[]);
  }, [tabsWithTextWidth, tabGap, offsetLeft, curveLength]);

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

  const springLeft = useSpring<number>();
  const springRight = useSpring<number>();
  const springCenter = useSpring([]);

  useEffect(() => {
    const { offset, textWidth } = currentTab || {};

    const offsetLeft = offset ? offset - currentTab.textWidth / 2 : offset;
    const offsetRight = offsetLeft ? offsetLeft + textWidth : offsetLeft;

    springLeft.transitionTo(offsetLeft);
    springRight.transitionTo(offsetRight);
    springCenter.transitionTo(tabsWithOffset?.map((n) => n.offset) || []);

    switch (direction) {
      case 1: {
        springLeft.setConfig({ stiffness: 90, damping: 20 });
        springRight.setConfig({ stiffness: 120, damping: 20 });
        break;
      }
      case -1: {
        springLeft.setConfig({ stiffness: 120, damping: 20 });
        springRight.setConfig({ stiffness: 90, damping: 20 });
        break;
      }
      case 0: {
        springLeft.setConfig({ stiffness: 200, damping: 20 });
        springRight.setConfig({ stiffness: 200, damping: 20 });
        break;
      }
    }
  }, [
    currentTab,
    direction,
    tabsWithOffset,
    springLeft,
    springRight,
    springCenter,
  ]);

  const textOffset = springCenter.getValue();

  const rectOffset = textOffset.map((textOffset, i) => {
    return textOffset - curveLength / 2 - 40;
  });

  const underlineCurvePath = useMemo(() => {
    const left = springLeft.getValue();
    const right = springRight.getValue();

    if (!left || !right) return "";

    const underlineCurve = splitCurve(curve, left, right);
    return getPathPropByCurve(underlineCurve.map((p) => ((p[1] += 4), p)));
  }, [curve, getPathPropByCurve, splitCurve, springLeft, springRight]);

  const svgPathId = useId();

  const router = useRouter();

  const [, startTransition] = useTransition();

  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handler = () => {
      if (window.scrollY <= 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };
    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  });

  return (
    <header
      className={classNames("relative mix-blend-difference h-200 ", {
        "mt-12": layout === "landscape",
        "mt-28": layout === "portrait",
      })}
    >
      <div ref={canvasWrapperRef}></div>
      <Wz
        color={"white"}
        height={28}
        className={classNames("z-10", {
          hidden: !layout,
          "fixed top-[72px] left-16": layout === "landscape",
          "absolute inset-0 m-auto -top-[180px]": layout === "portrait",
          "cursor-pointer": isTop,
          "cursor-n-resize": !isTop,
        })}
        onClick={() => {
          if (isTop) {
            router.push("/");
          } else {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }}
      />
      <svg className="w-full absolute bottom-0 left-0 font-[Mark] font-bold text-[13px]">
        <defs>
          <path id={svgPathId} d={svgCurvePath}></path>
        </defs>
        <path
          className={classNames("transition-opacity", {
            "opacity-0": routes.length > 1,
          })}
          d={underlineCurvePath}
          fill="transparent"
          strokeWidth="2"
          stroke={"white"}
        />
        {tabsWithOffset?.map((tab, i) => (
          <g
            className="cursor-pointer group"
            key={i}
            onClick={(e) => {
              startTransition(() => {
                router.push(tab.href);
              });
            }}
          >
            <rect
              height="120"
              width="80"
              y="0"
              x="50%"
              fill="transparent"
              transform={`translate(${rectOffset?.[i] ?? 0})`}
            />
            <text
              fill={"white"}
              textAnchor="middle"
              className={classNames("transition-all ", {
                "group-hover:text-[16px]":
                  currentTab !== tab || routes.length > 1,
              })}
            >
              <textPath xlinkHref={`#${svgPathId}`} startOffset={textOffset[i]}>
                {tab.text}
              </textPath>
            </text>
          </g>
        ))}
      </svg>
    </header>
  );
};

export default Header;
