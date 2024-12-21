import React from "react";

export default function Topbar() {
  return (
    <div style={{ width: "100%", backgroundColor: "#f1f1f1" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#f1f1f1",
        }}>
        <div>Logo</div>
        <div style={{ display: "flex" }}>
          <div style={{ margin: "0 10px" }}>Home</div>
          <div style={{ margin: "0 10px" }}>About</div>
          <div style={{ margin: "0 10px" }}>Contact</div>
        </div>
      </div>
    </div>
  );
}
