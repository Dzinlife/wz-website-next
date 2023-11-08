"use client";
import Link from "next/link";
import { createDotSea } from "./dotSea";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAsyncMemo } from "@/utils/useAsyncMemo";
import FontFaceObserver from "fontfaceobserver";

const Header: React.FC = () => {
  const dotSeaRef = useRef<ReturnType<typeof createDotSea>>(null!);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [curve, setCurve] = useState<[number, number][]>([]);

  const svgCurvePath = useMemo(() => {
    if (curve.length === 0) return "";

    let str = "M ";
    str += `${curve[0][0]} ${curve[0][1]}`;
    for (let i = 1; i < curve.length; i += 1) {
      str += ` L ${curve[i][0]} ${curve[i][1]}`;
    }

    return str;
  }, [curve]);

  const calcSegmentLength = useCallback(
    (a: [number, number], b: [number, number]) => {
      return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
    },
    []
  );

  const curveLength = useMemo(() => {
    return curve.reduce((acc, point, i) => {
      if (i === 0) return acc;
      return acc + calcSegmentLength(curve[i - 1], point);
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
        text: "About",
        href: "/",
      },
      {
        text: "Works",
        href: "/works",
      },
      {
        text: "Contact",
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
    const offsetLeft = (curveLength - navBarMaxWidth) / 2;

    return tabsWithTextWidth?.reduce((acc, tab, i) => {
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

  const svgPathId = useState(`${(Math.random() * 10 ** 10).toFixed(0)}`)[0];

  const router = useRouter();

  return (
    <header>
      <div className="relative top-[80px]">
        <div ref={canvasWrapperRef}></div>
        <svg className="w-full absolute left-0 top-[-32px] font-[Mark] font-bold text-[13px] uppercase ">
          <defs>
            <path id={svgPathId} d={svgCurvePath}></path>
          </defs>
          {tabsWithOffset.map((tab, i) => (
            <a
              key={i}
              href=""
              onClick={(e) => {
                e.preventDefault();
                router.push(tab.href);
              }}
            >
              <rect></rect>
              <text textAnchor="middle" className="fill-white">
                <textPath xlinkHref={`#${svgPathId}`} startOffset={tab.offset}>
                  {tab.text}
                </textPath>
              </text>
            </a>
          ))}
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
