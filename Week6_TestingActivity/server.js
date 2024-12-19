require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./dbconnection'); // Import database connection
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');

// App setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Connect to MongoDB
connectToDatabase();

// Message Schema
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Add timestamp
});
const Message = mongoose.model('Message', messageSchema);

// Routes
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { text } = req.body;
    const newMessage = new Message({ text });
    await newMessage.save();
    io.emit('message-added', newMessage);
    res.json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'An error occurred while adding the message.' });
  }
});

app.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    await Message.findByIdAndUpdate(id, { text }, { new: true });

   // const messages = await Message.find().sort({ createdAt: -1 });

    io.emit('messages-updated', messages);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'An error occurred while updating the message.' });
  }
});

app.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    io.emit('message-deleted', deletedMessage);
    res.json(deletedMessage);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'An error occurred while deleting the message.' });
  }
});

/*
app.get('/addTwoNumbers/:firstNumber/:secondNumber', (req, res) => {
  const firstNumber = parseInt(req.params.firstNumber);
  const secondNumber = parseInt(req.params.secondNumber);
  const result = firstNumber + secondNumber || null;
  if (result == null) {
    res.status(400).json({ result: result, statusCode: 400 });
  } else {
    res.status(200).json({ result: result, statusCode: 200 });
  }
});

app.get('/api/projects', (req, res) => {
  const projects = [
    { id: 1, name: 'Project Alpha', status: 'Completed' },
    { id: 2, name: 'Project Beta', status: 'In Progress' },
  ];
  res.status(200).json(projects);
}); */

// WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });



});




// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


