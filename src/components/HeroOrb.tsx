"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Glossy 3D centerpiece for the hero — a refractive "serum drop" blob built
 * with raw three.js (lazy-loaded by the parent via next/dynamic, so it never
 * weighs on the initial bundle). Spring-green tinted glass with studio
 * reflections from a procedural gradient environment (core three only, no
 * example modules → reliable bundling). Slow drift + gentle mouse parallax.
 *
 * Safe by default: if WebGL is unavailable it renders nothing (the SVG base in
 * Hero stays visible); honours prefers-reduced-motion (no spin); caps DPR; pauses when
 * off-screen or the tab is hidden; fully disposes on unmount.
 */
export function HeroOrb({
  className = "",
  onReady,
}: {
  className?: string;
  onReady?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed) return;

      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (!renderer.getContext()) {
        setFailed(true);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 5);

      // --- procedural studio environment (gradient → equirect → PMREM) ---
      const envCanvas = document.createElement("canvas");
      envCanvas.width = 256;
      envCanvas.height = 256;
      const ectx = envCanvas.getContext("2d")!;
      const grad = ectx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.45, "#eef4e6");
      grad.addColorStop(0.75, "#bfcdbf");
      grad.addColorStop(1, "#5f6b66");
      ectx.fillStyle = grad;
      ectx.fillRect(0, 0, 256, 256);
      // a soft bright spot → crisp specular highlight
      const spot = ectx.createRadialGradient(190, 60, 4, 190, 60, 90);
      spot.addColorStop(0, "rgba(255,255,255,0.95)");
      spot.addColorStop(1, "rgba(255,255,255,0)");
      ectx.fillStyle = spot;
      ectx.fillRect(0, 0, 256, 256);
      // a spring-green wash from the lower right for branded refraction
      const tint = ectx.createRadialGradient(210, 210, 6, 210, 210, 140);
      tint.addColorStop(0, "rgba(203,239,77,0.55)");
      tint.addColorStop(1, "rgba(203,239,77,0)");
      ectx.fillStyle = tint;
      ectx.fillRect(0, 0, 256, 256);

      const envTex = new THREE.CanvasTexture(envCanvas);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      envTex.colorSpace = THREE.SRGBColorSpace;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromEquirectangular(envTex);
      scene.environment = envRT.texture;
      envTex.dispose();
      pmrem.dispose();

      // --- the glass blob ---
      const geo = new THREE.IcosahedronGeometry(1.25, 48);
      // bake gentle organic displacement once (no per-frame cost)
      const pos = geo.attributes.position as import("three").BufferAttribute;
      const v = new THREE.Vector3();
      const noise = (x: number, y: number, z: number) =>
        Math.sin(x * 1.7 + 0.6) * Math.cos(y * 1.9 - 0.3) * Math.sin(z * 1.5 + 1.1) +
        0.5 * Math.sin(x * 3.3) * Math.sin(y * 2.7) * Math.cos(z * 3.1);
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = v.clone().normalize();
        const d = 1 + 0.07 * noise(n.x * 1.6, n.y * 1.6, n.z * 1.6);
        v.copy(n).multiplyScalar(1.25 * d);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eaffb4"),
        metalness: 0,
        roughness: 0.12,
        transmission: 1,
        thickness: 1.6,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        attenuationColor: new THREE.Color("#9bd64a"),
        attenuationDistance: 2.2,
        envMapIntensity: 1.25,
        specularIntensity: 1,
      });

      const mesh = new THREE.Mesh(geo, material);
      const group = new THREE.Group();
      group.add(mesh);
      group.rotation.set(0.3, 0.2, 0);
      scene.add(group);

      // a key light to lift the clearcoat highlight
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xcbef4d, 0.5);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      // --- interaction + loop ---
      const target = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const resize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);

      let raf = 0;
      let running = true;
      const tick = () => {
        if (!running) return;
        if (!reduceMotion) group.rotation.y += 0.0035;
        group.rotation.x += (target.y - group.rotation.x + 0.3) * 0.04;
        group.rotation.z += (target.x - group.rotation.z) * 0.04;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      const startLoop = () => {
        if (!running) return;
        raf = requestAnimationFrame(tick);
      };
      if (reduceMotion) {
        renderer.render(scene, camera);
      } else {
        renderer.render(scene, camera);
        startLoop();
      }
      onReady?.();

      const io = new IntersectionObserver(
        ([entry]) => {
          if (reduceMotion) return;
          if (entry.isIntersecting && !running) {
            running = true;
            startLoop();
          } else if (!entry.isIntersecting) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 },
      );
      io.observe(mount);

      const onVis = () => {
        if (reduceMotion) return;
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!running) {
          running = true;
          startLoop();
        }
      };
      document.addEventListener("visibilitychange", onVis);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVis);
        io.disconnect();
        geo.dispose();
        material.dispose();
        envRT.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount)
          mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return null;
  return <div ref={mountRef} className={className} aria-hidden />;
}
