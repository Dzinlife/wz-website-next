"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSpring } from "@/utils/useSpring";
import { useTick } from "@/utils/useTick";
import classNames from "classnames";

type SelectProps<T> = T extends string
  ? {
      options: Array<string>;
      labelProp?: never;
      valueProp?: never;
    }
  : {
      options: Array<T>;
      labelProp: keyof T;
      valueProp: keyof T;
    };

export const Select = <T extends unknown>(props: SelectProps<T>) => {
  return <div>{JSON.stringify(props)}</div>;
};

const Magnification: React.FC<
  React.PropsWithChildren<
    {
      cellWidth?: number;
      cellHeight?: number;
      zoomRange?: number;
      zoom?: number;
      style?: React.CSSProperties;
      cellStyle?: React.CSSProperties;
      className?: string;
      cellClassName?: string;
    } & (
      | {
          direction?: "horizontal";
          origin?: "center" | "left" | "right";
        }
      | {
          direction: "vertical";
          origin?: "center" | "top" | "bottom";
        }
    )
  >
> = ({
  children,
  direction = "horizontal",
  cellWidth = 44,
  cellHeight = 44,
  zoomRange = 2,
  zoom = 2,
  style,
  cellStyle,
  className,
  cellClassName,
  origin = "center",
}) => {
  const n = React.Children.count(children);

  const calc = useMemo(() => {
    const zoomRaduis = zoomRange / 2;

    const range = (i: number, offset: number) => {
      let left = i - offset;
      let right = left + 1;
      if (left < -zoomRaduis) {
        left = -zoomRaduis;
      }

      if (right > zoomRaduis) {
        right = zoomRaduis;
      }

      return [left, right] as [number, number];
    };

    const integral = (x: number) => {
      const t = zoomRaduis * 2;
      const c = (2 * Math.PI) / t;
      // integration of (cos(c * x) + 1) * 1 / 2
      return (1 / (2 * c)) * Math.sin(c * x) + x / 2;
    };

    const integralRange = (range: [number, number]) => {
      const [left, right] = range;
      return integral(right) - integral(left);
    };

    const calcScaleSum = (scale: number) => {
      const _r = Math.min(zoomRaduis, n / 2);
      return integralRange([-_r, _r]) * scale;
    };

    const calcScales = (offset: number, scale: number) => {
      return Array(n)
        .fill(null)
        .map((_, i) => {
          let value = integralRange(range(i, offset));
          if (value < 0) {
            value = 0;
          } else if (value > 1) {
            value = 1;
          }

          return value * scale;
        });
    };

    return {
      calcScales,
      calcScaleSum,
    };
  }, [n, zoomRange]);

  const containerRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef<{ x: number; y: number }>();

  const scaleRef = useRef(0);
  const [scales, setScales] = useState(Array(n).fill(0));
  const [translates, setTranslates] = useState(Array(n).fill(0));

  const update = useCallback(() => {
    if (!mouseRef.current) return;
    const { x, y } = mouseRef.current;

    const { calcScaleSum, calcScales } = calc;

    const { x: containerX, y: containerY } =
      containerRef.current!.getBoundingClientRect();

    let offset: number = null!;

    direction === "horizontal" && (offset = (x - containerX) / cellWidth);

    direction === "vertical" && (offset = (y - containerY) / cellHeight);

    const scales = calcScales(offset, scaleRef.current);
    const maxScaleSum = calcScaleSum(scaleRef.current);

    let translates = Array(n).fill(0);
    for (let i = 1; i < translates.length; i += 1) {
      translates[i] += translates[i - 1] + scales[i - 1] / 2 + scales[i] / 2;
    }

    if (offset >= n / 2) {
      translates = translates.map((value) => value - maxScaleSum / 2);
    } else {
      const wholeTranslate =
        maxScaleSum / 2 -
        translates[translates.length - 1] -
        scales[scales.length - 1] / 2;
      translates = translates.map((value) => value + wholeTranslate);
    }

    setScales(scales);
    setTranslates(translates);
  }, [calc, n, cellWidth, direction, cellHeight]);

  const tick = useTick();

  const mouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      tick(update);
    },
    [tick, update]
  );

  const touchMove: React.TouchEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      mouseRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      tick(update);
    },
    [tick, update]
  );

  const transitionSpring = useSpring<number>(
    scaleRef.current,
    {
      onUpdate: (v) => {
        scaleRef.current = v;
        tick(update);
      },
    },
    [update]
  );

  const mouseEnter = useCallback(() => {
    transitionSpring.transitionTo(zoom - 1);
  }, [transitionSpring, zoom]);

  const mouseLeave = useCallback(() => {
    transitionSpring.transitionTo(0);
  }, [transitionSpring]);

  return (
    <div
      ref={containerRef}
      onMouseMove={mouseMove}
      onTouchMove={touchMove}
      onMouseEnter={mouseEnter}
      onTouchStart={mouseEnter}
      onMouseLeave={mouseLeave}
      onTouchEnd={mouseLeave}
      style={{
        whiteSpace: "nowrap",
        ...style,
      }}
      className={classNames({}, className)}
    >
      {React.Children.map(children, (child, i) => {
        return (
          <div
            className={classNames({}, cellClassName)}
            style={{
              display: direction === "horizontal" ? "inline-flex" : "flex",
              width: cellWidth,
              height: cellHeight,
              transformOrigin: origin,
              verticalAlign: "top",
              transform: `translate(${
                direction === "horizontal" ? `${translates[i] * 100}%` : "0"
              },${
                direction === "vertical" ? `${translates[i] * 100}%` : "0"
              }) scale(${scales[i] + 1}) `,
              ...cellStyle,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Magnification);
