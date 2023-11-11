const Spring = <T extends number | number[] | undefined>(
  initialPosition?: T,
  { stiffness = 200, damping = 10, precision = 100 } = {}
) => {
  const config = {
    stiffness,
    damping,
    precision,
  };

  let positions: number[] =
    initialPosition !== undefined
      ? Array.isArray(initialPosition)
        ? initialPosition.slice()
        : [initialPosition]
      : [];
  let endPositions: number[] = [];
  let secPerFrame = 1 / 60;
  let velocity = 0;
  let motionList = [];
  let onUpdate = (v: T extends undefined ? number : T) => {};
  let onRest = (v: T extends undefined ? number : T) => {};
  let raf: number;

  const interpolate = () => {
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

    if (motionList.some((n) => !n.isComplete))
      raf = requestAnimationFrame(interpolate);
    // else onRest(motionList.map(n => n.position) as T);
  };

  return {
    setValue: (v?: T) => {
      cancelAnimationFrame(raf);
      positions = endPositions =
        v !== undefined ? (Array.isArray(v) ? v.slice() : [v]) : [];
      // onUpdate(positions);
    },
    getValue: (): T extends undefined ? number : T => {
      return (
        Array.isArray(initialPosition) ? positions : positions[0]
      ) as T extends undefined ? number : T;
    },
    transitionTo: (v?: T) => {
      if (v === undefined) return;

      if (!positions.length) {
        positions = v !== undefined ? (Array.isArray(v) ? v.slice() : [v]) : [];
        return;
      }

      cancelAnimationFrame(raf);
      endPositions =
        v !== undefined ? (Array.isArray(v) ? v.slice() : [v]) : [];
      raf = requestAnimationFrame(interpolate);
    },
    onUpdate: (fn = (v?: T extends undefined ? number : T) => {}) => {
      onUpdate = fn;
      fn(positions as T extends undefined ? number : T);
    },
    onRest: (fn = (v?: T extends undefined ? number : T) => {}) => {
      onRest = fn;
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      onUpdate = () => {};
      onRest = () => {};
    },
    setConfig: (newConfig: Partial<typeof config>) => {
      Object.assign(config, newConfig);
    },
  };
};

export default Spring;
