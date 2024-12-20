"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./pgaecss.css";

const coins = [
  { name: "HashKey Gold", image: "/vercel.svg", price: "12.34" },
  { name: "HashKey Silver", image: "/vercel.svg", price: "7.89" },
  { name: "HashKey Bronze", image: "/vercel.svg", price: "3.21" },
  { name: "MemeMaster", image: "/vercel.svg", price: "69.99" },
  { name: "RugPull X", image: "/vercel.svg", price: "0.01" },
];

export default function Exchange() {
  const [prices, setPrices] = useState<number[]>(coins.map(() => 0));
  const [priceChanges, setPriceChanges] = useState<string[]>([]);
  const [cursorURL, setCursorURL] = useState<string>("");

  const handleMouseEnter = (url: string) => {
    setCursorURL(url);
  };

  const handleMouseLeave = () => {
    setCursorURL("");
  };

  useEffect(() => {
    const updatePrices = () => {
      setPrices((prevPrices) =>
        prevPrices.map((price) => price + (Math.random() * 2 - 1))
      );

      // Set random ↑ or ↓ for each price
      setPriceChanges(coins.map(() => (Math.random() > 0.5 ? "↑" : "↓")));
    };

    const interval = setInterval(updatePrices, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header className="header">
        <h1 className="title">✨ HashKey MemeCoin Exchange ✨</h1>
        <p className="subtitle">"Trade memes, make dreams"</p>
      </header>

      <main>
        <section className="exchange">
          {[...Array(5)].map((_, outerIndex) => (
            <div key={outerIndex} className="coin-list">
              {coins.map((coin, index) => (
                <div
                  key={index}
                  className="coin-item"
                  onMouseEnter={() => handleMouseEnter(coin.image)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => window.open(`/StupidCoin/${coin.name}`)}>
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    className="coin-image"
                    width={100}
                    height={100}
                  />
                  <h3 className="coin-name">{coin.name}</h3>
                  <p className="coin-price">
                    ${prices[index].toFixed(2)}
                    <span className="change">{priceChanges[index]}</span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
