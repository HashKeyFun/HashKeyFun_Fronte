"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../globals.css";

export default function Topbar() {
  const [account, setAccount] = useState<string | null>(null);

  // 페이지가 처음 로드될 때 로컬 스토리지에서 계정 정보를 불러오기
  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  // Metamask 연결 함수
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const selectedAccount = accounts[0];
        setAccount(selectedAccount);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Metamask가 설치되지 않았습니다. Metamask를 설치해주세요.");
    }
  };

  return (
    <div className="marquee">
      <span>🚨 Warning: This site is 100% real 🚨</span>
      <div className="move">
        <h1>Metamask connect</h1>
        {!account ? (
          <button onClick={connectWallet}>Wallet connection</button>
        ) : (
          <p>
            linked account
            {account}
          </p>
        )}
      </div>
    </div>
  );
}
