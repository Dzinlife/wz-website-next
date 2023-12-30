import { DependencyList, useEffect, useRef } from "react";

const mutexMap = new Map<
  ReturnType<typeof Spring>["config"]["mutexKey"],
  ReturnType<typeof Spring>
>();

const Spring = <
  T extends number | number[] | undefined,
  U = T extends number ? number : T extends number[] ? number[] : T,
  V = T extends undefined ? number : U
>(
  initialPosition?: U,
  {
    stiffness = 200,
    damping = 22,
    precision = 100,
    onUpdate = (v: V) => {},
    onRest = (v: V) => {},
    mutexKey = undefined as any,
    overrideMutex = false,
  } = {}
) => {
  let isMuted = false;

  const config = {
    stiffness,
    damping,
    precision,
    onUpdate,
    onRest,
    mutexKey,
    overrideMutex,
  };

  let positions: number[] =
    initialPosition !== undefined
      ? Array.isArray(initialPosition)
        ? initialPosition.slice()
        : [initialPosition]
      : [];
  let endPositions: number[] = [];
  // let secPerFrame = 1 / 60;
  let velocity = 0;
  let motionList = [];
  let raf: number;
  let lastTime = 0;

  const animate = () => {
    const now = performance.now();
    let secPerFrame = (now - lastTime) / 1000;

    // 页面切换到后台，requestAnimationFrame 会暂停，导致 secPerFrame 过大
    if (secPerFrame > 0.1) {
      lastTime = now;
      raf = requestAnimationFrame(animate);
      return;
    }

    const { stiffness, damping, precision } = config;

    motionList = endPositions.map((endPosition, i) => {
      let position = positions[i];
      const distance = endPosition - position;
      const acceleration = stiffness * distance - damping * velocity;
      const newVelocity = velocity + acceleration * secPerFrame;
      const newPosition = position + newVelocity * secPerFrame;

      const isComplete =
        Math.abs(newVelocity) < 1 / precision &&
        Math.abs(newPosition - endPosition) < 1 / precision;

      position = isComplete ? endPosition : newPosition;

      velocity = newVelocity;
      return {
        isComplete,
        position,
        velocity,
      };
    });

    positions = motionList.map((n) => n.position);

    config.onUpdate(positions as V);

    if (motionList.some((n) => !n.isComplete)) {
      lastTime = performance.now();
      raf = requestAnimationFrame(animate);
    } else config.onRest(positions as V);
  };

  const instance = {
    config,
    setValue: (v?: U) => {
      cancelAnimationFrame(raf);
      positions = endPositions =
        v !== undefined ? (Array.isArray(v) ? v.slice() : [v]) : [];
      config.onUpdate(positions as V);
      return instance;
    },
    getValue: (): V => {
      return (Array.isArray(initialPosition) ? positions : positions[0]) as V;
    },
    transitionTo: (v?: U) => {
      if (v === undefined) return instance;

      if (!positions.length) {
        positions = v !== undefined ? (Array.isArray(v) ? v.slice() : [v]) : [];
        return instance;
      }

      cancelAnimationFrame(raf);
      endPositions =
        v !== undefined ? (Array.isArray(v) ? v.slice() : [v]) : [];

      if (endPositions.some((n, i) => n !== positions[i])) {
        animate();
      }

      return instance;
    },
    onUpdate: (fn = (v?: V) => {}, options?: { immediate?: boolean }) => {
      if (isMuted) return;
      config.onUpdate = fn;
      options?.immediate && fn(positions as V);
      return instance;
    },
    onRest: (fn = (v?: V) => {}) => {
      config.onRest = fn;
      return instance;
    },
    destroy: () => {},
    setConfig: (newConfig: Partial<typeof config>) => {
      Object.assign(config, newConfig);
      return instance;
    },
  };

  instance.destroy = () => {
    cancelAnimationFrame(raf);
    config.onUpdate = () => {};
    config.onRest = () => {};
    mutexMap.delete(mutexKey);
  };

  if (mutexKey !== null && mutexKey !== undefined) {
    if (mutexMap.has(mutexKey)) {
      if (overrideMutex) {
        const prevInstance = mutexMap.get(mutexKey);
        prevInstance?.destroy();
      } else {
        isMuted = true;
      }
    } else {
      mutexMap.set(mutexKey, instance as any);
    }
  }

  return instance;
};

export const useSpring = <T extends number | number[] | undefined>(
  initialValue?: Parameters<typeof Spring<T>>[0],
  options?: Parameters<typeof Spring<T>>[1],
  deps: DependencyList = []
) => {
  const instanceRef = useRef(Spring(initialValue, options));

  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
    } else {
      instanceRef.current = Spring(initialValue, options);
    }
    return () => {
      instanceRef.current.destroy();
    };
  }, [...deps]);

  return instanceRef.current;
};

export default Spring;
