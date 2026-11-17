import React, { useEffect, useRef } from 'react';
import { GRAPH_SVG, DIAMOND_SVG, COIN_SVG, BUILDINGS_SVG } from './svgShapesData';

interface BinaryParticle {
  id: number;
  char: '0' | '1';
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  swirlDir: number;
  curveDir: number;
  curveHeight: number;
  color: string;
  glowColor: string;
  coreColor: string;
  size: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

interface ShapeDefinition {
  id: string;
  name: string;
  points: { x: number; y: number }[];
}

export const DataPipelineCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({
    particles: [] as BinaryParticle[],
    shapes: [] as ShapeDefinition[],
    timer: 0,
    cycleDuration: 5.0, // Exactly 5.0s per shape
    transitionDuration: 1.8, // 1.8s tight amalgam morph, 3.2s stable hold
    currentShapeIndex: 0,
    dimensions: { width: 1200, height: 700 },
    lastTime: performance.now(),
    mouse: { x: -1000, y: -1000, isHovering: false }
  });

  // Colorverse Radiant Palette based on polar angle
  const getColorForAngle = (angle: number): { hex: string; glow: string; core: string } => {
    const norm = (angle + Math.PI) / (Math.PI * 2);

    const stops = [
      { p: 0.00, r: 0,   g: 242, b: 254 }, // Cyan
      { p: 0.18, r: 79,  g: 172, b: 254 }, // Azure Blue
      { p: 0.35, r: 168, g: 85,  b: 247 }, // Violet
      { p: 0.52, r: 255, g: 42,  b: 133 }, // Hot Magenta
      { p: 0.70, r: 255, g: 107, b: 0   }, // Solar Orange
      { p: 0.88, r: 255, g: 214, b: 0   }, // Solar Gold
      { p: 1.00, r: 0,   g: 242, b: 254 }  // Wrap to Cyan
    ];

    let r = 0, g = 242, b = 254;
    for (let i = 0; i < stops.length - 1; i++) {
      const s1 = stops[i];
      const s2 = stops[i + 1];
      if (norm >= s1.p && norm <= s2.p) {
        const k = (norm - s1.p) / (s2.p - s1.p);
        r = Math.round(s1.r + (s2.r - s1.r) * k);
        g = Math.round(s1.g + (s2.g - s1.g) * k);
        b = Math.round(s1.b + (s2.b - s1.b) * k);
        break;
      }
    }

    return {
      hex: `rgb(${r}, ${g}, ${b})`,
      glow: `rgba(${r}, ${g}, ${b}, 0.22)`,
      core: `rgba(${Math.min(255, r + 55)}, ${Math.min(255, g + 55)}, ${Math.min(255, b + 55)}, 0.95)`
    };
  };

