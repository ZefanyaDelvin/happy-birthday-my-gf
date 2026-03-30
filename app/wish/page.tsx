"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image: "/images/1.jpg",
    title: "Make a Wish!",
    body: "Semoga di tahun ini semua impian dan harapanmu terwujud.",
  },
  {
    image: "/images/2.jpg",
    title: "Bloom & Shine",
    body: "Semoga kamu dan aku terus tumbuh, berkembang, dan bersinar bersama di umur ini.",
  },
  {
    image: "/images/3.jpg",
    title: "You're a Gift!",
    body: "Semoga kamu selalu ingat kalau kamu itu hadiah terindah yang pernah aku dapat, dan aku bersyukur setiap hari untuk itu.",
  },
  {
    image: "/images/4.jpg",
    title: "I Love you so much sayangku cintaku sengku",
    body: "I wish that every day feels as special as today, because you deserve all the happiness in the world. Happy birthday, my love! 💖",
  },
];

function Petals() {
  const petals = Array.from({ length: 18 });
  const colors = [
    "#ffb3d1",
    "#ffd6e7",
    "#f9a8d4",
    "#e879f9",
    "#c084fc",
    "#fb923c",
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {petals.map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${(i * 43 + 7) % 100}%`;
        const delay = `${(i * 0.31) % 4}s`;
        const duration = `${4 + (i % 4) * 0.7}s`;
        const size = 8 + (i % 4) * 4;
        return (
          <div
            key={i}
            className="absolute opacity-60"
            style={{
              left,
              top: "-8%",
              width: size,
              height: size * 0.6,
              background: color,
              borderRadius: "50% 0 50% 0",
              animation: `petalFall ${duration} ${delay} linear infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Wish() {
  const [phase, setPhase] = useState<"idle" | "opening" | "risen" | "reading">(
    "idle",
  );
  const [current, setCurrent] = useState(0);
  const [slideDir, setSlideDir] = useState<"right" | "left">("right");
  const [sliding, setSliding] = useState(false);

  const openEnvelope = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => setPhase("risen"), 1100);
    setTimeout(() => setPhase("reading"), 1900);
  };

  const goTo = useCallback(
    (idx: number, dir: "left" | "right") => {
      if (sliding || idx === current) return;
      setSlideDir(dir);
      setSliding(true);
      setCurrent(idx);
      setTimeout(() => {
        setSliding(false);
      }, 400);
    },
    [sliding, current],
  );

  const prev = () =>
    goTo((current - 1 + slides.length) % slides.length, "left");
  const next = () => goTo((current + 1) % slides.length, "right");

  useEffect(() => {
    if (phase !== "reading") return;
    const t = setInterval(() => next(), 4200);
    return () => clearInterval(t);
  }, [phase, current, sliding]);

  const slide = slides[current];
  const isOpen =
    phase === "opening" || phase === "risen" || phase === "reading";

  const closeEnvelope = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setPhase("idle");
      setCurrent(0);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Raleway:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        @keyframes petalFall {
          0%   { transform: translateY(-5%) rotate(0deg) translateX(0); opacity:0.7; }
          50%  { transform: translateY(50vh) rotate(180deg) translateX(18px); opacity:0.5; }
          100% { transform: translateY(105vh) rotate(360deg) translateX(-10px); opacity:0; }
        }
        @keyframes wiggle {
          0%,100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          20%      { transform: translateX(-50%) translateY(-6px) rotate(-2deg); }
          50%      { transform: translateX(-50%) translateY(-8px) rotate(2deg); }
          80%      { transform: translateX(-50%) translateY(-4px) rotate(-1deg); }
        }
        @keyframes lidFlip {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-180deg); }
        }
        @keyframes letterRise {
          0%   { transform: translateX(-50%) translateY(0px) scale(0.95); opacity:0.3; }
          60%  { opacity:1; }
          100% { transform: translateX(-50%) translateY(-180px) scale(1); opacity:1; }
        }
        @keyframes cardReveal {
          0%   { opacity:0; transform: translateX(-50%) scale(0.85) translateY(30px); }
          100% { opacity:1; transform: translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideRight {
          from { opacity:0; transform:translateX(48px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideLeft {
          from { opacity:0; transform:translateX(-48px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes sealPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(244,63,94,0.5); transform: translate(-50%,-50%) scale(1); }
          50%      { box-shadow: 0 0 0 8px rgba(244,63,94,0); transform: translate(-50%,-50%) scale(1.08); }
        }
        @keyframes imgFloat {
          0%,100% { transform:scale(1) translateY(0); }
          50%      { transform:scale(1.03) translateY(-3px); }
        }
        @keyframes tapHint {
          0%,100% { opacity:0.5; transform:translateY(0); }
          50%      { opacity:1; transform:translateY(-3px); }
        }

        .env-idle    { cursor: pointer; }
        .env-idle:hover { animation: wiggle 0.7s ease; }
        .lid-flip    { animation: lidFlip 0.75s cubic-bezier(.4,0,.2,1) forwards; transform-origin: top center; }
        .letter-rise { animation: letterRise 0.9s 0.35s cubic-bezier(.4,0,.2,1) forwards; }
        .card-reveal { animation: cardReveal 0.55s cubic-bezier(.4,0,.2,1) both; }
        .slide-right { animation: slideRight 0.35s cubic-bezier(.4,0,.2,1) both; }
        .slide-left  { animation: slideLeft  0.35s cubic-bezier(.4,0,.2,1) both; }
        .seal-pulse  { animation: sealPulse 1.8s ease-in-out infinite; }
        .img-float   { animation: imgFloat 3s ease-in-out infinite; }
        .tap-hint    { animation: tapHint 1.8s ease-in-out infinite; }
      `}</style>

      <div
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        onClick={closeEnvelope}
        style={{
          background:
            "linear-gradient(145deg, #fdf2f8 0%, #fce7f3 45%, #ede9fe 100%)",
          fontFamily: "'Raleway', sans-serif",
        }}
      >
        <Petals />

        <div
          className="absolute top-[-100px] left-[-100px] w-72 h-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "#f9a8d4" }}
        />
        <div
          className="absolute bottom-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#a78bfa" }}
        />

        <div
          className="relative z-10 flex flex-col items-center"
          style={{ gap: 0 }}
        >
          {/* Header */}
          <div
            className="text-center mb-6"
            style={{ animation: "fadeInUp 0.8s ease both" }}
          >
            <p className="text-rose-400 text-xs tracking-[0.35em] uppercase font-light mb-1">
              ✦ a letter for ✦
            </p>
            <h1
              className="text-5xl font-semibold text-rose-700"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "-0.01em",
              }}
            >
              Evana 💌
            </h1>
          </div>

          {/* SCENE WRAPPER */}
          <div
            style={{
              position: "relative",
              width: 300,
              height: phase === "reading" ? 540 : 320,
            }}
          >
            {/* LETTER CARD (rises then expands) */}
            {(phase === "opening" || phase === "risen") && (
              <div
                className="absolute left-1/2 letter-rise z-20 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 px-7 py-8"
                style={{
                  transform: "translateX(-50%)",
                  bottom: "38%",
                  width: 260,
                  background: "linear-gradient(160deg,#fff9fb,#fff0f6)",
                  border: "1.5px solid #fce7f3",
                  minHeight: 130,
                  pointerEvents: "none",
                }}
              >
                <div className="text-4xl">💌</div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#be185d",
                    fontSize: 15,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  Your letter is ready…
                </p>
              </div>
            )}

            {/* FULL CARD (reading phase) */}
            {phase === "reading" && (
              <div
                className="card-reveal absolute z-30"
                style={{
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 288,
                }}
              >
                <div
                  className="rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(165deg,#fff9fb 0%,#fdf4ff 100%)",
                    border: "1.5px solid #f9a8d4",
                  }}
                >
                  {/* Card header */}
                  <div
                    className="text-center py-3 px-5"
                    style={{
                      borderBottom: "1px dashed #fce7f3",
                      background:
                        "linear-gradient(90deg,#fff0f6,#fdf4ff,#fff0f6)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#9d174d",
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                      }}
                    >
                      ✦ Happy Birthday ✦
                    </p>
                  </div>

                  {/* Slide */}
                  <div
                    key={current}
                    className={`flex flex-col items-center text-center gap-2 px-6 pt-5 pb-4 ${sliding ? (slideDir === "right" ? "slide-right" : "slide-left") : ""}`}
                  >
                    {/* Image replacing emoji */}
                    <div
                      className="img-float rounded-xl overflow-hidden"
                      style={{
                        width: 110,
                        height: 110,
                        flexShrink: 0,
                        border: "2px solid #fce7f3",
                        boxShadow: "0 4px 16px rgba(244,114,182,0.2)",
                      }}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <h2
                      className="mt-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#831843",
                        fontSize: 27,
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {slide.title}
                    </h2>
                    <p
                      style={{
                        color: "#9d174d",
                        fontSize: 13.5,
                        lineHeight: 1.75,
                        fontWeight: 300,
                        maxWidth: 220,
                      }}
                    >
                      {slide.body}
                    </p>
                  </div>

                  {/* Dots & arrows */}
                  <div className="flex items-center justify-between px-5 pb-4 pt-2">
                    <button
                      onClick={prev}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 transition-all text-rose-400 hover:text-rose-600 cursor-pointer"
                      style={{ fontSize: 22, lineHeight: 1 }}
                    >
                      ‹
                    </button>
                    <div className="flex gap-1.5 items-center">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            goTo(i, i > current ? "right" : "left")
                          }
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === current ? 20 : 7,
                            height: 7,
                            background: i === current ? "#f43f5e" : "#fda4af",
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={next}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-50 transition-all text-rose-400 hover:text-rose-600 cursor-pointer"
                      style={{ fontSize: 22, lineHeight: 1 }}
                    >
                      ›
                    </button>
                  </div>

                  {/* Signature */}
                  <div
                    className="px-5 pb-5 text-center"
                    style={{ borderTop: "1px dashed #fce7f3", paddingTop: 10 }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#be185d",
                        fontSize: 13,
                        fontStyle: "italic",
                      }}
                    >
                      With all the love in the world 🌸
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ENVELOPE */}
            <div
              className={`absolute bottom-0 left-1/2 z-10 ${phase === "idle" ? "env-idle" : ""}`}
              style={{ width: 300, height: 200, transform: "translateX(-50%)" }}
              onClick={openEnvelope}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(160deg,#fce7f3,#fbcfe8)",
                  border: "2px solid #f9a8d4",
                  boxShadow: "0 20px 60px rgba(244,114,182,0.3)",
                }}
              />
              <svg
                className="absolute bottom-0 left-0"
                width="300"
                height="100"
                viewBox="0 0 300 100"
                style={{ borderRadius: "0 0 16px 16px" }}
              >
                <polygon
                  points="0,0 300,0 150,100"
                  fill="#fda4af"
                  opacity="0.55"
                />
              </svg>
              <svg
                className="absolute top-0 left-0"
                width="150"
                height="200"
                viewBox="0 0 150 200"
              >
                <polygon
                  points="0,0 150,100 0,200"
                  fill="#f9a8d4"
                  opacity="0.35"
                />
              </svg>
              <svg
                className="absolute top-0 right-0"
                width="150"
                height="200"
                viewBox="0 0 150 200"
              >
                <polygon
                  points="150,0 0,100 150,200"
                  fill="#f9a8d4"
                  opacity="0.35"
                />
              </svg>
              <div
                className={`absolute top-0 left-0 right-0 z-20 ${isOpen ? "lid-flip" : ""}`}
                style={{
                  height: 115,
                  transformOrigin: "top center",
                  perspective: 800,
                }}
              >
                <svg width="300" height="115" viewBox="0 0 300 115">
                  <polygon points="0,0 300,0 150,115" fill="#f472b6" />
                  <polygon points="0,0 300,0 150,115" fill="url(#lidGrad)" />
                  <defs>
                    <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {phase === "idle" && (
                <div
                  className="seal-pulse absolute z-30 flex items-center justify-center rounded-full"
                  style={{
                    width: 50,
                    height: 50,
                    top: "46%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    background:
                      "radial-gradient(circle at 35% 35%,#fb7185,#9f1239)",
                    border: "2.5px solid #fda4af",
                    fontSize: 22,
                    boxShadow: "0 4px 16px rgba(244,63,94,0.5)",
                  }}
                >
                  💋
                </div>
              )}
            </div>
          </div>

          {phase === "idle" && (
            <p className="tap-hint mt-4 text-rose-400 text-xs tracking-widest uppercase">
              tap to open ✦
            </p>
          )}
        </div>
      </div>
    </>
  );
}
