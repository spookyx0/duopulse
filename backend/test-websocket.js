const { io } = require('socket.io-client');

// Test WebSocket connection
const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ WebSocket connected successfully');
  socket.disconnect();
});

socket.on('connect_error', (error) => {
  console.log('❌ WebSocket connection failed:', error.message);
});

setTimeout(() => {
  if (socket.connected) {
    console.log('✅ WebSocket test passed');
  } else {
    console.log('❌ WebSocket test failed');
  }
  process.exit(0);
}, 3000);