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
      <div className="text-[176em] indent-[-0.06em] leading-[0.85em] active:text-white active:mix-blend-difference">
        Hello
      </div>
      <div>
        <div>
          <span className="text-[32em]">This is</span>
          <span className="text-[66em] leading-[1.6em] active:text-white active:mix-blend-difference">
            {" "}
            Zhao Wang
          </span>
        </div>
        <div>
          <span className="text-[33em]">A</span>
          <span className="text-[98em] leading-[1.1em] active:text-white active:mix-blend-difference">
            {" "}
            designer
          </span>
        </div>
        <div>
          <span className="text-[32em]">And</span>
          <span className="text-[88em] leading-[1.3em] active:text-white active:mix-blend-difference">
            {" "}
            engineer
          </span>
        </div>
        <div>
          <span className="text-[31em]">Based in</span>
          <span className="text-[70em] leading-[1.2em] active:text-white active:mix-blend-difference">
            {" "}
            Shanghai
          </span>
        </div>
        <div>
          <span className="text-[32em]">Free free to</span>
          <style jsx>{`
            .contact:hover {
              & + div {
                border-style: solid;
                border-width: 3px;
              }
            }
          `}</style>
          <span
            style={{ fontSize: "65em", lineHeight: "1.3em" }}
            onClick={() => router.push("/contact")}
          >
            {" "}
            <span className="contact hover:text-white hover:mix-blend-difference">
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
