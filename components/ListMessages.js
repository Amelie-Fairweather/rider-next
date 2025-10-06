"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../lib/supabase";

export default function ListMessages({ driverId, riderId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate a proper UUID for the user (same as ChatInput)
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

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, riderId]);

  if (loading && messages.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading messages...
      </div>
    );
  }

  return (
    <div className="messages-container" style={{ 
      flex: 1, 
      overflowY: "auto", 
      padding: "20px",
      maxHeight: "400px"
    }}>
      {messages.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666" }}>
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((msg) => {
          const currentUserId = generateUserId(riderId);
          const isCurrentUser = msg.send_by === currentUserId;
          
          return (
            <div
              key={msg.id}
              style={{
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: isCurrentUser ? "#e3f2fd" : "#f5f5f5",
                borderRadius: "10px",
                marginLeft: isCurrentUser ? "20%" : "0",
                marginRight: isCurrentUser ? "0" : "20%"
              }}
            >
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
              <div style={{ fontSize: "14px" }}>
                {msg.text}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}