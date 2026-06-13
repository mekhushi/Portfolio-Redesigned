import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export const CursorFollower: React.FC = () => {
  const [text, setText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });
  
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const ringX = useRef(-100);
  const ringY = useRef(-100);

  useEffect(() => {
    if (isTouch) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      if (dotRef.current) {
        gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
      }

      // Check if hovering an interactive item or custom text
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest("a, button, [data-cursor-text], .audio-wave-toggle");
      if (hoverTarget) {
        setIsHovered(true);
        const cursorText = hoverTarget.getAttribute("data-cursor-text");
        setText(cursorText);
      } else {
        setIsHovered(false);
        setText(null);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Render loop for trailing ring
    let animFrame: number;
    const updateRing = () => {
      const ease = 0.15;
      ringX.current += (mouseX.current - ringX.current) * ease;
      ringY.current += (mouseY.current - ringY.current) * ease;

      if (ringRef.current) {
        gsap.set(ringRef.current, { x: ringX.current, y: ringY.current });
      }
      if (labelRef.current) {
        gsap.set(labelRef.current, { x: ringX.current + 18, y: ringY.current + 18 });
      }

      animFrame = requestAnimationFrame(updateRing);
    };

    updateRing();

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, [isTouch]);

  // Animate cursor states on hover
  useEffect(() => {
    if (isTouch) return;
    if (isHovered) {
      // Expand ring and glow green
      gsap.to(ringRef.current, {
        width: 32,
        height: 32,
        borderColor: "rgba(125, 212, 147, 0.85)", // Accent green color
        backgroundColor: "rgba(125, 212, 147, 0.06)",
        duration: 0.25,
        ease: "power2.out"
      });
      gsap.to(dotRef.current, {
        scale: 1.5,
        backgroundColor: "#7dd493",
        duration: 0.25
      });
    } else {
      // Reset ring
      gsap.to(ringRef.current, {
        width: 18,
        height: 18,
        borderColor: "rgba(255, 255, 255, 0.35)",
        backgroundColor: "rgba(255, 255, 255, 0)",
        duration: 0.25,
        ease: "power2.out"
      });
      gsap.to(dotRef.current, {
        scale: 1,
        backgroundColor: "#ffffff",
        duration: 0.25
      });
    }
  }, [isHovered, isTouch]);

  // Animate text label visibility
  useEffect(() => {
    if (isTouch) return;
    if (text) {
      gsap.to(labelRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out"
      });
    } else {
      gsap.to(labelRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in"
      });
    }
  }, [text, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Target pointer dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          zIndex: 999999,
          pointerEvents: "none",
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
        }}
      />
      {/* Trailing circle ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "18px",
          height: "18px",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "50%",
          zIndex: 999998,
          pointerEvents: "none",
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
        }}
      />
      {/* Floating text label */}
      <div
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 999997,
          display: "flex",
          padding: "4px 8px 5px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          fontFamily: "'Space Mono', monospace, monospace",
          textTransform: "uppercase",
          fontSize: "10px",
          color: "#ffffff",
          pointerEvents: "none",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
          opacity: 0,
          transformOrigin: "center center",
          letterSpacing: "1px",
        }}
      >
        <span
          style={{
            width: "2px",
            height: "2px",
            backgroundColor: "#ffffff",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        {text}
      </div>
    </>
  );
};
