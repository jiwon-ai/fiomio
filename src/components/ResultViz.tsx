"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Results-screen 3D — distinct from the hero drop. The diagnostic returns a
 * protocol of actives, so we render them as a small constellation: a central
 * node (your skin) ringed by glossy glass spheres (your recommended actives),
 * linked by faint lines and slowly orbiting. Raw three.js, lazy-loaded.
 *
 * Safe by default: renders nothing if WebGL is unavailable; honours
 * prefers-reduced-motion; caps DPR; pauses off-screen / on hidden tab; disposes.
 */
export function ResultViz({
  className = "",
  count = 3,
}: {
  className?: string;
  count?: number;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const n = Math.max(1, Math.min(5, count));

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

      const W = mount.clientWidth || 1;
      const H = mount.clientHeight || 1;

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
      renderer.setSize(W, H);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
      camera.position.set(0, 0.3, 6);

      // procedural studio env
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.45, "#eef4f0");
      g.addColorStop(0.75, "#aebfa9");
      g.addColorStop(1, "#54605b");
      x.fillStyle = g;
      x.fillRect(0, 0, 256, 256);
      const sp = x.createRadialGradient(186, 54, 4, 186, 54, 96);
      sp.addColorStop(0, "rgba(255,255,255,1)");
      sp.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = sp;
      x.fillRect(0, 0, 256, 256);
      const tn = x.createRadialGradient(210, 210, 6, 210, 210, 150);
      tn.addColorStop(0, "rgba(110,158,140,0.55)");
      tn.addColorStop(1, "rgba(110,158,140,0)");
      x.fillStyle = tn;
      x.fillRect(0, 0, 256, 256);
      const envTex = new THREE.CanvasTexture(c);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      envTex.colorSpace = THREE.SRGBColorSpace;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromEquirectangular(envTex);
      scene.environment = envRT.texture;
      envTex.dispose();
      pmrem.dispose();

      const glass = (tint: string, rough = 0.08) =>
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#ecf5ef"),
          metalness: 0,
          roughness: rough,
          transmission: 1,
          thickness: 0.8,
          ior: 1.48,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          attenuationColor: new THREE.Color(tint),
          attenuationDistance: 0.9,
          envMapIntensity: 1.4,
        });

      const root = new THREE.Group();
      scene.add(root);

      // central node = your skin
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 48, 32),
        glass("#7fb098", 0.05),
      );
      root.add(core);

      // ringed actives
      const tints = ["#7fb098", "#92c0a8", "#6aa085", "#a6cdb9", "#5f9477"];
      const orbiters: import("three").Mesh[] = [];
      const linePts: number[] = [];
      const R = 1.7;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const size = i === 0 ? 0.6 : 0.46 - i * 0.02;
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(size, 40, 28),
          glass(tints[i % tints.length]),
        );
        const tilt = (i % 2 === 0 ? 0.5 : -0.4) * 0.6;
        m.position.set(Math.cos(a) * R, Math.sin(tilt) * 0.8, Math.sin(a) * R);
        m.userData = { a, size };
        root.add(m);
        orbiters.push(m);
        linePts.push(0, 0, 0, m.position.x, m.position.y, m.position.z);
      }

      // faint connecting lines (constellation)
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePts, 3),
      );
      const lines = new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({
          color: new THREE.Color("#2f6b52"),
          transparent: true,
          opacity: 0.28,
        }),
      );
      root.add(lines);

      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x7fb098, 0.5);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      const tilt = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        tilt.x = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
        tilt.y = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
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
      const start = performance.now();
      const lp = lineGeo.attributes.position as import("three").BufferAttribute;

      const frame = () => {
        if (!running) return;
        const t = (performance.now() - start) / 1000;
        if (!reduceMotion) {
          root.rotation.y += 0.004;
          // gentle orbit bob + keep lines attached
          orbiters.forEach((m, i) => {
            const a = (m.userData.a as number) + t * 0.15;
            const y = Math.sin(t * 0.8 + i) * 0.18;
            m.position.set(Math.cos(a) * R, y, Math.sin(a) * R);
            m.rotation.y += 0.01;
            lp.setXYZ(i * 2 + 1, m.position.x, m.position.y, m.position.z);
          });
          lp.needsUpdate = true;
        }
        root.rotation.x += (0.1 + tilt.y - root.rotation.x) * 0.05;
        root.rotation.z += (tilt.x * 0.5 - root.rotation.z) * 0.05;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      if (reduceMotion) renderer.render(scene, camera);
      else raf = requestAnimationFrame(frame);

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
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVis);
        io.disconnect();
        core.geometry.dispose();
        (core.material as import("three").Material).dispose();
        orbiters.forEach((m) => {
          m.geometry.dispose();
          (m.material as import("three").Material).dispose();
        });
        lineGeo.dispose();
        (lines.material as import("three").Material).dispose();
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