  // --- 6 EXACT SHAPES MATCHING USER REFERENCE IMAGES (Strictly zero stray floating particles) ---
  const generateShapes = (): ShapeDefinition[] => {
    const COUNT = 360;

    const createSampler = (minDist: number) => {
      const pts: { x: number; y: number }[] = [];
      const add = (x: number, y: number) => {
        for (let i = 0; i < pts.length; i++) {
          const dx = pts[i].x - x;
          const dy = pts[i].y - y;
          if (dx * dx + dy * dy < minDist * minDist) return false;
        }
        pts.push({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
        return true;
      };

      const line = (x1: number, y1: number, x2: number, y2: number, steps = 150) => {
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          add(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
        }
      };

      const circle = (cx: number, cy: number, r: number, steps = 150) => {
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          add(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
      };

      const arc = (cx: number, cy: number, r: number, a1: number, a2: number, steps = 150) => {
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const a = a1 + (a2 - a1) * t;
          add(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
      };

      return { pts, add, line, circle, arc };
    };

    const sortAngularly = (pts: { x: number; y: number }[]) => {
      return pts.sort((p1, p2) => {
        const a1 = Math.atan2(p1.y, p1.x);
        const a2 = Math.atan2(p2.y, p2.x);
        if (Math.abs(a1 - a2) > 0.001) return a1 - a2;
        return (p1.x * p1.x + p1.y * p1.y) - (p2.x * p2.x + p2.y * p2.y);
      });
    };

    // Uniformly sample points to preserve all shape features without truncation, ensuring EXACT count
    const sampleToCount = (pts: { x: number; y: number }[], targetCount: number) => {
      if (pts.length === 0) return [];
      const res: { x: number; y: number }[] = [];
      const step = pts.length / targetCount;
      for (let i = 0; i < targetCount; i++) {
        res.push(pts[Math.floor(i * step) % pts.length]);
      }
      return res;
    };

    // Mathematically perfect SVG path sampler using browser native W3C Path length geometry
    const sampleSvgPaths = (
      paths: string[],
      targetCount: number,
      viewBox = { width: 60, height: 60 },
      options?: { maxPathCounts?: Record<number, number> }
    ): { x: number; y: number }[] => {
      if (typeof document === 'undefined') return [];

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${viewBox.width} ${viewBox.height}`);
      svg.style.position = 'fixed';
      svg.style.left = '-9999px';
      svg.style.top = '-9999px';
      svg.style.width = '100px';
      svg.style.height = '100px';
      svg.style.visibility = 'hidden';
      document.body.appendChild(svg);

      const elements = paths.map(d => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
        return { el: p, len: p.getTotalLength() };
      });

      // Calculate balanced point allocations (prevents dense glyphs like $ from hoarding all points)
      const maxPathCounts = options?.maxPathCounts;
      let reservedCount = 0;
      let remainingLen = 0;

      elements.forEach((item, idx) => {
        if (maxPathCounts && maxPathCounts[idx] !== undefined) {
          reservedCount += maxPathCounts[idx];
        } else {
          remainingLen += item.len;
        }
      });

      const availableCount = Math.max(0, targetCount - reservedCount);
      const counts: number[] = [];
      let allocated = 0;

      elements.forEach((item, idx) => {
        if (maxPathCounts && maxPathCounts[idx] !== undefined) {
          counts.push(maxPathCounts[idx]);
          allocated += maxPathCounts[idx];
        } else {
          const c = Math.round((item.len / (remainingLen || 1)) * availableCount);
          counts.push(c);
          allocated += c;
        }
      });

      // Adjust rounding difference to the longest unconstrained path
      const diff = targetCount - allocated;
      let maxIdx = -1, maxL = -1;
      elements.forEach((item, idx) => {
        if ((!maxPathCounts || maxPathCounts[idx] === undefined) && item.len > maxL) {
          maxL = item.len;
          maxIdx = idx;
        }
      });
      if (maxIdx >= 0) {
        counts[maxIdx] += diff;
      }

      const pts: { x: number; y: number }[] = [];

      elements.forEach((item, idx) => {
        const countForPath = counts[idx] || 0;
        if (countForPath <= 0 || item.len <= 0) return;

        for (let i = 0; i < countForPath; i++) {
          const dist = ((i + 0.5) / countForPath) * item.len;
          const point = item.el.getPointAtLength(dist);

          // Center and normalize to [-0.68, 0.68]
          const cx = viewBox.width / 2;
          const cy = viewBox.height / 2;
          const maxDim = Math.max(viewBox.width, viewBox.height) / 2;

          const nx = ((point.x - cx) / maxDim) * 0.70;
          const ny = ((point.y - cy) / maxDim) * 0.70;
          pts.push({ x: Number(nx.toFixed(4)), y: Number(ny.toFixed(4)) });
        }
      });

      document.body.removeChild(svg);
      return pts;
    };

    // 1. FORMA: MONEDAS (Slim, razor-sharp Dollar signs with zero clumping, paths 1, 9, 24 capped to 16 points)
    const mPoints = sampleSvgPaths(COIN_SVG.paths, COUNT, COIN_SVG.viewBox, {
      maxPathCounts: { 1: 16, 9: 16, 24: 16 }
    });

    // 2. FORMA: GRÁFICO CON FLECHA EN SUBIDA (Exact vector paths from graph-chart-2-svgrepo-com.svg)
    const gPoints = sampleSvgPaths(GRAPH_SVG.paths, COUNT, GRAPH_SVG.viewBox);

    // 3. FORMA: UN COHETE (Aerodynamic rocket fuselage, dual cockpit portholes, wings, nozzle, attached plasma flame)
    const rk = createSampler(0.022);
    rk.line(0, -0.78, -0.25, -0.35); // Nosecone
    rk.line(0, -0.78, 0.25, -0.35);
    rk.line(-0.25, -0.35, -0.25, 0.25); // Fuselage
    rk.line(0.25, -0.35, 0.25, 0.25);
    rk.line(-0.18, -0.35, -0.18, 0.25);
    rk.line(0.18, -0.35, 0.18, 0.25);
    rk.line(-0.25, -0.35, 0.25, -0.35);
    rk.line(-0.25, 0.25, 0.25, 0.25);
    rk.circle(0, -0.12, 0.11); // Cockpit porthole
    rk.circle(0, -0.12, 0.06);
    rk.circle(0, 0.08, 0.08); // 2nd porthole
    // Boosters
    rk.line(-0.25, -0.05, -0.42, 0.22);
    rk.line(-0.42, 0.22, -0.42, 0.32);
    rk.line(-0.42, 0.32, -0.25, 0.28);
    rk.line(0.25, -0.05, 0.42, 0.22);
    rk.line(0.42, 0.22, 0.42, 0.32);
    rk.line(0.42, 0.32, 0.25, 0.28);
    // Wings
    rk.line(-0.25, 0.08, -0.58, 0.36);
    rk.line(-0.58, 0.36, -0.25, 0.28);
    rk.line(0.25, 0.08, 0.58, 0.36);
    rk.line(0.58, 0.36, 0.25, 0.28);
    // Engine nozzle
    rk.line(-0.16, 0.25, -0.20, 0.35);
    rk.line(0.16, 0.25, 0.20, 0.35);
    rk.line(-0.20, 0.35, 0.20, 0.35);
    // Attached propulsion flames
    rk.line(0, 0.35, -0.14, 0.52);
    rk.line(-0.14, 0.52, 0, 0.78);
    rk.line(0, 0.78, 0.14, 0.52);
    rk.line(0.14, 0.52, 0, 0.35);
    rk.line(-0.10, 0.35, -0.24, 0.60);
    rk.line(-0.24, 0.60, -0.08, 0.48);
    rk.line(0.10, 0.35, 0.24, 0.60);
    rk.line(0.24, 0.60, 0.08, 0.48);

    // 4. FORMA: EDIFICIOS (Exact vector paths from skyscraper-town-svgrepo-com.svg)
    const edPoints = sampleSvgPaths(BUILDINGS_SVG.paths, COUNT, BUILDINGS_SVG.viewBox);

    // 5. FORMA: UN BOMBILLO (Clean, completely closed lightbulb: spherical glass dome, threaded screw base, and tungsten filament)
    const bm = createSampler(0.021);
    // Upper glass dome (curving completely over top from left neck junction to right neck junction)
    bm.arc(0, -0.15, 0.44, Math.PI * 0.78, Math.PI * 2.22);
    bm.arc(0, -0.15, 0.40, Math.PI * 0.78, Math.PI * 2.22);

    // Inward neck curves connecting dome to screw base
    bm.line(-0.34, 0.12, -0.18, 0.28);
    bm.line(-0.30, 0.12, -0.15, 0.28);
    bm.line(0.34, 0.12, 0.18, 0.28);
    bm.line(0.30, 0.12, 0.15, 0.28);

    // Threaded screw base ribs
    bm.line(-0.18, 0.28, 0.18, 0.28);
    bm.line(-0.175, 0.34, 0.175, 0.34);
    bm.line(-0.17, 0.40, 0.17, 0.40);
    bm.line(-0.165, 0.46, 0.165, 0.46);
    bm.line(-0.15, 0.52, 0.15, 0.52);
    bm.line(-0.18, 0.28, -0.15, 0.52);
    bm.line(0.18, 0.28, 0.15, 0.52);

    // Bottom electrical contact
    bm.arc(0, 0.52, 0.10, 0, Math.PI);
    bm.arc(0, 0.52, 0.05, 0, Math.PI);

    // Internal tungsten filament support leads and stem
    bm.line(-0.06, 0.28, -0.06, 0.05);
    bm.line(0.06, 0.28, 0.06, 0.05);
    bm.line(-0.06, 0.05, 0.06, 0.05);
    bm.line(-0.06, 0.05, -0.14, -0.15);
    bm.line(0.06, 0.05, 0.14, -0.15);

    // Filament tungsten coils and loops (100% self-contained inside the glass bulb)
    bm.line(-0.14, -0.15, -0.08, -0.30);
    bm.line(-0.08, -0.30, 0, -0.22);
    bm.line(0, -0.22, 0.08, -0.30);
    bm.line(0.08, -0.30, 0.14, -0.15);
    bm.circle(0, -0.22, 0.05);
    bm.circle(-0.08, -0.30, 0.04);
    bm.circle(0.08, -0.30, 0.04);

    // 6. FORMA: UN DIAMANTE (Exact vector paths from diamond-svgrepo-com.svg)
    const dmPoints = sampleSvgPaths(DIAMOND_SVG.paths, COUNT, DIAMOND_SVG.viewBox);

    return [
      { id: 'moneda', name: 'Monedas', points: sortAngularly(mPoints) },
      { id: 'grafico', name: 'Gráfico con Flecha en Subida', points: sortAngularly(gPoints) },
      { id: 'cohete', name: 'Un Cohete', points: sortAngularly(sampleToCount(rk.pts, COUNT)) },
      { id: 'edificio', name: 'Edificios Detallados', points: sortAngularly(edPoints) },
      { id: 'bombillo', name: 'Un Bombillo', points: sortAngularly(sampleToCount(bm.pts, COUNT)) },
      { id: 'diamante', name: 'Un Diamante', points: sortAngularly(dmPoints) }
    ];
  };

  // Canvas Layout Center
  const getLayoutCenter = (w: number, h: number) => {
    const isDesktop = w > 960;
    const centerX = isDesktop ? w * 0.68 : w * 0.5;
    const centerY = isDesktop ? h * 0.5 : h * 0.60;
    const scale = Math.min(isDesktop ? w * 0.30 : w * 0.44, h * 0.40);
    return { centerX, centerY, scale };
  };

  // Initialize Particles (100% assigned to shapes, 0 stray floating particles)
  const initSimulation = (w: number, h: number, initialShape: ShapeDefinition) => {
    const pts = initialShape.points;
    const { centerX, centerY, scale } = getLayoutCenter(w, h);
    const particles: BinaryParticle[] = [];

    for (let i = 0; i < pts.length; i++) {
      const tx = centerX + pts[i].x * scale;
      const ty = centerY + pts[i].y * scale;
      const angle = Math.atan2(pts[i].y, pts[i].x);
      const colorScheme = getColorForAngle(angle);

      particles.push({
        id: i,
        char: (i % 2 === 0 ? '1' : '0'),
        x: tx,
        y: ty,
        fromX: tx,
        fromY: ty,
        toX: tx,
        toY: ty,
        swirlDir: (i % 2 === 0 ? 1 : -1),
        curveDir: (i % 3 === 0 ? 1 : -1),
        curveHeight: 5 + (i % 3) * 2, // Minimal, tight curvature
        color: colorScheme.hex,
        glowColor: colorScheme.glow,
        coreColor: colorScheme.core,
        size: Math.random() * 2 + 10,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
        wobbleOffset: Math.random() * Math.PI * 2
      });
    }

    stateRef.current.particles = particles;
  };

  // Resize Listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const shapes = generateShapes();
    stateRef.current.shapes = shapes;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      stateRef.current.dimensions = { width: rect.width, height: rect.height };

      if (stateRef.current.particles.length === 0) {
        initSimulation(rect.width, rect.height, shapes[stateRef.current.currentShapeIndex]);
      } else {
        const { centerX, centerY, scale } = getLayoutCenter(rect.width, rect.height);
        const currentShape = shapes[stateRef.current.currentShapeIndex];
        stateRef.current.particles.forEach((p, i) => {
          const pt = currentShape.points[i % currentShape.points.length];
          p.toX = centerX + pt.x * scale;
          p.toY = centerY + pt.y * scale;
          p.fromX = p.x;
          p.fromY = p.y;
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (now: number) => {
      const dt = Math.min((now - stateRef.current.lastTime) / 1000, 0.1);
      stateRef.current.lastTime = now;

      const { width: w, height: h } = stateRef.current.dimensions;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Subtle Background Grid
      drawBinaryGridBackground(ctx, w, h);

      const shapes = stateRef.current.shapes;
      const particles = stateRef.current.particles;
      const { centerX, centerY, scale } = getLayoutCenter(w, h);

      const cycleDur = stateRef.current.cycleDuration; // 5.0s
      const transDur = stateRef.current.transitionDuration; // 1.8s

      if (shapes.length > 0) {
        stateRef.current.timer += dt;

        // When 5 seconds elapse: begin TIGHT AMALGAMA transition into next shape
        if (stateRef.current.timer >= cycleDur) {
          stateRef.current.timer = 0;
          const nextIdx = (stateRef.current.currentShapeIndex + 1) % shapes.length;
          stateRef.current.currentShapeIndex = nextIdx;

          const nextShape = shapes[nextIdx];
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const pt = nextShape.points[i % nextShape.points.length];
            p.fromX = p.x;
            p.fromY = p.y;
            p.toX = centerX + pt.x * scale;
            p.toY = centerY + pt.y * scale;

            const angle = Math.atan2(pt.y, pt.x);
            const cs = getColorForAngle(angle);
            p.color = cs.hex;
            p.glowColor = cs.glow;
            p.coreColor = cs.core;
          }
        }
      }

      const t = stateRef.current.timer;
      const mouse = stateRef.current.mouse;
      const count = particles.length;

      // TIGHT AMALGAMA INTERPOLATION (Small contained radius, zero wild explosion)
      for (let i = 0; i < count; i++) {
        const p = particles[i];

        if (t < transDur) {
          // --- AMALGAMA METAMORPHOSIS ---
          // Phase 1: Swirl & Condense into tight center core (0.0s to 0.75s)
          // Phase 2: Unfold smoothly directly into next shape (0.75s to 1.8s)
          const rx = p.fromX - centerX;
          const ry = p.fromY - centerY;
          const r0 = Math.hypot(rx, ry);
          const theta0 = Math.atan2(ry, rx);

          // =========================================================================
          // CONTROL DE TAMAÑO DE EXPLOSIÓN Y AMALGAMA (MODIFICA AQUÍ):
          // - AMALGAM_SHRINK (Línea ~522): Qué tanto se contraen al centro (0.74 = núcleo al 26% del tamaño).
          //   Aumentar (ej. 0.85) = amalgama más pequeña/densa. Reducir (ej. 0.50) = amalgama más abierta.
          // - EXPLOSION_ARC_PX (Línea ~545): Radio/amplitud de la explosión en píxeles.
          //   Actualmente 8px (suave/pequeño). Cambia a 30, 50 o 80 para una explosión más grande.
          //   O cámbialo a 0 para vuelo directo en línea recta sin dispersión hacia afuera.
          // =========================================================================
          const AMALGAM_SHRINK = 0.84; // Contracción al núcleo central (1.0 - 0.74 = 0.26)
          const EXPLOSION_ARC_PX = 20;  // Radio máximo de arco/explosión hacia afuera (en px)

          if (t <= 0.75) {
            const p1 = t / 0.75;
            const ease1 = p1 * p1; // Inward pull
            const swirlAngle = theta0 + p.swirlDir * (0.75 * ease1);
            const targetR = r0 * (1.0 - AMALGAM_SHRINK * ease1); // Se contrae hacia el centro

            p.x = centerX + Math.cos(swirlAngle) * targetR;
            p.y = centerY + Math.sin(swirlAngle) * targetR;

            if (Math.random() < 0.04) {
              p.char = p.char === '1' ? '0' : '1';
            }
          } else {
            // Uncoil directly from the compact amalgam into next shape
            const coreRadius = r0 * (1.0 - AMALGAM_SHRINK);
            const amalgamX = centerX + Math.cos(theta0 + p.swirlDir * 0.75) * coreRadius;
            const amalgamY = centerY + Math.sin(theta0 + p.swirlDir * 0.75) * coreRadius;

            const p2 = (t - 0.75) / 1.05;
            const ease2 = p2 < 0.5
              ? 4 * p2 * p2 * p2
              : 1 - Math.pow(-2 * p2 + 2, 3) / 2;

            const dx = p.toX - amalgamX;
            const dy = p.toY - amalgamY;
            const dist = Math.hypot(dx, dy);
            const nx = -dy / (dist || 1);
            const ny = dx / (dist || 1);

            // CONTROL DE RADIO DE EXPLOSIÓN / DESPLAZAMIENTO LATERAL
            const arc = Math.sin(p2 * Math.PI) * Math.min(dist * 0.06, EXPLOSION_ARC_PX) * p.curveDir;

            p.x = amalgamX + dx * ease2 + nx * arc;
            p.y = amalgamY + dy * ease2 + ny * arc;

            if (Math.random() < 0.03) {
              p.char = p.char === '1' ? '0' : '1';
            }
          }
        } else {
          // --- FORMED SHAPE CRYSTALLIZED HOLD (1.8s to 5.0s) ---
          const breath = Math.sin(now * p.wobbleSpeed * 0.08 + p.wobbleOffset) * 1.5;
          p.x = p.toX + Math.cos(p.wobbleOffset) * breath;
          p.y = p.toY + Math.sin(p.wobbleOffset) * breath;
        }

        // Mouse repulsion
        if (mouse.isHovering) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 70 && dist > 0) {
            const push = (70 - dist) / 70;
            p.x += (mdx / dist) * push * 6;
            p.y += (mdy / dist) * push * 6;
          }
        }
      }

      // (Pure binary particles without constellation cross-lines for maximum clarity)

      // Render Radiant Luminous Particles (Colorverse aesthetic)
      ctx.font = `600 11px "JetBrains Mono", Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Pass 1: Luminous Glow Halos
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();
      }
      ctx.restore();

      // Pass 2: Sharp Binary Digit Glyphs with Colorverse Tint
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        ctx.fillStyle = p.coreColor;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);



  const drawBinaryGridBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
    ctx.lineWidth = 1;

    const step = 60;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true
    };
  };

  const handleMouseLeave = () => {
    stateRef.current.mouse.isHovering = false;
  };

  const handleClick = () => {
    // Immediate smooth transition into next shape on user click
    if (stateRef.current.shapes.length > 0 && stateRef.current.timer >= stateRef.current.transitionDuration) {
      stateRef.current.timer = stateRef.current.cycleDuration;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="binary-fullscreen-background"
    />
  );
};

export default DataPipelineCanvas;