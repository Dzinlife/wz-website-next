import { useEffect, useState } from "react";

export const useLayout = () => {
  const [layout, setLayout] = useState<"landscape" | "portrait">(
    typeof window !== "undefined" &&
      window.matchMedia("(min-aspect-ratio: 4/3)").matches
      ? "landscape"
      : "portrait"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-aspect-ratio: 4/3)");

    const handler = () => {
      setLayout(mediaQuery.matches ? "landscape" : "portrait");
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  return layout;
};
