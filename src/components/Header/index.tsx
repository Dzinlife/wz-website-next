"use client";
import Link from "next/link";
import { createDotSea } from "./dotSea";
import { useEffect, useRef } from "react";

const Header: React.FC = () => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { renderer, destroy, setWidth } = createDotSea({
      color: "white",
      width: window.innerWidth,
    });

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

  return (
    <header>
      <div ref={canvasWrapperRef}></div>
      <div>
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
