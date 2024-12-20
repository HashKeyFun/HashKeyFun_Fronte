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
import "./pgaecss.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const coins = [
  { id: 1, name: "MemeCoin Gold", price: 100 },
  { id: 2, name: "MemeCoin Silver", price: 50 },
  { id: 3, name: "MemeCoin Bronze", price: 25 },
];

export default function Exchange() {
  const [wallet, setWallet] = useState<number>(1000);
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({});
  const [prices, setPrices] = useState<number[]>(
    coins.map((coin) => coin.price)
  );
  const [priceHistory, setPriceHistory] = useState<number[][]>(
    coins.map(() => [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prevPrices) => {
        const updatedPrices = prevPrices.map((price) =>
          Math.max(1, price + Math.floor(Math.random() * 20 - 10))
        );
        setPriceHistory(
          (prevHistory) =>
            prevHistory.map((history, index) => [
              ...history.slice(-19),
              updatedPrices[index],
            ]) // 최대 20개 데이터 유지
        );
        return updatedPrices;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const buyCoin = (coinId: number, coinPrice: number) => {
    if (wallet >= coinPrice) {
      setWallet(wallet - coinPrice);
      setPortfolio((prevPortfolio) => ({
        ...prevPortfolio,
        [coinId]: (prevPortfolio[coinId] || 0) + 1,
      }));
    } else {
      alert("Not enough funds!");
    }
  };

  const sellCoin = (coinId: number, coinPrice: number) => {
    if (portfolio[coinId] > 0) {
      setWallet(wallet + coinPrice);
      setPortfolio((prevPortfolio) => ({
        ...prevPortfolio,
        [coinId]: prevPortfolio[coinId] - 1,
      }));
    } else {
      alert("You don't own this coin!");
    }
  };

  return (
    <div className="exchange">
      <header className="header">
        <h1 className="title">🚀 MemeCoin Trading Platform</h1>
        <p className="subtitle">Your Wallet: ${wallet.toFixed(2)}</p>
      </header>

      <main className="main-content">
        {/* 왼쪽: 차트 */}
        <section className="chart-section">
          {coins.map((coin, index) => (
            <div key={coin.id} className="chart-item">
              <h3>{coin.name} Price Chart</h3>
              <Line
                data={{
                  labels: Array(priceHistory[index]?.length || 0).fill(""),
                  datasets: [
                    {
                      label: `${coin.name} Price`,
                      data: priceHistory[index],
                      borderColor: "rgba(255, 99, 132, 1)",
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
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
            </div>
          ))}
        </section>

        {/* 오른쪽: 거래 인터페이스 */}
        <section className="trade-section">
          <div className="coin-list">
            {coins.map((coin, index) => (
              <div key={coin.id} className="coin-item">
                <h3>{coin.name}</h3>
                <p>Price: ${prices[index]}</p>
                <p>Owned: {portfolio[coin.id] || 0}</p>
                <button
                  className="buy-button"
                  onClick={() => buyCoin(coin.id, prices[index])}>
                  Buy
                </button>
                <button
                  className="sell-button"
                  onClick={() => sellCoin(coin.id, prices[index])}>
                  Sell
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
