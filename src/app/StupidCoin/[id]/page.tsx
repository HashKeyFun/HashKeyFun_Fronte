"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Payment from "../../../views/StupidCoin/Components/Payment";
import "./pgaecss.css";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HashKeyExchange() {
  const [wallet, setWallet] = useState<number>(1000); // 사용자의 초기 지갑 금액
  const [owned, setOwned] = useState<number>(0); // 보유한 HashKey Coin 개수
  const [price, setPrice] = useState<number>(100); // HashKey Coin의 현재 가격
  const [priceHistory, setPriceHistory] = useState<number[]>([]); // 가격 변동 기록

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}:5000/token/all`)
      .then((res) => {
        setPrice(parseFloat(res.data));
        console.log(res.data);
      });
  }, [price]);

  // 가격 변동 및 기록 관리
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prevPrice) =>
        Math.max(1, prevPrice + Math.floor(Math.random() * 20 - 10))
      ); // 가격 변동 범위: ±10
      setPriceHistory((prevHistory) => [...prevHistory.slice(-19), price]); // 최대 20개의 기록 유지
    }, 2000);

    return () => clearInterval(interval);
  }, [price]);

  // 구매 함수
  const buyCoin = () => {
    if (wallet >= price) {
      setWallet(wallet - price);
      setOwned(owned + 1);
    } else {
      alert("Not enough funds!");
    }
  };

  // 판매 함수
  const sellCoin = () => {
    if (owned > 0) {
      setWallet(wallet + price);
      setOwned(owned - 1);
    } else {
      alert("You don't own any HashKey Coin!");
    }
  };

  return (
    <div className="hashkey-exchange">
      <header className="header">
        <h1 className="title">🚀 HashKey Coin Exchange</h1>
        <p className="subtitle">Your Wallet: ${wallet.toFixed(2)}</p>
      </header>

      <main className="main-content">
        {/* 왼쪽: 차트 */}
        <section className="chart-section">
          <h3>HashKey Coin Price Chart</h3>
          <Line
            data={{
              labels: Array(priceHistory.length).fill(""),
              datasets: [
                {
                  label: "Price",
                  data: priceHistory,
                  borderColor: "rgba(54, 162, 235, 1)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { display: false },
              },
            }}
          />
        </section>

        {/* 오른쪽: 거래 인터페이스 */}
        <section className="trade-section">
          <Payment />
        </section>
      </main>
    </div>
  );
}
