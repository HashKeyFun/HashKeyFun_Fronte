"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./pgaecss.css";
import { ethers } from "ethers";
import TokenFactoryABI from "../../TokenFactory.json";

// Coin interface for structured data
interface Coin {
  request_id: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  isApproved: number;
  contract_address?: string;
}

export default function MemeCoinManagement() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [isPurchaseVisible, setIsPurchaseVisible] = useState<boolean>(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  const TokenFactoryAddress = "0xb6Ead7E52EF0ae4225e2CF63F63669E2e6325286";

  // Fetch coins
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:5000/token/all`
        );
        const data = await response.json();
        const userCoins = data.filter(
          (coin: Coin) => coin.creator?.toLowerCase() === account?.toLowerCase()
        );
        console.log("User coins:", userCoins);
        setCoins(userCoins);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    if (account) {
      fetchCoins();
    }
  }, [account]);

  // Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  // Approve & Issue Token
  const issueToken = async (request_id: string, amount: number) => {
    if (!account) {
      alert("Please connect to MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenFactory = new ethers.Contract(
        TokenFactoryAddress,
        TokenFactoryABI,
        signer
      );
      console.log("Token Factory:", tokenFactory);

      // Convert amount to Wei (Ether to Wei conversion)
      const value = ethers.parseUnits(amount.toString(), "ether");

      // Call issueToken with the required parameters
      const tx = await tokenFactory.issueToken(request_id);
      await tx.wait();

      alert("Token issued successfully.");
    } catch (error) {
      console.error("Error issuing token:", error);
      alert("Failed to issue the token.");
    }
  };

  // Handle purchase modal
  const handlePurchase = (request_id: string) => {
    setCurrentRequestId(request_id);
    setIsPurchaseVisible(true);
  };

  const handleCloseModal = () => {
    setIsPurchaseVisible(false);
    setPurchaseAmount(null);
    setCurrentRequestId(null);
  };

  const handleBuy = async () => {
    if (!account || !purchaseAmount || !currentRequestId) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      await issueToken(currentRequestId, purchaseAmount); // Issue token with the specified amount
      handleCloseModal(); // Close the modal after successful purchase
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">🌟 Meme Coin Management 🌟</h1>
        <p className="subtitle">"Manage and approve your coins effortlessly"</p>
        {!account ? (
          <button className="connect-wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p>Connected account: {account}</p>
        )}
      </header>

      <main>
        <section className="coin-list">
          <h2>Your Coins</h2>
          {coins.length > 0 ? (
            <ul>
              {coins.map((coin) => (
                <li key={coin.request_id} className="coin-item">
                  <Image
                    src={coin.image || "/default.png"}
                    alt={coin.description || "No Description"}
                    width={100}
                    height={100}
                  />
                  <div className="coin-info">
                    <p>
                      <strong>Request ID:</strong> {coin.request_id}
                    </p>
                    <p>
                      <strong>Description:</strong> {coin.description}
                    </p>
                    <p>
                      <strong>Creator:</strong> {coin.creator}
                    </p>
                    <p>
                      <strong>Created At:</strong> {coin.createdAt}
                    </p>
                    <p>
                      <strong>Updated At:</strong> {coin.updatedAt}
                    </p>
                    <p>
                      <strong>Approval Status:</strong>{" "}
                      {coin.isApproved ? "Approved" : "Pending"}
                    </p>
                  </div>
                  <button
                    className="cta-button"
                    onClick={() => handlePurchase(coin.request_id)}>
                    Approve & Buy
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No coins found.</p>
          )}
        </section>

        {isPurchaseVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="modal-close" onClick={handleCloseModal}>
                ✖
              </button>
              <h2 className="modal-title">Purchase HSK</h2>
              <div className="form-group">
                <label htmlFor="purchase">
                  How many HSK do you want to buy?
                </label>
                <input
                  type="number"
                  id="purchase"
                  placeholder="Enter amount"
                  value={purchaseAmount || ""}
                  onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                />
              </div>
              <button className="cta-button" onClick={handleBuy}>
                Confirm Purchase & Approve
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
