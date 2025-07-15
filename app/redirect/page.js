"use client";
import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function Redirect() {
  useEffect(() => {
    confetti({ origin: { x: 0, y: 0.5 }, particleCount: 50, zIndex: 1, spread: 60, ticks: 500 });
    confetti({ origin: { x: 1, y: 0.5 }, particleCount: 50, zIndex: 1, spread: 60, ticks: 500 });
    confetti({ origin: { x: 0.5, y: 0.5 }, particleCount: 50, zIndex: 1, spread: 60, ticks: 500 });
  }, []);

  return (
    <div>
      <div id="snameyd">
        <Link href="/" className="button">Take me back!</Link>
      </div>
      <div className="push">
        <div className="container">
          <span className="text1">CONGRATULATIONS!</span>
          <span className="text2">you just made your account!</span>
        </div>
      </div>
    </div>
  );
} 