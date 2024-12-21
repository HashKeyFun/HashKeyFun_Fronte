"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 훅
import "./pgaecss.css";
import axios from "axios";

const coins = [
  { name: "HashKey Gold", image: "/vercel.svg", price: "12.34" },
  { name: "HashKey Silver", image: "/vercel.svg", price: "7.89" },
  { name: "HashKey Bronze", image: "/vercel.svg", price: "3.21" },
  { name: "MemeMaster", image: "/vercel.svg", price: "69.99" },
  { name: "RugPull X", image: "/vercel.svg", price: "0.01" },
];

export default function Exchange() {
  const router = useRouter(); // useRouter 훅 초기화
  const [prices, setPrices] = useState<number[]>(coins.map(() => 0));
  const [mimCoin, setMimCoin] = useState<string[]>([]);
  const [priceChanges, setPriceChanges] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}:5000/token/all`)
      .then((res) => {
        setMimCoin(res.data);
        console.log(res.data);
      });
  }, []);

  useEffect(() => {
    const updatePrices = () => {
      setPrices((prevPrices) =>
        prevPrices.map((price) => price + (Math.random() * 2 - 1))
      );

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
          {coins.map((coin, index) => (
            <div
              key={index}
              className="coin-item"
              onClick={() => router.push(`/StupidCoin/${coin.name}`)} // 리다이렉션 구현
            >
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
        </section>
      </main>
    </div>
  );
}
