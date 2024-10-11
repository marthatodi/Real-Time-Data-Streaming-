require('dotenv').config();
const WebSocket = require('ws');
const axios = require('axios');
const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:4200' // Allow Angular app access
}));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = process.env.OPENAI_API_KEY || '';

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', async message => {
    console.log('Received message:', message);

    try {
      const userMessage = JSON.parse(message);  // Parse the incoming message from the client
      console.log(CHATGPT_API_KEY);
      
      // OpenAI request with streaming enabled
      const apiRequest = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage.content }],
        stream: true  // Enable streaming
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATGPT_API_KEY}`
      };

      const response = await axios({
        url: CHATGPT_API_URL,
        method: 'POST',
        headers: headers,
        data: JSON.stringify(apiRequest),
        responseType: 'stream' // Important: this tells Axios to handle the response as a stream
      });

      // Handle streaming data
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        debugger
        for (const line of lines) {
          console.log('lines',line);

          if (line.startsWith('data:')) {
            const data = line.slice(5); // Remove 'data: ' prefix
            if (data !== '[DONE]') {
              try {
                const parsedData = JSON.parse(data);
                const content = parsedData.choices[0]?.delta?.content;
                if (content) {
                  ws.send(JSON.stringify({ message: content }));
                }
              } catch (error) {
                console.error('Error parsing stream chunk:', error);
              }
            }
          }
        }
      });

      response.data.on('end', () => {
        ws.send(JSON.stringify({ message: '[DONE]' }));
        console.log('Stream finished');
      });

      response.data.on('error', (error) => {
        console.error('Stream error:', error);
        ws.send(JSON.stringify({ message: 'Error with streaming from OpenAI' }));
      });

    } catch (error) {
      console.error('Error:', error.message);
      ws.send(JSON.stringify({ message: 'Error communicating with OpenAI API' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});
