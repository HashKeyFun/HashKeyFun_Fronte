import React from "react";
import "../globals.css";

export default function Footer() {
  return (
    <footer
      className="footer"
      style={{
        position: "absolute",
        bottom: "0",
        width: "100%",
        height: "60px",
        lineHeight: "60px",
        textAlign: "center",
      }}>
      <p>© 2024 MemeCoin Inc. | Not Financial Advice</p>
    </footer>
  );
}
