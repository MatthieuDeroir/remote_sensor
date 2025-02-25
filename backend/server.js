// server.js
const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const PORT = 3000;
const app = express();

// Serve static files (index.html) from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
  console.log(`✅ Node server running on http://localhost:${PORT}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Broadcast to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// When a new WebSocket connection is established
wss.on('connection', ws => {
  console.log('📡 New WebSocket client connected.');

  // When we receive a message from Python
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      // Broadcast to all browser clients
      broadcast(data);    } catch (err) {
      console.error('❌ Error parsing message', err);
    }
  });

  ws.on('close', () => {
    console.log('❌ A WebSocket client disconnected.');
  });
});
