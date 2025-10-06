"use client";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../lib/supabase";

export default function ChatInput({ driverId, riderId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Generate a proper UUID for the user
      const generateUserId = (name) => {
        if (!name || typeof name !== 'string') return uuidv4();
        // Create a deterministic UUID based on the name using a simple hash
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          const char = name.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        // Convert to a proper UUID format
        const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
        return `${hashStr.substring(0, 8)}-${hashStr.substring(0, 4)}-4${hashStr.substring(0, 3)}-8${hashStr.substring(0, 3)}-${hashStr}00000000`;
      };

      const userId = generateUserId(riderId);
      
      const { error } = await supabase
        .from("messages")
        .insert([{ 
          text: message, 
          send_by: userId
        }]);

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message: ' + error.message);
      } else {
        setMessage("");
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-input" style={{ padding: "20px", borderTop: "1px solid #ccc" }}>
      <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "16px"
          }}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff69b4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
