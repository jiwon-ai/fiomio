"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient WebGL aurora behind the hero. Raw WebGL1 fragment shader (no
 * three.js / r3f) — domain-warped fractal noise drifting slowly through the
 * brand palette (cream -> mint -> sage -> spring). Kept LIGHT and low-contrast
 * so the dark headline stays readable on top.
 *
 * Performance: renders at a fraction of CSS resolution (gradients don't need
 * sharp pixels), caps the pixel ratio, pauses when off-screen or the tab is
 * hidden, and honours prefers-reduced-motion (renders a single still frame).
 * Falls back to nothing (transparent) when WebGL is unavailable.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = uv;
  p.x *= aspect;

  float t = u_time * 0.035;

  vec2 q = vec2(fbm(p*1.4 + vec2(0.0, t)), fbm(p*1.4 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p*1.7 + q*1.8 + vec2(1.7, 9.2) + t*0.6),
                fbm(p*1.7 + q*1.8 + vec2(8.3, 2.8) - t*0.6));
  float n = fbm(p*1.6 + r*1.6);

  vec3 cream  = vec3(0.984, 0.984, 0.965);
  vec3 paper2 = vec3(0.925, 0.933, 0.902);
  vec3 mint   = vec3(0.910, 0.965, 0.796);
  vec3 sage   = vec3(0.722, 0.780, 0.745);
  vec3 spring = vec3(0.796, 0.937, 0.302);

  vec3 col = cream;
  col = mix(col, paper2, smoothstep(0.30, 0.75, n));
  col = mix(col, mint,   smoothstep(0.45, 0.95, n) * 0.85);
  col = mix(col, sage,   smoothstep(0.62, 1.05, r.x) * 0.30);

  float glow = smoothstep(0.55, 1.0, n) * smoothstep(0.15, 1.0, uv.x);
  col = mix(col, spring, glow * 0.16);

  col = mix(cream, col, 0.82);
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export function HeroShader({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: false, alpha: false }) as
        | WebGLRenderingContext
        | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const SCALE = 0.6;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr * SCALE));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = true;
    const start = performance.now();

    const renderFrame = (timeMs: number) => {
      gl.uniform1f(uTime, timeMs / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      if (!running) return;
      renderFrame(performance.now() - start);
      raf = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      renderFrame(8000);
    } else {
      loop();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduceMotion) return;
        if (entry.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
