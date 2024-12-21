"use client";

import React, { useState } from "react";
import "./TradeComponent.css";
import Image from "next/image";

export default function TradeComponent() {
  const [amount, setAmount] = useState<string>("0.00");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleQuickSelect = (value: string) => {
    setAmount(value);
  };

  const resetAmount = () => {
    setAmount("0.00");
  };

  const placeTrade = () => {
    alert(`Trade placed for ${amount} HSK`);
  };

  return (
    <div className="trade-container">
      {/* Buy/Sell Buttons */}
      <div className="trade-header">
        <div className="trade-actions">
          <button className="buy-button">Buy</button>
          <button className="sell-button">Sell</button>
        </div>
      </div>

      {/* Switch and Slippage */}
      <div className="trade-options">
        <button className="switch-button">Switch to JEET</button>
        <button className="slippage-button" type="button">
          Set Max Slippage
        </button>
      </div>

      {/* Amount Input */}
      <div className="trade-amount">
        <span className="amount-label">Amount (HSK)</span>
      </div>
      <div className="input-container">
        <input
          className="amount-input"
          id="amount"
          placeholder="0.00"
          inputMode="decimal"
          type="text"
          value={amount}
          onChange={handleAmountChange}
        />
        <div className="currency-indicator">
          <span className="currency-label">HSK</span>
          <Image
            alt="HSK"
            className="currency-icon"
            src="/hskicon.svg"
            width={400}
            height={400}
          />
        </div>
      </div>

      {/* Quick Amount Selection */}
      <div className="quick-select">
        <button className="reset-button" onClick={resetAmount}>
          Reset
        </button>
        <button onClick={() => handleQuickSelect("0.1")}>0.1 HSK</button>
        <button onClick={() => handleQuickSelect("0.5")}>0.5 HSK</button>
        <button onClick={() => handleQuickSelect("1")}>1 HSK</button>
      </div>

      {/* Place Trade */}
      <div className="place-trade">
        <button className="trade-button" onClick={placeTrade}>
          Place Trade
        </button>
      </div>
    </div>
  );
}
