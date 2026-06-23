"use client";

import { useEffect, useRef, useState } from "react";

export type OrbClimate = {
  uv: number | null;
  hr: number | null;
  temp: number | null;
};

/**
 * Glossy 3D centerpiece for the hero — a refractive "serum drop" of spring-green
 * glass (raw three.js, lazy-loaded so it never weighs on the initial bundle).
 *
 * The drop is LIVE-DATA REACTIVE: it reads the visitor's real local climate and
 * morphs — humid air makes it dewier and more fluid (more ripple, glossier),
 * heat speeds its motion, strong UV warms its glints. This literally performs
 * Fiomio's promise (care tuned to your city + season). Mouse proximity makes it
 * swell and follow the pointer.
 *
 * Safe by default: renders nothing if WebGL is unavailable (the SVG base in the
 * hero stays); honours prefers-reduced-motion; caps DPR; pauses off-screen / on
 * hidden tab; disposes fully on unmount.
 */
export function HeroOrb({
  className = "",
  climate,
  onReady,
}: {
  className?: string;
  climate?: OrbClimate | null;
  onReady?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const climateRef = useRef<OrbClimate | null>(climate ?? null);
  const [failed, setFailed] = useState(false);

  // keep the latest climate readable by the animation loop without re-init
  useEffect(() => {
    climateRef.current = climate ?? null;
  }, [climate]);

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
      const clamp = (x: number, a: number, b: number) =>
        Math.min(b, Math.max(a, x));

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

      // --- procedural studio environment ---
      const envCanvas = document.createElement("canvas");
      envCanvas.width = 256;
      envCanvas.height = 256;
      const ectx = envCanvas.getContext("2d")!;
      const grad = ectx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.4, "#eef4f0");
      grad.addColorStop(0.72, "#aebfa9");
      grad.addColorStop(1, "#4f5a55");
      ectx.fillStyle = grad;
      ectx.fillRect(0, 0, 256, 256);
      const spot = ectx.createRadialGradient(186, 54, 4, 186, 54, 96);
      spot.addColorStop(0, "rgba(255,255,255,1)");
      spot.addColorStop(1, "rgba(255,255,255,0)");
      ectx.fillStyle = spot;
      ectx.fillRect(0, 0, 256, 256);
      const spot2 = ectx.createRadialGradient(70, 150, 2, 70, 150, 70);
      spot2.addColorStop(0, "rgba(255,255,255,0.75)");
      spot2.addColorStop(1, "rgba(255,255,255,0)");
      ectx.fillStyle = spot2;
      ectx.fillRect(0, 0, 256, 256);
      const tint = ectx.createRadialGradient(210, 210, 6, 210, 210, 150);
      tint.addColorStop(0, "rgba(110,158,140,0.55)");
      tint.addColorStop(1, "rgba(110,158,140,0)");
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
      const detail = isSmall ? 20 : 26;
      const geo = new THREE.IcosahedronGeometry(RADIUS, detail);
      const pos = geo.attributes.position as import("three").BufferAttribute;
      const nrm = geo.attributes.normal as import("three").BufferAttribute;
      const count = pos.count;
      const dirs = new Float32Array(count * 3);
      const tmp = new THREE.Vector3();
      for (let i = 0; i < count; i++) {
        tmp.fromBufferAttribute(pos, i).normalize();
        dirs[i * 3] = tmp.x;
        dirs[i * 3 + 1] = tmp.y;
        dirs[i * 3 + 2] = tmp.z;
      }
      const field = (x: number, y: number, z: number, t: number) =>
        0.6 * Math.sin(x * 1.7 + t) * Math.cos(y * 1.9 - t * 0.8) * Math.sin(z * 1.5 + t * 0.6) +
        0.4 * Math.sin(x * 3.1 - t * 0.7) * Math.sin(y * 2.6 + t) * Math.cos(z * 3.3 - t * 0.5);
      // amp = surface ripple; melt 0..1 = how molten the drop is (heat).
      // Hot melts like slime: vertical squash, base spreads, the mass sinks.
      // Cold stays a clean, firm sphere.
      const applyShape = (t: number, amp: number, melt: number) => {
        const squashY = 1 - 0.17 * melt;
        const sink = melt * 0.12 * RADIUS;
        for (let i = 0; i < count; i++) {
          const x = dirs[i * 3];
          const y = dirs[i * 3 + 1];
          const z = dirs[i * 3 + 2];
          const r = RADIUS * (1 + amp * field(x * 1.5, y * 1.5, z * 1.5, t));
          const bottom = Math.max(0, -y); // 0 at top → 1 at the base
          const widen = 1 + 0.32 * melt * bottom;
          const px = x * r * widen;
          const py = y * r * squashY - sink;
          const pz = z * r * widen;
          pos.setXYZ(i, px, py, pz);
          // smooth radial normals → seam-free shading (no faceting), and far
          // cheaper than computeVertexNormals (helps low-end phones)
          const inv = 1 / (Math.hypot(px, py, pz) || 1);
          nrm.setXYZ(i, px * inv, py * inv, pz * inv);
        }
        pos.needsUpdate = true;
        nrm.needsUpdate = true;
      };
      applyShape(0, 0.05, 0.4);

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eef6f1"),
        metalness: 0,
        roughness: 0.08,
        transmission: 1,
        thickness: 0.9,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        attenuationColor: new THREE.Color("#579a7c"),
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
      const rim = new THREE.DirectionalLight(0x7fb098, 0.6);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      // --- interaction ---
      const tilt = { x: 0, y: 0 };
      let hover = 0;
      let hoverTarget = 0;
      const onMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        tilt.x = (nx - 0.5) * 0.7;
        tilt.y = (ny - 0.5) * 0.7;
        hoverTarget = nx > -0.25 && nx < 1.25 && ny > -0.25 && ny < 1.25 ? 1 : 0;
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

      // eased climate-driven params (start at neutral)
      let eRough = 0.08;
      let eKey = 1.2;
      let eAmp = 0.05;
      let eSpeed = 0.9;
      let eMelt = 0.4;

      let raf = 0;
      let running = true;
      const start = performance.now();

      const frame = () => {
        if (!running) return;
        const t = (performance.now() - start) / 1000;

        // --- live climate → targets (defaults to mid when unknown) ---
        const c = climateRef.current;
        const hN = c && c.hr != null ? clamp((c.hr - 30) / 60, 0, 1) : 0.5; // humidity
        const tN = c && c.temp != null ? clamp(c.temp / 35, 0, 1) : 0.5; // heat
        const uN = c && c.uv != null ? clamp(c.uv / 11, 0, 1) : 0.4; // UV

        const tgtRough = 0.13 - hN * 0.09; // humid = glossier (dewy)
        const tgtKey = 1.0 + uN * 0.8; // high UV = brighter, warmer glint
        const tgtAmp = 0.03 + hN * 0.045 + tN * 0.03; // humid/hot = more fluid
        const tgtSpeed = 0.7 + hN * 0.25; // humid = a touch livelier
        const tgtMelt = tN; // HOT = molten slime, COLD = firm round

        eRough += (tgtRough - eRough) * 0.04;
        eKey += (tgtKey - eKey) * 0.04;
        eAmp += (tgtAmp - eAmp) * 0.04;
        eSpeed += (tgtSpeed - eSpeed) * 0.04;
        eMelt += (tgtMelt - eMelt) * 0.04;

        material.roughness = eRough;
        key.intensity = eKey;
        // warm the key light slightly as UV climbs (keeps green identity)
        key.color.setRGB(1, 1 - uN * 0.05, 1 - uN * 0.13);

        hover += (hoverTarget - hover) * 0.06;
        const pulse = reduceMotion ? 0 : 0.02 * Math.sin(t * 0.6);
        const amp = eAmp + pulse + hover * 0.06;
        if (!reduceMotion) applyShape(t * eSpeed, amp, eMelt);

        const targetScale = 1 + hover * 0.06;
        group.scale.setScalar(
          group.scale.x + (targetScale - group.scale.x) * 0.08,
        );

        if (!reduceMotion) group.rotation.y += 0.0028 + hover * 0.004;
        group.rotation.x += (0.25 + tilt.y - group.rotation.x) * 0.05;
        group.rotation.z += (tilt.x - group.rotation.z) * 0.05;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      if (reduceMotion) {
        // one climate-tuned still frame (no animation)
        const c = climateRef.current;
        const hN = c && c.hr != null ? clamp((c.hr - 30) / 60, 0, 1) : 0.5;
        const tN = c && c.temp != null ? clamp(c.temp / 35, 0, 1) : 0.5;
        material.roughness = 0.13 - hN * 0.09;
        applyShape(0, 0.03 + hN * 0.045, tN);
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
