"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/bg.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {
        document.addEventListener("click", () => audio.play(), { once: true });
      });
    };

    tryPlay();

    return () => {
      audio.pause();
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted((m) => !m);
    }
  };

  return (
    <button
      onClick={toggleMute}
      title={muted ? "Unmute" : "Mute"}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        background: "rgba(255,255,255,0.25)",
        border: "1.5px solid rgba(255,255,255,0.4)",
        borderRadius: "50%",
        width: 42,
        height: 42,
        cursor: "pointer",
        fontSize: 20,
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      }}
    >
      {muted ? "🔇" : "🎵"}
    </button>
  );
}