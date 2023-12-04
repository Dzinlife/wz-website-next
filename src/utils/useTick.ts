import { DependencyList, useEffect } from "react";

const callbacksMap = new Map<Function, number>();
let isRunning = false;

export const useTick = (deps: DependencyList = []) => {
  const innerCallbacks: Function[] = [];

  const tick = (fn: Function) => {
    innerCallbacks.push(fn);

    const exist = callbacksMap.get(fn);

    if (!exist) {
      callbacksMap.set(fn, 1);
    } else {
      callbacksMap.set(fn, exist + 1);
    }

    callbacksMap.size;

    if (callbacksMap.size && !isRunning) {
      isRunning = true;
      requestAnimationFrame(() => {
        Array.from(callbacksMap.keys()).forEach((callback) => callback());
        callbacksMap.clear();
        innerCallbacks.length = 0;
        isRunning = false;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (innerCallbacks.length) {
        innerCallbacks.forEach((fn) => {
          const num = callbacksMap.get(fn);
          if (!num) return;
          if (num === 1) {
            callbacksMap.delete(fn);
          }
          if (num > 1) {
            callbacksMap.set(fn, num - 1);
          }
        });
        innerCallbacks.length = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return tick;
};
