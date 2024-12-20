"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState(null);

  // Metamask 연결 함수
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Metamask가 설치되지 않았습니다. Metamask를 설치해주세요.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Metamask 연결하기</h1>
      {!account ? (
        <button
          onClick={connectWallet}
          style={{ padding: "10px 20px", fontSize: "16px" }}>
          지갑 연결
        </button>
      ) : (
        <p>연결된 계정: {account}</p>
      )}
    </div>
  );
}
