const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  let interval;
  let lastValue = 0;

  ws.on("message", (message) => {
    const { secretKey, newValue } = JSON.parse(message);
    if (secretKey) {
      console.log("received: secretKey", secretKey);
    }
    if (newValue !== undefined) {
      console.log("received: newValue", newValue);

      lastValue = newValue;

      // Обрабатываем клиентскую переменную и добавляем к ней 2
      if (!interval) {
        interval = setInterval(() => {
          lastValue += 2;
          ws.send(JSON.stringify({ newValue: lastValue }));
        }, 5000);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (interval) {
      clearInterval(interval);
    }
  });

  ws.on("error", (error) => {
    console.log("WebSocket error", error);
    if (interval) {
      clearInterval(interval);
    }
  });
});

console.log("WebSocket server is running on ws://localhost:3001");
