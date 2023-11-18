export const RequestManager = () => {
  const callbacks: Function[] = [];
  let isRunning = false;

  const tick = (callback: Function) => {
    !callbacks.includes(callback) && callbacks.push(callback);

    if (callbacks.length && !isRunning) {
      isRunning = true;
      requestAnimationFrame(() => {
        callbacks.forEach((callback) => callback());
        callbacks.length = 0;
        isRunning = false;
      });
    }
  };

  return {
    tick,
  };
};
