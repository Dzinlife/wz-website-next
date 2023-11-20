import Spring, { useSpring } from "@/utils/useSpring";
import { useLayout } from "@/utils/useLayout";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useRef, useState } from "react";

const Hello: React.FC = () => {
  const { minWidth, layout } = useLayout();

  const color = useMemo(() => {
    switch (layout) {
      case "landscape":
        return "black";
      case "portrait":
        return "white";
    }
  }, [layout]);

  const router = useRouter();

  const colors = useMemo(
    () => [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#9e9e9e",
      "#607d8b",
    ],
    []
  );

  const [updateKey, update] = useState({});

  const colorScheme = useMemo(() => {
    const picked: string[] = [];
    while (picked.length < 5) {
      const index = Math.floor(Math.random() * colors.length);
      const color = colors[index];
      if (picked.includes(color)) continue;
      picked.push(color);
    }

    return picked;
  }, [colors, updateKey]);

  useEffect(() => {
    update({});

    const timer = setInterval(() => {
      update({});
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [helloOpacity, setHelloOpacity] = useState(0);

  const helloSpring = useSpring(helloOpacity);

  useEffect(() => {
    if (!layout) return;
    if (layout === "landscape") {
      setHelloOpacity(1);
      return;
    }

    const timer = setTimeout(() => {
      helloSpring
        .setValue(helloOpacity)
        .transitionTo(1)
        .onUpdate((value) => {
          setHelloOpacity(value ?? 0);
        });
    }, 400);

    return () => {
      helloSpring.destroy();
      clearTimeout(timer);
    };
  }, [layout]);

  return (
    <>
      <style jsx>{`
        .use-color-blend {
          opacity: ${helloOpacity};
          ${layout === "portrait" && "mix-blend-mode: difference;"}
        }

        .use-color-scheme {
          transition: color 3000ms ease, border-color 3000ms ease;
        }

        .contact:hover {
          & + div {
            border-style: solid;
          }
        }
      `}</style>
      <div
        className={classNames("uppercase whitespace-nowrap ", {
          hidden: !layout,
        })}
        style={{
          fontFamily: "NeoSans",
          fontSize: minWidth / 512,
          color: layout === "portrait" ? "white" : color,
        }}
      >
        <div className="use-color-blend text-[175em] indent-[-0.07em] leading-[0.85em]">
          Hello
        </div>
        <div>
          <div>
            <span className="use-color-blend text-[32em]">This is</span>
            <span
              className="use-color-scheme text-[66em] leading-[1.6em]"
              style={{ color: colorScheme[0] }}
            >
              {" "}
              Zhao Wang
            </span>
          </div>
          <div>
            <span className="use-color-blend text-[33em]">A</span>
            <span
              className="use-color-scheme text-[83.6em] leading-[1.1em]"
              style={{ color: colorScheme[1] }}
            >
              {" "}
              developer
            </span>
          </div>
          <div>
            <span className="use-color-blend text-[32em]">And</span>
            <span
              className="use-color-scheme text-[89em] leading-[1.3em] "
              style={{ color: colorScheme[2] }}
            >
              {" "}
              designer
            </span>
          </div>
          <div>
            <span className="use-color-blend text-[31em]">Based in</span>
            <span
              className="use-color-scheme text-[70em] leading-[1.2em] "
              style={{ color: colorScheme[3] }}
            >
              {" "}
              Shanghai
            </span>
          </div>
          <div>
            <span className="use-color-blend text-[32em]">Feel free to</span>

            <Link href="/contact">
              <span style={{ fontSize: "65em", lineHeight: "1.3em" }}>
                {" "}
                <span
                  className="use-color-scheme contact"
                  style={{ color: colorScheme[4] }}
                >
                  contact
                </span>
                <div
                  style={{
                    borderColor: colorScheme[4],
                  }}
                  className="use-color-scheme border-b-[3px] border-dotted relative left-[3.53em] bottom-[0.06em] w-[4.39em]"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Hello);
