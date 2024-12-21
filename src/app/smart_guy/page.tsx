"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./pgaecss.css";
import { ethers } from "ethers"; // ethers 모듈 임포트
import axios from "axios";

export default function MemeCoinCreation() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isPurchaseVisible, setIsPurchaseVisible] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const fileURL = URL.createObjectURL(file);
      setPreviewSrc(fileURL);
    } else {
      setImageFile(null);
      setPreviewSrc(null);
    }
  };

  const handlePurchase = async () => {
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    try {
      // FormData로 파일과 데이터를 묶어 전송
      const formData = new FormData();
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}:5000/file/image/upload`;

      if (!apiUrl) {
        throw new Error("API URL is not defined.");
      }

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // multipart/form-data로 전송
        },
      });
      setIsPurchaseVisible(true);
      console.log("Image and data uploaded successfully:", response.data);
      alert("Transaction confirmed and image uploaded successfully!");
    } catch (error) {
      console.error("Error during purchase and image upload:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsPurchaseVisible(false);
  };

  const handleBuy = async () => {
    if (!purchaseAmount || purchaseAmount <= 0) {
      alert("Please enter a valid amount to purchase.");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // BrowserProvider 사용
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner(); // await을 사용하여 signer 객체를 해결

      // 트랜잭션 수행
      const tx = await signer.sendTransaction({
        to: "0x09C75F68E9AC4d005F07db81FB5B221421341BF9", // 수신자 주소 (스마트 계약 주소)
        value: ethers.parseEther((purchaseAmount * 0.01).toString()), // 금액 (ETH 기준)
        gasLimit: 1000000, // 가스 한도를 충분히 설정
      });

      console.log("Transaction sent:", tx.hash);
      alert("Transaction sent! Waiting for confirmation...");

      // 트랜잭션 확인 대기
      await tx.wait();
      alert("Transaction confirmed!");
      setIsPurchaseVisible(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">🌟 MemeCoin Creation Platform 🌟</h1>
        <p className="subtitle">
          "Easily create your own meme coin and join the fun!"
        </p>
      </header>

      <main>
        <section className="hero">
          <Image
            ref={imageRef}
            src="/brand-black-logo1.png"
            alt="MemeCoin Logo"
            className="hero-img"
            width={800}
            height={400}
          />
          <h2>Make your MemeCoin dream come true!</h2>
          <p className="info">
            Please note: Content that is overly explicit or excessively violent
            will be automatically rejected by our AI system.
          </p>
        </section>

        <section className="form-section">
          <h2 className="section-title">MemeCoin Details</h2>
          <form className="meme-form">
            <div className="form-group">
              <label htmlFor="name">Coin Name</label>
              <input type="text" id="name" placeholder="Enter coin name" />
            </div>

            <div className="form-group">
              <label htmlFor="ticker">Ticker Symbol</label>
              <input type="text" id="ticker" placeholder="E.g., MEME" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Describe your MemeCoin"></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="media">Image/Video</label>
              <input
                type="file"
                id="media"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>

            {previewSrc && (
              <div className="preview">
                {previewSrc.endsWith(".mp4") || previewSrc.includes("video") ? (
                  <video controls src={previewSrc} className="preview-media" />
                ) : (
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="preview-media"
                  />
                )}
              </div>
            )}

            <button
              type="button"
              className="cta-button"
              onClick={handlePurchase}>
              🚀 Create MemeCoin
            </button>
          </form>
        </section>

        {isPurchaseVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="modal-close" onClick={handleCloseModal}>
                ✖
              </button>
              <h2 className="modal-title">Choose Your Purchase Amount</h2>
              <div className="form-group">
                <label htmlFor="purchase">
                  How many [HSK] do you want to buy? (Optional)
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
                Buy HSK
              </button>
            </div>
          </div>
        )}

        <section className="roadmap">
          <h2>Why AI Review?</h2>
          <ul>
            <li>✅ Ensure appropriateness and safety.</li>
            <li>❌ Automatically block explicit or violent content.</li>
            <li>🌍 Promote a fun and inclusive environment.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
