import React, { useEffect, useRef } from "react";

export const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
    }
    const particles: Particle[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      // Spawn 1-2 digital green pixel dust particles
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2 + 1.2,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.3,
          alpha: 0.85,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Grid spacing & configurations
    const gridSpacing = 48;
    const focalLength = 300;

    const draw = () => {
      timeRef.current += 0.5;

      // Dark background clear
      ctx.fillStyle = "#090909";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse lerp
      const mouse = mouseRef.current;
      if (mouse.x === -9999) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      // Calculate grid columns/rows dynamically
      const cols = Math.ceil(width / gridSpacing) + 2;
      const rows = Math.ceil(height / gridSpacing) + 2;
      
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw grid lines (horizontal and vertical wireframe)
      ctx.lineWidth = 0.5;
      
      // Store 3D projected points
      const points: { x: number; y: number; alpha: number }[][] = [];

      for (let c = -1; c < cols; c++) {
        points[c + 1] = [];
        for (let r = -1; r < rows; r++) {
          const origX = c * gridSpacing;
          const origY = r * gridSpacing;

          // Wave distortion around mouse
          const dx = mouse.x - origX;
          const dy = mouse.y - origY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let z = 0;
          const maxDist = 300;
          
          if (dist < maxDist) {
            const factor = (maxDist - dist) / maxDist;
            // Ripple wave based on time and distance
            z = Math.sin(dist * 0.05 - timeRef.current * 0.08) * 24 * factor;
          }

          // Slow ambient wave
          z += Math.sin(origX * 0.01 + timeRef.current * 0.02) * Math.cos(origY * 0.01 + timeRef.current * 0.02) * 5;

          // 3D Perspective projection
          const scale = focalLength / (focalLength + z);
          const projX = centerX + (origX - centerX) * scale;
          const projY = centerY + (origY - centerY) * scale;

          // Fade out grid elements that are far from the screen center or mouse
          const centerDist = Math.sqrt((projX - centerX) ** 2 + (projY - centerY) ** 2);
          
          // Highlights grid near the mouse cursor (bloom effect)
          const mouseDist = Math.sqrt((projX - mouse.x) ** 2 + (projY - mouse.y) ** 2);
          let mouseHighlight = 0;
          if (mouseDist < 250) {
            mouseHighlight = ((250 - mouseDist) / 250) * 0.16;
          }
          const alpha = Math.max(0.06, 0.26 - (centerDist / (width + height)) * 0.25) + mouseHighlight;

          points[c + 1][r + 1] = { x: projX, y: projY, alpha };
        }
      }

      // Draw lines connecting the points
      for (let c = 0; c < points.length; c++) {
        for (let r = 0; r < points[c].length; r++) {
          const p = points[c][r];

          // Draw vertical line link
          if (c < points.length - 1) {
            const rightP = points[c + 1][r];
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(p.alpha, rightP.alpha) * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(rightP.x, rightP.y);
            ctx.stroke();
          }

          // Draw horizontal line link
          if (r < points[c].length - 1) {
            const downP = points[c][r + 1];
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(p.alpha, downP.alpha) * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(downP.x, downP.y);
            ctx.stroke();
          }

          // Draw small intersections dots
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 1.5})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw digital green pixel dust cursor trail
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= pt.decay;
        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(125, 212, 147, ${pt.alpha * 0.8})`; // digital green #7dd493
        ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};
