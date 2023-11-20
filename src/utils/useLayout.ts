import { ContentBodyContext } from "@/app/ClientLayout";
import { useSelectedLayoutSegment } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

export const useLayout = (outterWidth?: number) => {
  const [layout, setLayout] = useState<"landscape" | "portrait">();

  const route = useSelectedLayoutSegment();

  const [, update] = useState({});

  const [width, height] = (() => {
    if (typeof window === "undefined") return [0, 0];
    return [window.outerWidth, window.outerHeight];
  })();

  if (outterWidth === undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (typeof window === "undefined") return;

      const handler = () => {
        update({});
      };

      window.addEventListener("resize", handler);

      return () => {
        window.removeEventListener("resize", handler);
      };
    }, []);
  }

  outterWidth = outterWidth ?? width;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(
      "(min-aspect-ratio: 4/3) and (min-width: 640px) and (min-height: 220px)"
    );

    const handler = () => {
      setLayout(mediaQuery.matches ? "landscape" : "portrait");
    };

    handler();

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  const minWidth = useMemo(() => {
    if (!layout) return 0;
    const bottleneck = width > 512 ? 512 : width;
    return bottleneck * 0.72;
  }, [width, layout]);

  let offsetLeft = (outterWidth - minWidth) / 2;

  let offsetCenter = 0;

  if (!route && layout === "landscape") {
    const myHeadImgRatio = 1 / 5;
    const contentWidth = width - height * myHeadImgRatio;

    offsetCenter = width - contentWidth;
  }

  if (layout === "portrait") offsetCenter += 5;

  offsetLeft += offsetCenter;

  const bodyDiv = use(ContentBodyContext);

  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    if (!bodyDiv) return;

    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setMinHeight(height - 100);
    });

    observer.observe(bodyDiv);

    return () => {
      observer.disconnect();
    };
  }, [bodyDiv]);

  return {
    layout,
    offsetLeft,
    offsetCenter,
    minWidth,
    minHeight,
  };
};
