"use client";
import { useState } from "react";
import ListMessages from "./ListMessages";
import ChatInput from "./ChatInput";

export default function ChatBox({ driverId, driverName, riderId, riderName }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chat-box" style={{ position: "relative" }}>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#ff69b4",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 12px rgba(255,105,180,0.3)",
          zIndex: 1000
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1001
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#ff69b4",
              color: "white",
              borderRadius: "10px 10px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>
                Chat with {driverName}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                {riderName}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <ListMessages driverId={driverId} riderId={riderId} />

          {/* Input Area */}
          <ChatInput driverId={driverId} riderId={riderId} />
        </div>
      )}
    </div>
  );
}
