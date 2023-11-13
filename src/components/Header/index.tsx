"use client";
import { createDotSea } from "./dotSea";
import {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  useId,
} from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useAsyncMemo } from "@/utils/useAsyncMemo";
import FontFaceObserver from "fontfaceobserver";
import Spring from "@/utils/tinySpring";
import { useLayout } from "@/utils/useLayout";
import Wz from "./Wz";
import classNames from "classnames";

const Header: React.FC = () => {
  const dotSeaRef = useRef<ReturnType<typeof createDotSea>>(null!);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const route = useSelectedLayoutSegment();

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

  const { layout, paddingLeft, helloWidth } = useLayout(curveLength);

  const [headerColor, setHeaderColor] = useState<"white" | "black">(
    layout === "portrait" && !route ? "white" : "black"
  );

  useEffect(() => {
    // const color = layout === "portrait" && !route ? "white" : "black";
    const color = "white";
    setHeaderColor(color);

    dotSeaRef.current?.setColor(color);
  }, [layout, route]);

  useEffect(() => {
    dotSeaRef.current = createDotSea({
      color: headerColor,

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

    const tabGap =
      (helloWidth - totalTextWidth) / (tabsWithTextWidth.length - 1);

    return {
      tabsWithTextWidth,
      tabGap: Math.max(MIN, tabGap),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helloWidth, tabs, fontLoaded]);

  const tabsWithOffset = useMemo(() => {
    if (!curveLength) return;

    return tabsWithTextWidth.reduce((acc, tab, i) => {
      if (i === 0) {
        return [
          {
            ...tab,
            offset: paddingLeft + tab.textWidth / 2,
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
  }, [tabsWithTextWidth, tabGap, paddingLeft, curveLength]);

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

  const springLeftRef = useRef(Spring<number>());
  const springRightRef = useRef(Spring<number>());
  const springCenterRef = useRef(
    Spring<number[]>([], { stiffness: 200, damping: 20 })
  );

  useEffect(() => {
    const { offset, textWidth } = currentTab || {};

    const offsetLeft = offset ? offset - currentTab.textWidth / 2 : offset;
    const offsetRight = offsetLeft ? offsetLeft + textWidth : offsetLeft;

    springLeftRef.current.transitionTo(offsetLeft);
    springRightRef.current.transitionTo(offsetRight);
    springCenterRef.current.transitionTo(
      tabsWithOffset?.map((n) => n.offset) || []
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
  }, [currentTab, direction, tabsWithOffset]);

  const textOffset = springCenterRef.current.getValue();

  const rectOffset = textOffset.map((textOffset, i) => {
    return textOffset - curveLength / 2 - 40;
  });

  const underlineCurvePath = useMemo(() => {
    const left = springLeftRef.current.getValue();
    const right = springRightRef.current.getValue();

    if (!left || !right) return "";

    const underlineCurve = splitCurve(curve, left, right);
    return getPathPropByCurve(underlineCurve.map((p) => ((p[1] += 4), p)));
  }, [curve, getPathPropByCurve, splitCurve]);

  const svgPathId = useId();

  const router = useRouter();

  const wzColor = useMemo(() => {
    if (!route && layout === "landscape") return "white";
    return headerColor;
  }, [route, headerColor, layout]);

  return (
    <header
      className={classNames("relative mix-blend-difference", {
        "h-[230px] pt-[80px]": layout === "landscape",
        "h-[260px] pt-[110px]": layout === "portrait",
      })}
    >
      <div ref={canvasWrapperRef}></div>
      <Wz
        color={wzColor}
        height={28}
        className={classNames("cursor-pointer z-10", {
          hidden: !layout,
          "fixed top-[100px] left-16": layout === "landscape",
          "absolute inset-0 m-auto -top-[110px]": layout === "portrait",
        })}
        onClick={() => {
          router.push("/");
        }}
      />
      <style jsx>{`
        text {
          transition: 0.07s ease-out;
        }
        rect:hover + text:not(.focus),
        text:not(.focus):hover {
          font-size: 16px;
        }
      `}</style>
      <svg className="w-full absolute bottom-[36px] left-0 font-[Mark] font-bold text-[13px]">
        <defs>
          <path id={svgPathId} d={svgCurvePath}></path>
        </defs>
        <path
          d={underlineCurvePath}
          fill="transparent"
          strokeWidth="2"
          stroke={headerColor}
        />
        {tabsWithOffset?.map((tab, i) => (
          <g
            className="cursor-pointer"
            key={i}
            onClick={(e) => {
              e.preventDefault();
              router.push(tab.href);
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
              fill={headerColor}
              textAnchor="middle"
              className={currentTab === tab ? "focus" : ""}
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
