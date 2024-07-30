"use client";

import { useEffect, useState } from "react";
import WebSocketComponent from "../components/WebSocketComponent";

const HomePage = () => {
  const [secretKey, setSecretKey] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("key");
    setSecretKey(key);

    if (!key) {
      window.location.href = "/404";
    }
  }, []);

  if (!secretKey) return null;

  return (
    <div>
      <h1>Main Page</h1>
      <p>Key: {secretKey}</p>
      <WebSocketComponent secretKey={secretKey} />
    </div>
  );
};

export default HomePage;
