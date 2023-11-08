export default function Spring(
  initialPosition = 0,
  { stiffness = 200, damping = 10, precision = 100 } = {}
) {
  const config = {
    stiffness,
    damping,
    precision,
  };

  let position = initialPosition;
  let endPosition = 0;
  let secPerFrame = 1 / 60;
  let velocity = 0;
  let onUpdate = (v: number) => {};
  let onRest = (v: number) => {};
  let raf: number;

  const interpolate = () => {
    const { stiffness, damping, precision } = config;

    const distance = endPosition - position;
    const acceleration = stiffness * distance - damping * velocity;
    const newVelocity = velocity + acceleration * secPerFrame;
    const newPosition = position + newVelocity * secPerFrame;

    const isComplete =
      Math.abs(newVelocity) < 1 / precision &&
      Math.abs(newPosition - endPosition) < 1 / precision;

    position = isComplete ? endPosition : newPosition;
    velocity = newVelocity;
    onUpdate(position);

    if (!isComplete) raf = requestAnimationFrame(interpolate);
    else onRest(position);
  };

  return {
    setValue: (v = 0) => {
      cancelAnimationFrame(raf);
      position = endPosition = v;
      onUpdate(position);
    },
    getValue: () => position,
    transitionTo: (v?: number) => {
      if (v === undefined) return;

      if (!position) {
        position = v;
        return;
      }

      cancelAnimationFrame(raf);
      endPosition = v;
      raf = requestAnimationFrame(interpolate);
    },
    onUpdate: (fn = (v?: number) => {}) => {
      onUpdate = fn;
      fn(position);
    },
    onRest: (fn = (v?: number) => {}) => {
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
}
