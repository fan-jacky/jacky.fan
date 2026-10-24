import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onScrollPos, getScrollPos } from './scroll-state';

function calcRotation(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Vanilla port of the former Letter3D React component (react-three-fiber +
 * framer-motion). Renders /letter.glb on a transparent canvas, tilts with
 * scroll position, and drifts upward as the page scrolls.
 */
export function initLetter3D(container: HTMLElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(1, 0, 2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1);
  fillLight.position.set(-1, 0, 2);
  scene.add(fillLight);

  let model: THREE.Object3D | null = null;
  const initialRotation = [calcRotation(-10), calcRotation(70), calcRotation(-20)];

  new GLTFLoader().load('/letter.glb', (gltf) => {
    model = gltf.scene;
    model.scale.setScalar(0.9);
    model.rotation.set(initialRotation[0], initialRotation[1], initialRotation[2]);
    scene.add(model);
  });

  const inView = { current: false };
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      inView.current = entry.isIntersecting;
    },
    { rootMargin: '0px', threshold: 0 },
  );
  intersectionObserver.observe(container);

  function resize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  function updateFromScroll() {
    const scrollPos = getScrollPos();
    const posY = (scrollPos.scroll.y ?? 0) / (scrollPos.limit.y || 1);
    const scrollY = scrollPos.scroll.y ?? 0;

    if (model) {
      model.rotation.set(
        calcRotation(Math.min(scrollY * 0.2 - 10, 30)),
        calcRotation(70),
        calcRotation(-20),
      );
    }

    // Original animated `top: -10 * posY rem` via framer-motion.
    container.style.top = `${-10 * posY}rem`;
  }

  const unsubscribe = onScrollPos(updateFromScroll);

  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!inView.current) return;
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf);
    unsubscribe();
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
