'use strict';

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

function onSocketError(err) {
  console.error(err);
}

const app = express();
const map = new Map();

//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));

//
// Create an HTTP server.
//
const server = http.createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocketServer({ clientTracking: true, noServer: true });

server.on('upgrade', function (request, socket, head) {
  socket.on('error', onSocketError);

  console.log('Upgrading to WebSocket...');

  socket.removeListener('error', onSocketError);

  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

let messages = [];

wss.on('connection', function (ws, request) {
  ws.on('error', console.error);

  ws.on('message', function (message) {
    console.log(`Received message ${message}`);
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.sender === 'fidget-spinner-web') {
        messages.push(parseFloat(parsedMessage.content));
      }
    } catch (e) {
      console.error('Failed to parse message', e);
    }
  });

  ws.on('close', function () {
    // Handle WebSocket close event if needed
  });
});

//
// Periodically send averaged messages to all connected clients.
//
setInterval(() => {
  if (messages.length > 0) {
    const sum = messages.reduce((acc, val) => acc + val, 0);
    const avg = sum / messages.length;
    const averagedMessage = JSON.stringify({
      sender: 'fidget-spinner-web',
      content: avg.toString()
    });

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(averagedMessage);
      }
    });

    // Clear the messages array for the next interval
    messages = [];
  }
}, 1000); // Calculate and send the average every second

//
// Start the server.
//
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});