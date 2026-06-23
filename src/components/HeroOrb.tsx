"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Glossy 3D centerpiece for the hero — a refractive "serum drop" of spring-green
 * glass, built with raw three.js (lazy-loaded by the parent via next/dynamic so
 * it never weighs on the initial bundle). Studio reflections come from a
 * procedural gradient environment (core three only → reliable bundling).
 *
 * v2: real glass transmission (not opaque jelly), a living liquid surface that
 * gently ripples, and a clear mouse reaction — the drop swells and wobbles more
 * as the pointer approaches, and tilts to follow it.
 *
 * Safe by default: renders nothing if WebGL is unavailable (the SVG base in the
 * hero stays visible); honours prefers-reduced-motion (no ripple/spin); caps
 * DPR; pauses off-screen or when the tab is hidden; fully disposes on unmount.
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
      const isSmall = window.matchMedia?.("(max-width: 768px)").matches;

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
      renderer.toneMappingExposure = 1.1;
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
      grad.addColorStop(0.4, "#f1f7e8");
      grad.addColorStop(0.72, "#aebfa9");
      grad.addColorStop(1, "#4f5a55");
      ectx.fillStyle = grad;
      ectx.fillRect(0, 0, 256, 256);
      // bright key highlight
      const spot = ectx.createRadialGradient(186, 54, 4, 186, 54, 96);
      spot.addColorStop(0, "rgba(255,255,255,1)");
      spot.addColorStop(1, "rgba(255,255,255,0)");
      ectx.fillStyle = spot;
      ectx.fillRect(0, 0, 256, 256);
      // a secondary soft light (gives a second glint as it turns)
      const spot2 = ectx.createRadialGradient(70, 150, 2, 70, 150, 70);
      spot2.addColorStop(0, "rgba(255,255,255,0.75)");
      spot2.addColorStop(1, "rgba(255,255,255,0)");
      ectx.fillStyle = spot2;
      ectx.fillRect(0, 0, 256, 256);
      // spring-green wash for branded refraction
      const tint = ectx.createRadialGradient(210, 210, 6, 210, 210, 150);
      tint.addColorStop(0, "rgba(203,239,77,0.6)");
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

      // --- the glass drop ---
      const RADIUS = 1.3;
      const detail = isSmall ? 16 : 22;
      const geo = new THREE.IcosahedronGeometry(RADIUS, detail);
      const pos = geo.attributes.position as import("three").BufferAttribute;
      const count = pos.count;
      // store the base unit directions (the displacement is applied each frame)
      const dirs = new Float32Array(count * 3);
      const tmp = new THREE.Vector3();
      for (let i = 0; i < count; i++) {
        tmp.fromBufferAttribute(pos, i).normalize();
        dirs[i * 3] = tmp.x;
        dirs[i * 3 + 1] = tmp.y;
        dirs[i * 3 + 2] = tmp.z;
      }

      // smooth pseudo-noise field over the unit sphere (cheap, organic)
      const field = (x: number, y: number, z: number, t: number) =>
        0.6 * Math.sin(x * 1.7 + t) * Math.cos(y * 1.9 - t * 0.8) * Math.sin(z * 1.5 + t * 0.6) +
        0.4 * Math.sin(x * 3.1 - t * 0.7) * Math.sin(y * 2.6 + t) * Math.cos(z * 3.3 - t * 0.5);

      const applyShape = (t: number, amp: number) => {
        for (let i = 0; i < count; i++) {
          const x = dirs[i * 3];
          const y = dirs[i * 3 + 1];
          const z = dirs[i * 3 + 2];
          const d = 1 + amp * field(x * 1.5, y * 1.5, z * 1.5, t);
          pos.setXYZ(i, x * RADIUS * d, y * RADIUS * d, z * RADIUS * d);
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
      };
      applyShape(0, 0.05);

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f6ffe0"),
        metalness: 0,
        roughness: 0.05,
        transmission: 1,
        thickness: 0.9,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        attenuationColor: new THREE.Color("#aee047"),
        attenuationDistance: 0.85,
        envMapIntensity: 1.45,
        specularIntensity: 1,
      });

      const mesh = new THREE.Mesh(geo, material);
      const group = new THREE.Group();
      group.add(mesh);
      group.rotation.set(0.25, 0.2, 0);
      scene.add(group);

      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xcbef4d, 0.6);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      // --- interaction ---
      const tilt = { x: 0, y: 0 };
      let hover = 0; // 0..1 eased
      let hoverTarget = 0;
      const onMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        tilt.x = (nx - 0.5) * 0.7;
        tilt.y = (ny - 0.5) * 0.7;
        // proximity: 1 when pointer is over the drop, fading out around it
        const inside =
          nx > -0.25 && nx < 1.25 && ny > -0.25 && ny < 1.25;
        hoverTarget = inside ? 1 : 0;
      };
      const onLeave = () => {
        hoverTarget = 0;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      mount.addEventListener("pointerleave", onLeave);

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
      const start = performance.now();

      const frame = () => {
        if (!running) return;
        const t = (performance.now() - start) / 1000;

        hover += (hoverTarget - hover) * 0.06;
        const baseAmp = reduceMotion ? 0.05 : 0.05 + 0.03 * Math.sin(t * 0.6);
        const amp = baseAmp + hover * 0.06; // swells toward the pointer
        if (!reduceMotion) applyShape(t * 0.9, amp);

        const targetScale = 1 + hover * 0.06;
        const s = group.scale.x + (targetScale - group.scale.x) * 0.08;
        group.scale.setScalar(s);

        if (!reduceMotion) group.rotation.y += 0.0032 + hover * 0.004;
        group.rotation.x += (0.25 + tilt.y - group.rotation.x) * 0.05;
        group.rotation.z += (tilt.x - group.rotation.z) * 0.05;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      if (reduceMotion) {
        renderer.render(scene, camera);
      } else {
        raf = requestAnimationFrame(frame);
      }
      onReady?.();

      const io = new IntersectionObserver(
        ([entry]) => {
          if (reduceMotion) return;
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(frame);
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
          raf = requestAnimationFrame(frame);
        }
      };
      document.addEventListener("visibilitychange", onVis);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        mount.removeEventListener("pointerleave", onLeave);
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
