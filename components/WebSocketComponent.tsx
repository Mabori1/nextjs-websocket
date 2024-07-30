"use client";

import { useEffect, useRef, useState } from "react";

interface WebSocketComponentProps {
  secretKey: string;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({
  secretKey,
}) => {
  const [incrementedValue, setIncrementedValue] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  const handleNewValue = (newValue: number) => {
    setIncrementedValue(newValue);
    console.log("Incremented Value:", newValue);
  };

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket("ws://localhost:3001");

      ws.current.onopen = () => {
        console.log("WebSocket connection opened");
        ws.current?.send(JSON.stringify({ secretKey }));
      };

      ws.current.onmessage = (event) => {
        const { newValue } = JSON.parse(event.data);
        console.log("received:", newValue);
        handleNewValue(newValue);
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(connect, 1000); // Попытка повторного подключения через 1 сек
      };

      ws.current.onerror = (error) => {
        console.log("WebSocket error", error);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [secretKey]);

  useEffect(() => {
    const sendValueInterval = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const newIncrementedValue = incrementedValue + 1;
        ws.current.send(JSON.stringify({ newValue: newIncrementedValue }));
      }
    }, 5000);

    return () => {
      clearInterval(sendValueInterval);
    };
  }, [incrementedValue]);

  return (
    <div>WebSocket is connected. Incremented value: {incrementedValue}</div>
  );
};

export default WebSocketComponent;
