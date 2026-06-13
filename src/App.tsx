import { useState, useEffect, useRef } from "react";
import { CanvasBackground } from "./components/CanvasBackground";
import { CursorFollower } from "./components/CursorFollower";
import { AudioEngine } from "./utils/AudioEngine";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Premium word-by-word reveal component matching matveyan.com text animation
const RevealText: React.FC<{ text: string; className?: string; tag?: "h1" | "h2" | "h3" | "p" }> = ({ 
  text, 
  className = "", 
  tag = "h2" 
}) => {
  const words = text.split(" ");
  const Tag = tag;

  return (
    <Tag className={`${className} reveal-on-scroll`}>
      {words.map((word, i) => (
        <span key={i} className="reveal-word">
          <span 
            className="reveal-inner" 
            style={{ 
              "--delay": `${i * 0.04}s`,
            } as React.CSSProperties}
          >
            {word === "⨯" ? <span className="hero-title span"></span> : word}&nbsp;
          </span>
        </span>
      ))}
    </Tag>
  );
};

// Corner SVGs to insert inside case cards and buttons
const CornerDecorators = () => (
  <>
    <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="topleft">
      <path d="M3 2H5V3H3V5H2V3H0V2H2V0H3V2Z" fill="#D9D9D9"/>
    </svg>
    <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="topright">
      <path d="M3 2H5V3H3V5H2V3H0V2H2V0H3V2Z" fill="#D9D9D9"/>
    </svg>
    <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="bottomleft">
      <path d="M3 2H5V3H3V5H2V3H0V2H2V0H3V2Z" fill="#D9D9D9"/>
    </svg>
    <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="bottomright">
      <path d="M3 2H5V3H3V5H2V3H0V2H2V0H3V2Z" fill="#D9D9D9"/>
    </svg>
  </>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loaderHash, setLoaderHash] = useState("SEC_INIT::[0x0000]");
  const [audioActive, setAudioActive] = useState(false);
  const [scrollPercent, setScrollPercent] = useState("0.000");
  const [time, setTime] = useState(0.0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ping, setPing] = useState(12);
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);

  // Financial prices with flutter
  const [btcPrice, setBtcPrice] = useState(67431.5);
  const [ethPrice, setEthPrice] = useState(3512.4);

  const audioEngineRef = useRef<AudioEngine | null>(null);

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
    return () => {
      audioEngineRef.current?.stop();
    };
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickHandler);
    };
  }, []);

  // Preloader progress bar simulation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const step = Math.floor(Math.random() * 15) + 5;
      current = Math.min(100, current + step);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Fade out the loader content
          gsap.to(".loader-content", {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              // Trigger a cool digital crash glitch shake on the boot loader container
              const tlGlitch = gsap.timeline();
              tlGlitch.to(".boot-loader", { x: 8, y: -4, skewX: 5, duration: 0.05, yoyo: true, repeat: 3 });
              tlGlitch.to(".boot-loader", { x: -8, y: 4, skewX: -5, duration: 0.05, yoyo: true, repeat: 3 });
              tlGlitch.to(".boot-loader", { 
                x: 0, 
                y: 0, 
                skewX: 0, 
                duration: 0.05,
                onComplete: () => {
                  // Stagger-fade out the preloader grid blocks diagonally
                  gsap.to(".loader-block-item", {
                    opacity: 0,
                    duration: 0.6,
                    stagger: {
                      grid: [16, 16],
                      from: "start",
                      amount: 1.2
                    },
                    ease: "power1.inOut",
                    onComplete: () => {
                      setLoading(false);
                    }
                  });
                }
              });
            }
          });
        }, 400);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // GSAP preloader logo bar pulse loop
  useEffect(() => {
    if (!loading) return;
    const pulse = gsap.to(".loader-bar", {
      scaleY: 0.6,
      transformOrigin: "bottom center",
      duration: 0.5,
      stagger: 0.12,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
    return () => {
      pulse.kill();
    };
  }, [loading]);

  // Preloader hex telemetry hash generator
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xFFFFFFFFFFFF).toString(16).toUpperCase().padStart(12, "0");
      const subSys = ["SYS_KERN", "ML_ENGINE", "NET_PROXY", "DATA_ANL", "GPU_COMP", "CV_PIPELN"][Math.floor(Math.random() * 6)];
      setLoaderHash(`${subSys}::[0x${hex}]`);
    }, 80);
    return () => clearInterval(interval);
  }, [loading]);

  // Scroll listener for normalized HUD scroll value
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const pct = window.scrollY / totalScroll;
        setScrollPercent(pct.toFixed(3));
      } else {
        setScrollPercent("0.000");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse coordinate HUD tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Telemetry: Time elapsed since load
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setTime((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);
    return () => clearInterval(interval);
  }, [loading]);

  // Telemetry: Network ping fluctuations & Crypto flutters
  useEffect(() => {
    const interval = setInterval(() => {
      setPing((prev) => Math.max(8, Math.min(22, prev + (Math.random() > 0.5 ? 1 : -1))));
      setBtcPrice((prev) => prev + (Math.random() - 0.5) * 4.0);
      setEthPrice((prev) => prev + (Math.random() - 0.5) * 0.4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP scroll trigger and entrance animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline();
      
      tl.fromTo(".header", 
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      tl.fromTo(".hero-logo-box", 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      );

      tl.fromTo(".hero-title .reveal-inner", 
        { y: "100%", opacity: 0, filter: "blur(4px)" },
        { y: "0%", opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.04, ease: "power3.out" },
        "-=0.6"
      );

      tl.fromTo([".hero-desc", ".hero-section .btn-corner", ".scroll-down"], 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );

      tl.fromTo(".footer-hud",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.8"
      );

      // 2. Scroll-triggered animations for case studies
      const caseItems = gsap.utils.toArray<HTMLElement>(".case-item");
      caseItems.forEach((item) => {
        gsap.fromTo(item, 
          { opacity: 0, y: 50, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // 3. Scroll-triggered reveal elements (like headers in specialize, etc.)
      const revealOnScroll = gsap.utils.toArray<HTMLElement>(".reveal-on-scroll");
      revealOnScroll.forEach((el) => {
        // Skip hero title as it is handled by the entrance animation
        if (el.classList.contains("hero-title")) return;

        const inners = el.querySelectorAll(".reveal-inner");
        if (inners.length > 0) {
          gsap.fromTo(inners, 
            { y: "100%", opacity: 0, filter: "blur(4px)" },
            { 
              y: "0%", 
              opacity: 1, 
              filter: "blur(0px)",
              duration: 0.8,
              stagger: 0.04,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        } else {
          gsap.fromTo(el,
            { y: 30, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      });

      // 4. Specialize section bio & button trigger
      gsap.fromTo(["#specialize .section-bio", "#specialize .btn-corner"],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#specialize",
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      // 5. Resume items staggering column-by-column
      const resumeColumns = gsap.utils.toArray<HTMLElement>(".resume-column");
      resumeColumns.forEach((col) => {
        const title = col.querySelector(".resume-column-title");
        const items = col.querySelectorAll(".resume-item");
        
        const tlCol = gsap.timeline({
          scrollTrigger: {
            trigger: col,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });

        if (title) {
          tlCol.fromTo(title, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 0.65, duration: 0.6, ease: "power2.out" }
          );
        }

        if (items.length > 0) {
          tlCol.fromTo(items, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "-=0.4"
          );
        }
      });

      // 6. Scroll-synced outline text drift and letter spacing expansion
      gsap.fromTo(".parallax-outline-text",
        { x: -160, letterSpacing: "8px", opacity: 0.1 },
        {
          x: 160,
          letterSpacing: "24px",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".outline-footer",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      // 7. Magnetic hover effects for buttons & navigation links
      const magneticElements = gsap.utils.toArray<HTMLElement>(".btn-corner, .nav-link, .btn-resume-project");
      magneticElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          
          gsap.to(el, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: "power2.out"
          });
          
          const corners = el.querySelectorAll("svg.topleft, svg.topright, svg.bottomleft, svg.bottomright");
          if (corners.length > 0) {
            gsap.to(corners, {
              scale: 1.25,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
        
        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)"
          });
          
          const corners = el.querySelectorAll("svg.topleft, svg.topright, svg.bottomleft, svg.bottomright");
          if (corners.length > 0) {
            gsap.to(corners, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
      });

      // 8. Interactive hover animations for case study SVG graphics
      caseItems.forEach((item) => {
        const solidTraj = item.querySelector(".case-traj-solid");
        const targets = item.querySelectorAll(".case-target-1, .case-target-2");
        const boxes = item.querySelectorAll(".case-box-1, .case-box-2");
        const crosshairCircle = item.querySelector(".case-crosshair-circle");
        const crosshairLines = item.querySelector(".case-crosshair-lines");
        const crosshairDiag = item.querySelector(".case-crosshair-diag");
        const mapPins = item.querySelectorAll(".case-map-pin-1, .case-map-pin-2");
        const mapRoute = item.querySelector(".case-map-route");
        const greenLeaf = item.querySelector(".case-green-leaf");
        
        // Prepare initial path lengths for draw animations
        if (solidTraj) {
          const path = solidTraj as SVGPathElement;
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        }
        if (mapRoute) {
          const path = mapRoute as SVGPathElement;
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        }

        item.addEventListener("mouseenter", () => {
          if (solidTraj) {
            const path = solidTraj as SVGPathElement;
            const length = path.getTotalLength();
            gsap.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" });
          }
          if (targets.length > 0) {
            gsap.fromTo(targets, { scale: 0 }, { scale: 1.3, duration: 0.4, stagger: 0.1, ease: "back.out(2)" });
          }
          if (boxes.length > 0) {
            gsap.to(boxes, { scale: 1.1, rotation: 10, transformOrigin: "center center", duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" });
          }
          if (crosshairCircle) {
            gsap.to(crosshairCircle, { rotation: 180, transformOrigin: "center center", duration: 0.8, ease: "power1.out" });
          }
          if (crosshairLines) {
            gsap.to(crosshairLines, { rotation: -90, transformOrigin: "center center", duration: 0.8, ease: "power1.out" });
          }
          if (crosshairDiag) {
            gsap.to(crosshairDiag, { scale: 1.15, transformOrigin: "center center", duration: 0.4, yoyo: true, repeat: 1 });
          }
          if (mapPins.length > 0) {
            gsap.to(mapPins, { y: -5, duration: 0.3, yoyo: true, repeat: 3, ease: "power1.inOut" });
          }
          if (mapRoute) {
            const path = mapRoute as SVGPathElement;
            const length = path.getTotalLength();
            gsap.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" });
          }
          if (greenLeaf) {
            gsap.to(greenLeaf, { scale: 1.15, rotation: 5, transformOrigin: "bottom center", duration: 0.6, ease: "elastic.out(1, 0.5)" });
          }
        });

        item.addEventListener("mouseleave", () => {
          if (solidTraj) {
            const path = solidTraj as SVGPathElement;
            const length = path.getTotalLength();
            gsap.to(path, { strokeDashoffset: length, duration: 0.6, ease: "power2.out" });
          }
          if (boxes.length > 0) {
            gsap.to(boxes, { scale: 1, rotation: 0, duration: 0.5, ease: "power2.out" });
          }
          if (crosshairCircle) {
            gsap.to(crosshairCircle, { rotation: 0, duration: 0.6, ease: "power2.out" });
          }
          if (crosshairLines) {
            gsap.to(crosshairLines, { rotation: 0, duration: 0.6, ease: "power2.out" });
          }
          if (mapRoute) {
            const path = mapRoute as SVGPathElement;
            const length = path.getTotalLength();
            gsap.to(path, { strokeDashoffset: length, duration: 0.6, ease: "power2.out" });
          }
          if (greenLeaf) {
            gsap.to(greenLeaf, { scale: 1, rotation: 0, duration: 0.5, ease: "power2.out" });
          }
        });
    });

    // 9. Logo block hover animation (stagger bars up/down)
    const logoBlock = document.querySelector(".logo-block");
    if (logoBlock) {
      logoBlock.addEventListener("mouseenter", () => {
        gsap.fromTo(".logo-bar", 
          { y: 0 },
          { 
            y: -5, 
            duration: 0.25, 
            stagger: 0.08, 
            yoyo: true, 
            repeat: 1, 
            ease: "power2.out" 
          }
        );
      });
    }

    // 10. Text Scramble hover effect
    const scrambleTargets = gsap.utils.toArray<HTMLElement>(".scramble-target, .btn-corner span, .btn-resume-project span");
    scrambleTargets.forEach((target) => {
      const original = target.innerText;
      let active = false;
      
      target.addEventListener("mouseenter", () => {
        if (active) return;
        active = true;
        
        let count = 0;
        const chars = "10X#$@&%<>?[]/+=";
        const duration = 8; // frames
        const interval = setInterval(() => {
          target.innerText = original
            .split("")
            .map((char, index) => {
              if (char === " " || index < count) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
          
          count += original.length / duration;
          if (count >= original.length) {
            clearInterval(interval);
            target.innerText = original;
            active = false;
          }
        }, 30);
      });
    });
  });

  return () => ctx.revert();
}, [loading]);

  const handleAudioToggle = () => {
    if (audioEngineRef.current) {
      const active = audioEngineRef.current.toggle();
      setAudioActive(active);
    }
  };

  // Background glow mapping
  const getGlowBackground = () => {
    switch (hoveredCase) {
      case "ballistx":
        return "radial-gradient(circle at 70% 50%, rgba(198, 120, 49, 0.22) 0%, transparent 60%)";
      case "bytomic":
        return "radial-gradient(circle at 70% 50%, rgba(49, 198, 120, 0.22) 0%, transparent 60%)";
      case "sign2code":
        return "radial-gradient(circle at 70% 50%, rgba(144, 49, 198, 0.22) 0%, transparent 60%)";
      case "mapinsights":
        return "radial-gradient(circle at 70% 50%, rgba(49, 120, 198, 0.22) 0%, transparent 60%)";
      case "greenai":
        return "radial-gradient(circle at 70% 50%, rgba(198, 198, 49, 0.22) 0%, transparent 60%)";
      default:
        return "none";
    }
  };

  // Generate matrix coordinates for diagonal grid preloader
  const gridBlocks = [];
  const gridSize = 16;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      gridBlocks.push({ row: r, col: c });
    }
  }



  return (
    <>
      {/* 3D Perspective Wave Background */}
      <CanvasBackground />

      {/* Dynamic Background Glow Overlay */}
      <div 
        className={`bg-gradient-overlay ${hoveredCase ? "active" : ""}`}
        style={{ background: getGlowBackground() }}
      />

      {/* Dynamic Cursor Tooltips */}
      <CursorFollower />

      {/* Ambient overlay & CSS Noise */}
      <div className="noise-overlay" />

      {/* Frame Screen HUD lines */}
      <div className="hud-frame">
        <div className="corner-decorator corner-tl" />
        <div className="corner-decorator corner-tr" />
        <div className="corner-decorator corner-bl" />
        <div className="corner-decorator corner-br" />
      </div>

      {/* Loader Sequence & Grid Exit Transition */}
      {loading && (
        <div 
          className="boot-loader" 
          style={{ 
            backgroundColor: "transparent",
          }}
        >
          {/* Diagonal fade out grid */}
          <div className="loader-grid-transition">
            {gridBlocks.map((_, idx) => (
              <div 
                key={idx} 
                className="loader-block-item"
              />
            ))}
          </div>

          {/* Loader content */}
          <div 
            className="loader-content"
            style={{ 
              position: "absolute", 
              zIndex: 9999, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "24px",
            }}
          >
            <svg className="loader-logo" width="49" height="35" viewBox="0 0 49 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="loader-bar loader-bar-1" d="M14 7V35L0 28V0L14 7Z" fill="white" />
              <path className="loader-bar loader-bar-2" d="M31.5 7V35L17.5 28V0L31.5 7Z" fill="white" />
              <path className="loader-bar loader-bar-3" d="M49 7V35L35 28V0L49 7Z" fill="white" />
            </svg>
            <div className="loader-line-container">
              <div className="loader-line-progress" style={{ width: `${progress}%` }} />
            </div>
            <span className="loader-percent">{progress}%</span>
            <div className="loader-hash" style={{ fontFamily: "Space Mono", fontSize: "9px", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "1px" }}>
              {loaderHash}
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <header className="header">
        <div className="logo-block">
          <svg className="header-logo-svg" width="24" height="24" viewBox="0 0 49 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="logo-bar logo-bar-1" d="M14 7V35L0 28V0L14 7Z" fill="white" />
            <path className="logo-bar logo-bar-2" d="M31.5 7V35L17.5 28V0L31.5 7Z" fill="white" />
            <path className="logo-bar logo-bar-3" d="M49 7V35L35 28V0L49 7Z" fill="white" />
          </svg>
          <span className="logo-text scramble-target">Khushi Singh</span>
          
          {/* Audio wave toggle visualizer */}
          <div 
            className={`audio-wave-toggle ${audioActive ? "active" : ""}`} 
            onClick={handleAudioToggle}
            data-cursor-text={audioActive ? "Mute ambient pad" : "Enable sound"}
          >
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <a 
              href="https://github.com/mekhushi" 
              className="nav-link" 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor-text="Open GitHub"
            >
              <span className="scramble-target">GitHub</span> 
              <svg width="6" height="6" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0H0L4 4V0Z" fill="white"/>
              </svg>
            </a>
          </li>
          <li>
            <a 
              href="https://www.linkedin.com/in/khushi-singh-557317284/" 
              className="nav-link" 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor-text="Open LinkedIn"
            >
              <span className="scramble-target">LinkedIn</span>
              <svg width="6" height="6" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0H0L4 4V0Z" fill="white"/>
              </svg>
            </a>
          </li>
          <li>
            <a 
              href="https://orcid.org/0009-0002-7926-0544" 
              className="nav-link" 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor-text="Open ORCID"
            >
              <span className="scramble-target">ORCID</span>
              <svg width="6" height="6" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0H0L4 4V0Z" fill="white"/>
              </svg>
            </a>
          </li>
          <li>
            <a 
              href="mailto:khushisingh8317@gmail.com" 
              className="nav-link"
              data-cursor-text="Send Email"
            >
              <span className="scramble-target">Mail</span>
              <svg width="6" height="6" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0H0L4 4V0Z" fill="white"/>
              </svg>
            </a>
          </li>
        </ul>
      </header>

      {/* Main content wrapper */}
      <main style={{ padding: "0 10px" }}>
        
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-logo-box">
              <svg width="40" height="30" viewBox="0 0 49 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4V20L0 16V0L8 4ZM18 4V20L10 16V0L18 4ZM28 4V20L20 16V0L28 4Z" fill="white" />
              </svg>
            </div>
            {!loading && (
              <RevealText 
                tag="h1" 
                className="hero-title" 
                text="Code ⨯ Systems for intelligence, web & scale" 
              />
            )}
            <p className="hero-desc">
              I design and build immersive, interactive systems, AI-powered developer engines, and high-performance, real-time infrastructure.
            </p>
            <a 
              href="mailto:khushisingh8317@gmail.com" 
              className="btn-corner"
              data-cursor-text="Inquire"
            >
              <span>INITIATE INQUIRY</span>
            </a>
          </div>
          <div className="scroll-down">
            <svg width="12" height="12" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="3.5" width="10" height="15" rx="3.5" stroke="white"/>
              <rect x="9.5" y="6" width="1" height="4" rx="0.5" fill="white"/>
            </svg>
            <span>Scroll down</span>
          </div>
        </section>

        {/* SPECIALIZE SECTION */}
        <section className="section" id="specialize">
          <div className="container">
            <ul className="tags">
              <li className="tag-item">AI SYSTEMS</li>
              <li className="tag-item">FULL STACK</li>
              <li className="tag-item">REAL-TIME INFRA</li>
              <li className="tag-item">MACHINE LEARNING</li>
              <li className="tag-item">CLOUD OPS</li>
            </ul>
            
            <div className="reveal-on-scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 className="section-title">
                <b>I specialize in</b>{" "}
                {/* Embedded High-Fidelity Outline Icons */}
                <svg style={{ verticalAlign: 'middle', display: 'inline-block', margin: '0 6px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M12 4v16M2 12h20" />
                </svg>
                AI systems,{" "}
                <svg style={{ verticalAlign: 'middle', display: 'inline-block', margin: '0 6px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
                web architectures, and{" "}
                <svg style={{ verticalAlign: 'middle', display: 'inline-block', margin: '0 6px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd493" strokeWidth="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                </svg>
                intelligent automation interfaces.
              </h2>
            </div>

            <p className="section-bio">
              I’m currently focused on engineering intelligent machine learning systems, computer vision automation pipelines, and high-performance geospatial data analytics platforms.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <a 
                href="mailto:khushisingh8317@gmail.com" 
                className="btn-corner"
                data-cursor-text="Write me"
              >
                <span>WRITE EMAIL</span>
              </a>
              <a 
                href="https://github.com/mekhushi" 
                className="btn-corner"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="Open github"
              >
                <span>GITHUB PROFILE</span>
              </a>
            </div>
          </div>
        </section>

        {/* SELECTED CASES / PROJECTS */}
        <section className="section" id="cases" style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
          <div className="container">
            <h2 className="section-title">
              <b>Selected cases</b> / Engineering systems & ML
            </h2>
            <ul className="tags">
              <li className="tag-item">Autonomous agents</li>
              <li className="tag-item">Network Proxies</li>
              <li className="tag-item">Model Optimizations</li>
            </ul>

            {/* Premium client/tech logos group */}
            <ul className="logoGroup" style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: '30px 0 60px', justifyContent: 'center' }}>
              <li>
                {/* Python outline */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1 3h2v2h-2V7zm0 4h2v6h-2v-6z" />
                </svg>
              </li>
              <li>
                {/* JS / TS representation */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 8v8M9 11h6" />
                </svg>
              </li>
              <li>
                {/* Go representation */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                  <path d="M16.5 9.4a3 3 0 1 0 0 5.2M7.5 12h6" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </li>
              <li>
                {/* PyTorch representation */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                  <path d="M12 3v18M3 12h18" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </li>
            </ul>

            <div className="case-list">
              
              {/* CASE 1: BALLISTX */}
              <div 
                className="case-item"
                onMouseEnter={() => setHoveredCase("ballistx")}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <div className="case-graphic-mask" data-cursor-text="Open BallistX">
                  <CornerDecorators />
                  <div className="case-visual visual-ballistx">
                    <div className="grid-overlay-decor" />
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                      <path d="M10 90h80M10 10v80" stroke="white" strokeWidth="1" className="case-grid-axis" />
                      <path d="M10 90 Q 45 15, 80 90" stroke="white" strokeWidth="1.5" strokeDasharray="3,1" className="case-traj-dashed" />
                      <path d="M10 90 Q 43 22, 80 90" stroke="#7dd493" strokeWidth="1" className="case-traj-solid" />
                      <circle cx="45" cy="36" r="3" fill="white" className="case-target-1" />
                      <circle cx="43" cy="41" r="3" fill="#7dd493" className="case-target-2" />
                    </svg>
                    <span className="visual-title">BALLISTX.PY</span>
                  </div>
                </div>
                <div className="case-info">
                  <span className="case-index">CASE 01 / PHYSICS ⨯ ML</span>
                  <h3 className="case-title">BallistX Simulator</h3>
                  <span className="case-lang">Python / PyTorch / Streamlit</span>
                  <p className="case-desc">
                    AI-enhanced ballistics simulator combining physics-based modeling with machine learning to predict projectile trajectories. Provides interactive visualizations comparing theoretical paths with neural network predictions in real time.
                  </p>
                  <a href="https://github.com/mekhushi/BallistX-" target="_blank" rel="noopener noreferrer" className="btn-corner" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>
              </div>

              {/* CASE 2: BYTOMIC */}
              <div 
                className="case-item"
                onMouseEnter={() => setHoveredCase("bytomic")}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <div className="case-graphic-mask" data-cursor-text="Open Bytomic">
                  <CornerDecorators />
                  <div className="case-visual visual-bytomic">
                    <div className="grid-overlay-decor" />
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                      <rect x="20" y="25" width="20" height="50" stroke="white" strokeWidth="1" fill="rgba(255,255,255,0.05)" className="case-box-1" />
                      <rect x="60" y="55" width="20" height="20" stroke="#7dd493" strokeWidth="1.5" fill="rgba(125,212,147,0.1)" className="case-box-2" />
                      <path d="M40 50 L 60 65" stroke="white" strokeWidth="1" strokeDasharray="2,2" className="case-link-line" />
                      <text x="23" y="20" fill="white" fontSize="6" fontFamily="Space Mono">FP32</text>
                      <text x="63" y="50" fill="#7dd493" fontSize="6" fontFamily="Space Mono">INT8</text>
                    </svg>
                    <span className="visual-title">BYTOMIC.LIB</span>
                  </div>
                </div>
                <div className="case-info">
                  <span className="case-index">CASE 02 / MODEL OPTIMIZATION</span>
                  <h3 className="case-title">Bytomic Optimizer</h3>
                  <span className="case-lang">Python / PyTorch Quantization</span>
                  <p className="case-desc">
                    Tool for compressing heavy machine learning models into efficient 8-bit & 4-bit versions for edge deployment and optimized resource-limited environments.
                  </p>
                  <a href="https://github.com/mekhushi/Bytomic" target="_blank" rel="noopener noreferrer" className="btn-corner" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>
              </div>

              {/* CASE 3: SIGN2CODE */}
              <div 
                className="case-item"
                onMouseEnter={() => setHoveredCase("sign2code")}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <div className="case-graphic-mask" data-cursor-text="Open Sign2Code">
                  <CornerDecorators />
                  <div className="case-visual visual-sign2code">
                    <div className="grid-overlay-decor" />
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.75" strokeDasharray="4,4" className="case-crosshair-circle" />
                      <path d="M50 30v40M30 50h40" stroke="white" strokeWidth="0.5" className="case-crosshair-lines" />
                      <path d="M38 38l24 24M38 62l24-24" stroke="white" strokeWidth="0.5" className="case-crosshair-diag" />
                      <path d="M50 35c-5 0-5 10 0 10s5-10 0-10Z" stroke="#7dd493" strokeWidth="1.5" fill="rgba(125,212,147,0.1)" className="case-gesture-path" />
                      <text x="50" y="82" fill="white" fontSize="6" fontFamily="Space Mono" textAnchor="middle">&lt;HTML/&gt;</text>
                    </svg>
                    <span className="visual-title">SIGN2CODE.CV</span>
                  </div>
                </div>
                <div className="case-info">
                  <span className="case-index">CASE 03 / COMPUTER VISION</span>
                  <h3 className="case-title">Sign2Code Engine</h3>
                  <span className="case-lang">Python / MediaPipe / OpenCV</span>
                  <p className="case-desc">
                    Enables writing HTML tags using real-time hand gesture recognition detected via a webcam and MediaPipe finger-tracking APIs, making coding highly interactive.
                  </p>
                  <a href="https://github.com/mekhushi/Sign2Code" target="_blank" rel="noopener noreferrer" className="btn-corner" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>
              </div>

              {/* CASE 4: MAPINSIGHTS */}
              <div 
                className="case-item"
                onMouseEnter={() => setHoveredCase("mapinsights")}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <div className="case-graphic-mask" data-cursor-text="Open MapInsights">
                  <CornerDecorators />
                  <div className="case-visual visual-mapinsights">
                    <div className="grid-overlay-decor" />
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1" className="case-map-ring-outer" />
                      <path d="M50 15v70M15 50h70" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" className="case-map-lines" />
                      <path d="M50 25c15 0 25 10 25 25s-10 25-25 25-25-10-25-25 10-25 25-25Z" stroke="white" strokeWidth="0.75" strokeDasharray="2,2" className="case-map-ring-inner" />
                      <circle cx="65" cy="35" r="3" fill="#7dd493" className="case-map-pin-1" />
                      <circle cx="35" cy="65" r="3" fill="#7dd493" className="case-map-pin-2" />
                      <path d="M65 35L50 50L35 65" stroke="#7dd493" strokeWidth="1.2" className="case-map-route" />
                    </svg>
                    <span className="visual-title">MAPINSIGHTS.GEO</span>
                  </div>
                </div>
                <div className="case-info">
                  <span className="case-index">CASE 04 / DATA ANALYTICS</span>
                  <h3 className="case-title">MapInsights Dashboard</h3>
                  <span className="case-lang">Python / Streamlit / Folium</span>
                  <p className="case-desc">
                    Interactive geospatial dashboard for exploring and analyzing datasets through map-based visualizations, filtering, and charts.
                  </p>
                  <a href="https://github.com/mekhushi/MapInsights" target="_blank" rel="noopener noreferrer" className="btn-corner" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>
              </div>

              {/* CASE 5: GREEN-AI-INSIGHTS */}
              <div 
                className="case-item"
                onMouseEnter={() => setHoveredCase("greenai")}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <div className="case-graphic-mask" data-cursor-text="Open GreenAI">
                  <CornerDecorators />
                  <div className="case-visual visual-greenai">
                    <div className="grid-overlay-decor" />
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                      <path d="M20 80 Q 50 10, 80 80" stroke="white" strokeWidth="1" className="case-green-dome" />
                      <path d="M50 20 C65 35, 65 65, 50 80 C35 65, 35 35, 50 20 Z" stroke="#7dd493" strokeWidth="1.5" fill="rgba(125,212,147,0.1)" className="case-green-leaf" />
                      <line x1="50" y1="20" x2="50" y2="80" stroke="#7dd493" strokeWidth="1" className="case-green-vein" />
                    </svg>
                    <span className="visual-title">GREENAI.DASH</span>
                  </div>
                </div>
                <div className="case-info">
                  <span className="case-index">CASE 05 / GREEN SOFTWARE</span>
                  <h3 className="case-title">Green AI Insights</h3>
                  <span className="case-lang">Python / ML Eco Analytics</span>
                  <p className="case-desc">
                    Interactive dashboard analyzing AI training experiments’ performance and carbon footprint to promote sustainable machine learning practices.
                  </p>
                  <a href="https://github.com/mekhushi/Green-AI-Insights" target="_blank" rel="noopener noreferrer" className="btn-corner" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* RESUME THREE-COLUMN SECTION */}
        <section className="resume-section">
          <div className="container">
            <div className="resume-grid-container">
              
              {/* COLUMN 1: EXPERIENCE & EDUCATION */}
              <div className="resume-column">
                <RevealText tag="h3" className="resume-column-title" text="EXPERIENCE & EDUCATION" />
                
                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.05s" }}>
                  <span className="resume-item-index">01</span>
                  <span className="resume-item-meta">July 2025 – Aug 2025 · CANTILEVER</span>
                  <h4 className="resume-item-title">Data Analyst Intern (Remote)</h4>
                  <p className="resume-item-desc">
                    Trained and optimized machine learning models, improving accuracy by 12%. Designed data preprocessing and feature engineering pipelines, and executed cross-validation on real-world datasets.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.1s" }}>
                  <span className="resume-item-index">02</span>
                  <span className="resume-item-meta">Sep 2023 – June 2027 · AKTU UNIVERSITY</span>
                  <h4 className="resume-item-title">Bachelor of Technology (CS & IT)</h4>
                  <p className="resume-item-desc">
                    Focusing on core computer science and information technology principles, data structures, algorithms, and machine learning architectures.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.15s" }}>
                  <span className="resume-item-index">03</span>
                  <span className="resume-item-meta">2023 · DAV CENTENARY PUBLIC SCHOOL</span>
                  <h4 className="resume-item-title">Senior Secondary Graduate</h4>
                  <p className="resume-item-desc">
                    Completed secondary education under the Science stream with a strong focus on mathematics, physics, and analytical thinking.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.2s" }}>
                  <span className="resume-item-index">04</span>
                  <span className="resume-item-meta">OPEN SOURCE & ALGORITHMS</span>
                  <h4 className="resume-item-title">Achievements & Contributions</h4>
                  <p className="resume-item-desc">
                    Solved 300+ problems on LeetCode (strengthening DSA skills) and maintained 20+ public repositories showcasing machine learning, deep learning, and web development projects.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.25s" }}>
                  <span className="resume-item-index">05</span>
                  <span className="resume-item-meta">RECOGNITIONS & CERTIFICATIONS</span>
                  <h4 className="resume-item-title">Accreditations & Techathons</h4>
                  <p className="resume-item-desc">
                    Qualified Round 1 of the national EY Techathon 5.0 (Problem Solving & Front-End) and completed Harvard's CS50x (Algorithms, C, Web Dev, Python, SQL) in July 2025.
                  </p>
                </div>
              </div>

              {/* COLUMN 2: SKILLS SUMMARY */}
              <div className="resume-column">
                <RevealText tag="h3" className="resume-column-title" text="SKILLS" />
                
                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.05s" }}>
                  <span className="resume-item-index">01</span>
                  <span className="resume-item-meta">Languages</span>
                  <h4 className="resume-item-title">Core Syntax</h4>
                  <p className="resume-item-desc">
                    Python, C++, SQL, C. Proficient in designing scalable system APIs, numeric simulation scripts, and model training pipelines.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.1s" }}>
                  <span className="resume-item-index">02</span>
                  <span className="resume-item-meta">Frameworks</span>
                  <h4 className="resume-item-title">Intelligent Engines</h4>
                  <p className="resume-item-desc">
                    PyTorch, TensorFlow, Keras, Scikit-learn, Django, Streamlit, Plotly, Pandas. Skilled in deploying and optimizing neural networks and data dashboards.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.15s" }}>
                  <span className="resume-item-index">03</span>
                  <span className="resume-item-meta">Tools</span>
                  <h4 className="resume-item-title">Developer & Tech Toolkit</h4>
                  <p className="resume-item-desc">
                    Git, GitHub, Docker, Power BI, MySQL, REST APIs. Experienced in version control, containerized pipelines, relational databases, and data analysis.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.2s" }}>
                  <span className="resume-item-index">04</span>
                  <span className="resume-item-meta">Platforms</span>
                  <h4 className="resume-item-title">Systems & Environments</h4>
                  <p className="resume-item-desc">
                    Linux, Web, Windows. Familiar with Unix environments, deployment servers, and web optimization practices.
                  </p>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.25s" }}>
                  <span className="resume-item-index">05</span>
                  <span className="resume-item-meta">Soft Skills</span>
                  <h4 className="resume-item-title">Collaboration & Methodologies</h4>
                  <p className="resume-item-desc">
                    Leadership, Event Management, Public Speaking, Time Management, Teamwork, Analytical Thinking. Confident in driving developer collaborations and meeting constraints.
                  </p>
                </div>
              </div>

              {/* COLUMN 3: PERSONAL PROJECTS */}
              <div className="resume-column">
                <RevealText tag="h3" className="resume-column-title" text="PERSONAL PROJECTS" />
                
                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.05s" }}>
                  <span className="resume-item-index">01</span>
                  <div className="resume-project-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 22h20M2 22Q12 4 22 22" />
                      <circle cx="12" cy="13" r="2" fill="white" />
                    </svg>
                  </div>
                  <h4 className="resume-item-title">BallistiX Simulator & Research</h4>
                  <p className="resume-item-desc">
                    AI-enhanced ballistics simulator combining physics-based modeling with ML to predict projectile trajectories. Backed by a research paper focusing on physics-informed neural networks.
                  </p>
                  <a href="https://github.com/mekhushi/BallistX-" target="_blank" rel="noopener noreferrer" className="btn-resume-project" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.1s" }}>
                  <span className="resume-item-index">02</span>
                  <div className="resume-project-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="4" rx="1" />
                      <path d="M7 9v6M17 9v6" />
                      <rect x="5" y="15" width="14" height="4" rx="1" />
                    </svg>
                  </div>
                  <h4 className="resume-item-title">Bytomic Model Optimizer</h4>
                  <p className="resume-item-desc">
                    Tool for compressing heavy AI models into efficient 8-bit and 4-bit versions for edge deployment and optimized resource-limited environments.
                  </p>
                  <a href="https://github.com/mekhushi/Bytomic" target="_blank" rel="noopener noreferrer" className="btn-resume-project" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.15s" }}>
                  <span className="resume-item-index">03</span>
                  <div className="resume-project-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v10M8 4v8M16 3v9M20 6v6M4 9c0-2.5 4-2.5 4 1v3c0 4 3 6 7 6s6-3 6-6V9" />
                    </svg>
                  </div>
                  <h4 className="resume-item-title">Sign2Code Engine</h4>
                  <p className="resume-item-desc">
                    Enables writing HTML tags using real-time hand gesture recognition detected via a webcam and MediaPipe finger-tracking APIs.
                  </p>
                  <a href="https://github.com/mekhushi/Sign2Code" target="_blank" rel="noopener noreferrer" className="btn-resume-project" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.2s" }}>
                  <span className="resume-item-index">04</span>
                  <div className="resume-project-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h4 className="resume-item-title">MapInsights Dashboard</h4>
                  <p className="resume-item-desc">
                    Interactive geospatial dashboard for exploring and analyzing datasets through map-based visualizations, filtering, and charts.
                  </p>
                  <a href="https://github.com/mekhushi/MapInsights" target="_blank" rel="noopener noreferrer" className="btn-resume-project" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>

                <div className="resume-item reveal-on-scroll" style={{ transitionDelay: "0.25s" }}>
                  <span className="resume-item-index">05</span>
                  <div className="resume-project-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 21 3c-1 4.5-2 6.5-3.1 12.2A7 7 0 0 1 11 20Z" />
                      <path d="M9 11v8M13 15v4" />
                    </svg>
                  </div>
                  <h4 className="resume-item-title">Green AI Insights</h4>
                  <p className="resume-item-desc">
                    Interactive dashboard analyzing AI training experiments' performance and carbon footprint to promote sustainable machine learning practices.
                  </p>
                  <a href="https://github.com/mekhushi/Green-AI-Insights" target="_blank" rel="noopener noreferrer" className="btn-resume-project" data-cursor-text="View source">
                    <span>VIEW SOURCE</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* OUTLINE TEXT SECTION */}
        <section className="outline-footer">
          <svg className="outline-text-svg" viewBox="0 0 800 150">
            <text 
              className="parallax-outline-text"
              x="50%" 
              y="70%" 
              textAnchor="middle" 
              fontSize="130" 
              fontWeight="900"
            >
              KHUSHI
            </text>
          </svg>
        </section>

      </main>

      {/* FOOTER HUD */}
      <footer className="footer-hud">
        <div className="footer-hud-left">
          <img 
            className="hud-avatar" 
            src="https://avatars.githubusercontent.com/u/145558409?v=4" 
            alt="Khushi Singh" 
          />
          <p className="hud-quote">I build high-performance systems and intelligent AI solutions.</p>
        </div>

        <div className="footer-hud-tickers">
          <div className="ticker-card">
            {/* BTC icon prefix */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12M9 9h6M9 15h6" />
            </svg>
            <span className="ticker-label">BTC</span>
            <span className="ticker-price">${btcPrice.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span>
            <span className="ticker-change up">
              <svg width="6" height="8" viewBox="0 0 8 12" fill="none" style={{ marginRight: '2px' }}>
                <path d="M6 8H2L4 5.5L6 8Z" fill="#7dd493"/>
              </svg>
              +0.21%
            </span>
          </div>

          <div className="ticker-card">
            {/* ETH icon prefix */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '2px' }}>
              <path d="M12 2L4 12l8 10 8-10zM12 2v20" />
            </svg>
            <span className="ticker-label">ETH</span>
            <span className="ticker-price">${ethPrice.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span>
            <span className="ticker-change up">
              <svg width="6" height="8" viewBox="0 0 8 12" fill="none" style={{ marginRight: '2px' }}>
                <path d="M6 8H2L4 5.5L6 8Z" fill="#7dd493"/>
              </svg>
              +0.38%
            </span>
          </div>

          <div className="ticker-card">
            <span className="ticker-label">PING</span>
            <span className="ticker-price">{ping}ms</span>
            <span className="ticker-change up" style={{ color: '#7dd493', display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#7dd493', borderRadius: '50%', marginRight: '6px' }} className="pulse-anim" />
              ACTIVE
            </span>
          </div>
        </div>

        <div className="footer-hud-right">
          <div className="hud-column">
            <div className="hud-row">
              <span>CURSOR X:</span>
              <span className="hud-val">{mousePos.x}</span>
            </div>
            <div className="hud-row">
              <span>CURSOR Y:</span>
              <span className="hud-val">{mousePos.y}</span>
            </div>
          </div>
          <div className="hud-column">
            <div className="hud-row">
              <span>SCROLL:</span>
              <span className="hud-val">{scrollPercent}</span>
            </div>
            <div className="hud-row">
              <span>TIME:</span>
              <span className="hud-val">{time}s</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
