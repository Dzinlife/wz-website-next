import { useLayout } from "@/utils/useLayout";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const Hello: React.FC = () => {
  const { helloWidth, layout } = useLayout();

  const color = useMemo(() => {
    switch (layout) {
      case "landscape":
        return "black";
      case "portrait":
        return "white";
    }
  }, [layout]);

  const router = useRouter();

  return (
    <div
      className={classNames("uppercase whitespace-nowrap", {
        hidden: !layout,
      })}
      style={{ fontFamily: "NeoSans", fontSize: helloWidth / 512, color }}
    >
      <div
        style={{
          fontSize: "176em",
          textIndent: "-0.06em",
          lineHeight: "0.85em",
        }}
      >
        Hello
      </div>
      <div>
        <div>
          <span style={{ fontSize: "32em" }}>This is</span>
          <span style={{ fontSize: "66em", lineHeight: "1.6em" }}>
            {" "}
            Zhao Wang
          </span>
        </div>
        <div>
          <span style={{ fontSize: "33em" }}>A</span>
          <span style={{ fontSize: "98em", lineHeight: "1.1em" }}>
            {" "}
            designer
          </span>
        </div>
        <div>
          <span style={{ fontSize: "32em" }}>And</span>
          <span style={{ fontSize: "88em", lineHeight: "1.3em" }}>
            {" "}
            engineer
          </span>
        </div>
        <div>
          <span style={{ fontSize: "31em" }}>Based in</span>
          <span style={{ fontSize: "70em", lineHeight: "1.2em" }}>
            {" "}
            Shanghai
          </span>
        </div>
        <div>
          <span style={{ fontSize: "32em" }}>Free free to</span>
          <span
            // className="relative"
            style={{ fontSize: "65em", lineHeight: "1.3em" }}
            onClick={() => router.push("/contact")}
          >
            {" "}
            <span className="inline-block cursor-pointer hover:bg-black hover:text-white transition-all hover:shadow-[0_-0.1em_0_0_rgba(0,0,0,1)]">
              contact
            </span>
            <div className="border-b-[3px] border-white border-dashed relative left-[3.53em] bottom-[0.06em] w-[4.39em] mix-blend-difference "></div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hello;
