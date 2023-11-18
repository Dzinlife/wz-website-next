"use client";

import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ContentBodyContext } from "../clientLayout";
import { min, set } from "date-fns";
import Magnification from "@/components/Magnification";

const Contact: React.FC = () => {
  const bodyDiv = use(ContentBodyContext);

  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    if (!bodyDiv) return;

    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setMinHeight(height - 200);
    });

    observer.observe(bodyDiv);

    return () => {
      observer.disconnect();
    };
  }, [bodyDiv]);

  return (
    <div
      className="w-96  box-content mx-auto text-center flex flex-col justify-center items-center"
      style={{
        minHeight: minHeight,
        fontFamily: "Mark",
      }}
    >
      <h3 className="text-2xl font-bold ">Mail me</h3>
      <a href="mailto:dzinlife@me.com" className="hover:underline ">
        dzinlife@me.com
      </a>
      <h3 className="text-2xl font-bold mt-6">Chat with me</h3>
      <span>WeChat: Dzinlife</span>
      <h3 className="text-2xl font-bold leading-8 mt-6">Follow me</h3>
      <Magnification cellWidth={44} cellHeight={44} cellClassName="bg-red-600">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
      </Magnification>
    </div>
  );
};

export default Contact;
