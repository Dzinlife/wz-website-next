import * as Three from "three";
import dotImg from "./dot.png";

export const createDotSea = (option: {
  fov?: number;
  separation?: number;
  color: "black" | "white";
  width: number;
}) => {
  const { fov = 30, separation = 120, color = "black" } = option || {};

  const meta = {
    width: window.innerWidth,
    height: 120,
    fov,
    separation,
    amountX: 0,
    amountY: 0,
    color,
  };

  const renderer = new Three.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  const camera = new Three.PerspectiveCamera(
    meta.fov,
    meta.width / meta.height,
    1,
    10000
  );
  camera.position.set(0, 240, 1000);
  camera.lookAt(0, 120, 0);

  const scene = new Three.Scene();

  scene.fog = new Three.Fog(0x000000, 1000, 2800);

  const texture = new Three.TextureLoader().load(dotImg.src);

  const material = new Three.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    fog: true,
  });

  const setColor = (color: "white" | "black") => {
    const materialHex = color === "white" ? 0xffffff : 0x000000;
    const fogHex = color === "black" ? 0xffffff : 0x0000;

    material.color.setHex(materialHex);
    scene.fog?.color.setHex(fogHex);
  };

  setColor(color);

  const particles: Three.Sprite[] = [];

  const setWidth = (_width: number) => {
    meta.width = _width;

    meta.amountX = Math.round((meta.width / separation) * 10);
    if (meta.amountX % 2 !== 0) meta.amountX != 1;
    meta.amountY = 14;

    renderer.setSize(meta.width, meta.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = meta.width / meta.height;
    camera.updateProjectionMatrix();

    particles.length = 0;
    scene.remove(...scene.children);
    let i = 0;
    for (let ix = 0; ix < meta.amountX; ix++) {
      for (let iy = 0; iy < meta.amountY; iy++) {
        const particle = (particles[i] = new Three.Sprite(material));
        particle.position.x =
          ix * separation - ((meta.amountX - 1) * separation) / 2;
        particle.position.z =
          iy * separation - ((meta.amountY - 1) * separation) / 1;
        scene.add(particle);
        i++;
      }
    }
  };

  setWidth(meta.width);

  const toScreenPosition = (vec: Three.Vector3) => {
    const { x, y, z } = vec;
    const vector = new Three.Vector3(x, y, z);
    const canvas = renderer.domElement;

    // map to normalized device coordinate (NDC) space
    vector.project(camera);

    // map to 2D screen space
    return {
      x: Math.round((vector.x + 1) * (canvas.width / 2)),
      y: Math.round((-vector.y + 1) * (canvas.height / 2)),
    };
  };

  const getCurve = () => {
    const curveArray: [number, number][] = [];
    for (let ix = 0; ix < meta.amountX; ix += 1) {
      const curveParticle = particles[ix * meta.amountY + (meta.amountY - 3)];
      const { x, y } = toScreenPosition(curveParticle.position);
      curveArray.push([
        x / window.devicePixelRatio,
        y / window.devicePixelRatio,
      ]);
    }
    return curveArray;
  };

  let tick = 0;

  const render = () => {
    let renderIndex = 0;
    for (let ix = 0; ix < meta.amountX; ix += 1) {
      for (let iy = 0; iy < meta.amountY; iy += 1) {
        const particle = particles[renderIndex];

        const waveX = Math.sin((ix + tick / 10) * 0.3);
        const waveY = Math.sin((iy + tick / 10) * 0.5);

        particle.position.y = (waveX + waveY) * 50;

        const waveScale = (waveX + 1 + waveY + 1) * 3 + 3;

        particle.scale.x = waveScale;
        particle.scale.y = waveScale;

        renderIndex += 1;
      }
    }

    renderer.render(scene, camera);
    tick += 1;
  };

  let requestId: number;

  const callbacks: Function[] = [];

  const animate = () => {
    render();
    callbacks.every((callback) => callback());
    requestId = requestAnimationFrame(animate);
  };

  animate();

  const onUpdate = (callback: Function) => {
    callbacks.push(callback);
  };

  return {
    renderer,
    setColor,
    destroy: () => {
      callbacks.length = 0;
      cancelAnimationFrame(requestId);
      renderer.dispose();
    },
    getCurve,
    setWidth,
    onUpdate,
  };
};
