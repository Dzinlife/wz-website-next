import { DependencyList } from "react";

const callbacks: Function[] = [];

export const useTick = (deps: DependencyList = []) => {
  let isRunning = false;

  const tick = (fn: Function) => {
    !callbacks.includes(fn) && callbacks.push(fn);

    if (callbacks.length && !isRunning) {
      isRunning = true;
      requestAnimationFrame(() => {
        callbacks.forEach((callback) => callback());
        callbacks.length = 0;
        isRunning = false;
      });
    }
  };

  return tick;
};
