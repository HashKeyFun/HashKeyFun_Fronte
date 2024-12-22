"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { ethers } from "ethers";
import TokenFactory from "../TokenFactory.json";
import "./pagecss.css";

// Coin interface definition
interface Coin {
  request_id: string;
  image: string;
  description: string;
  createdAt: string;
  contract_address?: string;
}

export default function ApprovedCoinsPage() {
  const [pendingCoins, setPendingCoins] = useState<Coin[]>([]); // List of pending coins
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [account, setAccount] = useState<string | null>(null); // MetaMask account

  const contractAddress = "0xb6Ead7E52EF0ae4225e2CF63F63669E2e6325286"; // Replace with the actual contract address

  useEffect(() => {
    const fetchPendingCoins = async () => {
      try {
        // Fetch all tokens from the backend
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}:5000/token/all`
        );
        const allCoins = response.data;

        // Verify `isApproved` state from the blockchain
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenFactory = new ethers.Contract(
          contractAddress,
          TokenFactory,
          signer
        );

        const promises = allCoins.map(async (coin: Coin) => {
          const tokenInfo = await tokenFactory.tokenRequests(coin.request_id);
          if (!tokenInfo.approved) {
            return coin; // Only return coins that are not approved
          }
          return null; // Ignore approved coins
        });

        const filteredCoins = (await Promise.all(promises)).filter(
          (coin) => coin !== null
        ) as Coin[];

        setPendingCoins(filteredCoins); // Store only pending coins
        console.log("Pending coins:", filteredCoins);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCoins();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
    }
  };

  const approveCoin = async (
    request_id: string,
    image: string,
    description: string
  ): Promise<void> => {
    if (!account) {
      alert("Please connect to MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenFactory = new ethers.Contract(
        contractAddress,
        TokenFactory,
        signer
      );

      // Approve the token on the blockchain
      const tx = await tokenFactory.approveToken(request_id);
      await tx.wait();
      console.log(
        `Token with request_id: ${request_id} approved on blockchain.`
      );

      // Update the token status in the backend
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}:5000/token/update`,
        {
          request_id: request_id,
          image: image,
          description: description,
          isApproved: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Remove the approved token from the pending list
      setPendingCoins((prevCoins) =>
        prevCoins.filter((coin) => coin.request_id !== request_id)
      );
      alert("Token approved successfully!");
    } catch (error) {
      console.error("Error approving token:", error);
      alert("Failed to approve token. Please try again.");
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">✅ Pending Coins</h1>

        {/* MetaMask connection button */}
        {!account ? (
          <button className="connect-wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p>Connected account: {account}</p>
        )}
      </header>
      <main>
        {isLoading ? (
          <p>Loading pending coins...</p>
        ) : pendingCoins.length > 0 ? (
          <section className="approved-coins-list">
            {pendingCoins.map((coin) => (
              <div key={coin.request_id} className="coin-item">
                {/* Coin image */}
                <Image
                  src={coin.image || "/default.png"}
                  alt={coin.description || "No Description"}
                  width={100}
                  height={100}
                />

                {/* Coin description */}
                <h3 className="coin-description">
                  {coin.description || "No Description"}
                </h3>

                {/* Creation date */}
                <p className="coin-created">Created At: {coin.createdAt}</p>

                {/* Contract addrsess */}
                {coin.contract_address ? (
                  <p className="coin-contract">
                    Contract: {coin.contract_address}
                  </p>
                ) : (
                  <p className="coin-contract">Contract: Not Deployed</p>
                )}

                {/* Approval Button */}
                <button
                  className="approve-button"
                  onClick={() =>
                    approveCoin(coin.request_id, coin.image, coin.description)
                  }>
                  Approve
                </button>
              </div>
            ))}
          </section>
        ) : (
          <p>No pending coins found.</p>
        )}
      </main>
    </div>
  );
}
