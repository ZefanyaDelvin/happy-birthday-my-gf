"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "heart" | "star";
  speedX: number;
  speedY: number;
  opacity: number;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  wobble: number;
  wobbleSpeed: number;
}

const COLORS = [
  "#FF6B9D",
  "#FF8C42",
  "#FFD166",
  "#06D6A0",
  "#118AB2",
  "#9B5DE5",
  "#F15BB5",
  "#00BBF9",
  "#00F5D4",
  "#FEE440",
];

const BALLOON_COLORS = [
  "#FF6B9D",
  "#FFD166",
  "#06D6A0",
  "#9B5DE5",
  "#118AB2",
  "#F15BB5",
  "#FF8C42",
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export default function Hello() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);

  useEffect(() => {
    const initBalloons: Balloon[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      y: randomBetween(20, 110),
      size: randomBetween(18, 38),
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      speedX: randomBetween(-0.015, 0.015),
      speedY: randomBetween(-0.025, -0.01),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: randomBetween(0.01, 0.03),
    }));
    const initParticles: Particle[] = Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      y: randomBetween(0, 100),
      size: randomBetween(5, 13),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: (["circle", "heart", "star"] as const)[
        Math.floor(Math.random() * 3)
      ],
      speedX: randomBetween(-0.01, 0.01),
      speedY: randomBetween(0.02, 0.07),
      opacity: randomBetween(0.6, 1),
    }));
    particlesRef.current = initParticles;
    balloonsRef.current = initBalloons;
    setParticles([...initParticles]);
    setBalloons([...initBalloons]);
  }, []);

  useEffect(() => {
    const animate = () => {
      particlesRef.current = particlesRef.current.map((p) => {
        let y = p.y + p.speedY;
        let x = p.x + p.speedX;
        if (y > 105) y = -5;
        if (x > 105) x = -5;
        if (x < -5) x = 105;
        return { ...p, x, y };
      });
      balloonsRef.current = balloonsRef.current.map((b) => {
        let y = b.y + b.speedY;
        let x = b.x + b.speedX + Math.sin(b.wobble) * 0.02;
        const wobble = b.wobble + b.wobbleSpeed;
        if (y < -15) y = 110;
        if (x > 110) x = -10;
        if (x < -10) x = 110;
        return { ...b, x, y, wobble };
      });
      setParticles([...particlesRef.current]);
      setBalloons([...balloonsRef.current]);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const renderShape = (p: Particle) => {
    const baseStyle = { left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity };
    if (p.shape === "circle") {
      return (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            ...baseStyle,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
        />
      );
    }
    return (
      <div
        key={p.id}
        className="absolute pointer-events-none leading-none select-none"
        style={{ ...baseStyle, fontSize: p.size + 4, color: p.color }}
      >
        {p.shape === "heart" ? "♥" : "★"}
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #ffb3c1 0%, #ff8fab 40%, #ffb3c1 100%)",
        fontFamily: "'Baloo 2', cursive",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700;800&display=swap');
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(180,0,130,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(180,0,130,0); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .bday-card { animation: float-card 3.5s ease-in-out infinite, pop-in 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .bday-btn { animation: pulse-btn 1.8s ease-in-out infinite; }
        .bday-btn:hover { transform: scale(1.07); filter: brightness(0.88); }
        .bday-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Floating balloons */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute pointer-events-none z-[1]"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
        >
          <div
            className="relative"
            style={{
              width: b.size,
              height: b.size * 1.25,
              borderRadius: "50% 50% 48% 48% / 55% 55% 45% 45%",
              background: `radial-gradient(circle at 35% 35%, ${b.color}cc, ${b.color})`,
              boxShadow: `inset -3px -3px 6px rgba(0,0,0,0.13), inset 3px 3px 6px rgba(255,255,255,0.35)`,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                top: "18%",
                left: "22%",
                width: "28%",
                height: "18%",
                background: "rgba(255,255,255,0.55)",
                transform: "rotate(-20deg)",
              }}
            />
          </div>
          <div
            className="mx-auto"
            style={{
              width: 1.5,
              height: b.size * 0.7,
              background: "rgba(0,0,0,0.18)",
            }}
          />
        </div>
      ))}

      {/* Confetti & hearts */}
      {particles.map(renderShape)}

      {/* Card */}
      <div
        className="bday-card relative z-10 rounded-3xl px-16 py-14 text-center max-w-lg w-full mx-4 backdrop-blur-md border border-white/50 shadow-2xl"
        style={{ background: "rgba(255,200,215,0.72)" }}
      >
        <h1
          className="font-extrabold leading-tight m-0"
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: "clamp(2rem, 6vw, 3rem)",
            color: "#e8006a",
          }}
        >
          Hello, Sayangku!
        </h1>
        <p className="text-xl text-white mb-8">Happy Birthday yang ke 22 🎉</p>

        <Link href={"/wish"}>
          <button
            className="bday-btn text-white font-bold rounded-full px-11 py-3.5 text-lg cursor-pointer border-none transition-transform duration-150"
            style={{
              fontFamily: "'Baloo 2', cursive",
              background: "linear-gradient(90deg, #d400a0, #e8439e)",
            }}
          >
            Next ✨
          </button>
        </Link>
      </div>
    </div>
  );
}
