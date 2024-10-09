// Node.js server with Express
require('dotenv').config();

const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors');
const port = 3000;
const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const CHATGPT_API_KEY = process.env.API_KEY;

app.use(cors({
  origin: 'http://localhost:4200' // Your Angular app's origin
}));
app.use(express.json());
app.get('/api/data', (req, res) => {
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Retrieve the text to translate and the target language from the client
  const textToTranslate = req.query.text || 'Hello, World!';
  
  // OpenAI API request options
  const options = {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${CHATGPT_API_KEY}`,
      'Content-Type': 'application/json'
    },

          
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `${textToTranslate}` } // User's input
      ],
    
    stream: true,
    max_tokens: 60, // Adjust tokens based on the required length of response
  }),
  method: 'POST'
  };
  

  // Stream data from OpenAI API to client
  request(options)
  .on('data', chunk => {
    const parsedChunk = chunk.toString();
    // Split the chunk by newline to process each message
    parsedChunk.split('\n').forEach(line => {
      if (line.startsWith('data: ')) {
        const jsonString = line.substring(6).trim(); // Remove 'data: ' prefix
        if (jsonString && jsonString !== '[DONE]') {
          try {
            const jsonData = JSON.parse(jsonString);
            if (jsonData.choices && jsonData.choices[0].delta.content) {
              const messagePart = jsonData.choices[0].delta.content;
              console.log('Received part:', messagePart);
              // Stream the data to the client as it's being received
              res.write(`data: ${messagePart}\n\n`);
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
        if(jsonString === '[DONE]'){
          res.write(`data: [DONE]\n\n`);
          res.end();

        }
      }
    });
  })
  .on('end', () => {
    res.write(`data: [DONE]\n\n`);
    res.end();
  })
  .on('error', (error) => {
    console.error('Request error:', error);
    res.status(500).send('Error streaming response from OpenAI');
  });
});

app.listen(port, () => console.log('Server running on port 3000'));