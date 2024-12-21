"use client";
import React, { useEffect, useRef } from "react";

export default function Home() {
  const imageRef = useRef<HTMLImageElement>(null); // Ref에 타입 지정

  useEffect(() => {
    const rotateImage = () => {
      if (imageRef.current) {
        const randomAngle = Math.random() * 360;
        imageRef.current.style.transform = `rotate(${randomAngle}deg)`;
      }
      setTimeout(rotateImage, 100);
    };
    rotateImage();
  }, []);

  return (
    <div>
      <header className="header">
        <h1 className="title">🌕 HashKey MemeCoin 🚀</h1>
        <p className="subtitle">
          "The most meaningless yet lovable coin in the universe"
        </p>
      </header>

      <main>
        <section className="hero">
          <img
            ref={imageRef}
            src="/brand-black-logo1.png"
            alt="HashKey Mascot"
            className="hero-img"
            width={1000}
            height={500}
          />
          <h2>Buy now, laugh or cry later, or regret forever!</h2>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/market")}>
            🚀 Take me to HashKey!
          </button>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/smart_guy")}>
            🚀 Do you think someone like you can create a meme coin?
          </button>
        </section>

        <section className="features">
          <h2 className="section-title">Why Choose HashKey MemeCoin?</h2>
          <div className="feature-list">
            <div className="feature-item">
              <img src="https://placebear.com/100/100" alt="Feature 1" />
              <h3>Absolutely Trustworthy</h3>
              <p>Our founder’s words: "Trust me, bro."</p>
            </div>
            <div className="feature-item">
              <img src="https://placebeard.it/100/100" alt="Feature 2" />
              <h3>Guaranteed Moonshot</h3>
              <p>*Disclaimer: Moonshots may vary.</p>
            </div>
            <div className="feature-item">
              <img src="https://baconmockup.com/100/100" alt="Feature 3" />
              <h3>Memes are Life</h3>
              <p>Buy HashKey MemeCoin, gain infinite laughs!</p>
            </div>
          </div>
        </section>

        <section className="roadmap">
          <h2>HashKey MemeCoin Roadmap</h2>
          <ul>
            <li>📈 Phase 1: Hype Train Boarding</li>
            <li>🐸 Phase 2: Memes Take Over the World</li>
            <li>🌑 Phase 3: Rug Pull (just kidding... or are we?)</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
