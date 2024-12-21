"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./pgaecss.css";
import { ethers } from "ethers";
import TokenFactoryABI from "../TokenFactory.json";
import axios from "axios";

export default function MemeCoinCreation() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isPurchaseVisible, setIsPurchaseVisible] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coinName, setCoinName] = useState<string>("");
  const [coinSymbol, setCoinSymbol] = useState<string>("");
  const [coinDescription, setCoinDescription] = useState<string>("");

  const TokenFactoryAddress = "0xb6Ead7E52EF0ae4225e2CF63F63669E2e6325286";

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (imageRef.current) {
        const randomAngle = Math.random() * 360;
        imageRef.current.style.transform = `rotate(${randomAngle}deg)`;
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        // Set local preview
        setImageFile(file);
        const fileURL = URL.createObjectURL(file);
        setPreviewSrc(fileURL);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", file);

        // Upload to server
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}:5000/file/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("File uploaded successfully:", response.data.image_url);
        setPreviewSrc(response.data.image_url);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("File upload failed:", error);
        alert("Failed to upload the image. Please try again.");
      }
    } else if (file && file.type.startsWith("video/")) {
      alert("Video uploads are not supported yet.");
      setImageFile(null);
      setPreviewSrc(null);
    } else {
      alert("Only images are allowed.");
      setImageFile(null);
      setPreviewSrc(null);
    }
  };

  const handlePurchase = async () => {
    setIsPurchaseVisible(true);
  };

  const handleCloseModal = () => {
    setIsPurchaseVisible(false);
  };

  const handleBuy = async () => {
    if (!coinName.trim() || !coinSymbol.trim()) {
      alert("Please enter both coin name and symbol.");
      return;
    }

    if (coinName.length > 32 || coinSymbol.length > 8) {
      alert(
        "Coin name must be less than 32 characters and symbol less than 8 characters."
      );
      return;
    }

    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask.");
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

      const tx = await tokenFactory.requestToken(
        coinName.trim(),
        coinSymbol.trim()
      );

      const receipt = await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction receipt:", receipt);

      const eventAbi = [
        "event TokenRequested(bytes32 indexed requestId, address indexed creator, string name, string symbol)",
      ];
      const iface = new ethers.Interface(eventAbi);

      const event = receipt.logs
        .map((log: any) => {
          try {
            return iface.parseLog(log); // Try to parse each log
          } catch {
            return null; // If parsing fails, ignore
          }
        })
        .filter((log: any) => log !== null) // Remove null entries
        .find((log: any) => log.name === "TokenRequested"); // Find the specific event
      if (event) {
        const requestId = event.args.requestId; // Extract requestId
        console.log("Request ID:", requestId);

        // Send the request ID, image, and description to the server
        const apiResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}:5000/token/create`,
          {
            request_id: requestId,
            image: previewSrc, // Assuming this holds the uploaded image URL
            description: coinDescription,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API response:", apiResponse.data);
        alert("Token request submitted successfully!");
      } else {
        console.log("TokenRequested event not found.");
        alert("Failed to retrieve request ID from the transaction.");
      }

      // Reset form fields
      setCoinName("");
      setCoinSymbol("");
      setCoinDescription("");
      setPreviewSrc(null);
      setIsPurchaseVisible(false);
    } catch (error: any) {
      console.error("Error requesting token:", error);
      alert(`Failed to request token: ${error.message}`);
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
            style={{ width: "auto", height: "auto" }}
            priority
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
              <input
                type="text"
                id="name"
                placeholder="Enter coin name"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ticker">Ticker Symbol</label>
              <input
                type="text"
                id="ticker"
                placeholder="E.g., MEME"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Describe your MemeCoin"
                value={coinDescription}
                onChange={(e) => setCoinDescription(e.target.value)}></textarea>
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
                <img src={previewSrc} alt="Preview" className="preview-media" />
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
