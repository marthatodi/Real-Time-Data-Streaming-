require('dotenv').config();
const http = require('http');
const request = require('request');

const CHATGPT_API_KEY = process.env.OPENAI_API_KEY || '';
const port = 3000;

// Create a simple HTTP server without Express
http.createServer((req, res) => {
  if (req.url.startsWith('/api/data')) {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Extract user input from query string
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const userQuestion = urlParams.searchParams.get('text') || 'Hello, World!';

    // OpenAI API request options
    const options = {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${CHATGPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userQuestion }],
        stream: true,
        max_tokens: 60,
      }),
      method: 'POST',
    };

    // Request to OpenAI API and stream response
    request(options)
      .on('data', chunk => {
        const parsedChunk = chunk.toString();
        parsedChunk.split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            const jsonString = line.substring(6).trim();
            if (jsonString && jsonString !== '[DONE]') {
              try {
                const jsonData = JSON.parse(jsonString);
                if (jsonData.choices && jsonData.choices[0].delta.content) {
                  const messagePart = jsonData.choices[0].delta.content;
                  console.log('Streaming part:', messagePart);
                  res.write(`data: ${messagePart}\n\n`); // Stream chunk to client
                }
              } catch (error) {
                console.error('Error parsing chunk:', error);
              }
            }
            if (jsonString === '[DONE]') {
              res.write('data: [DONE]\n\n');
              res.end(); // End stream when done
            }
          }
        });
      })
      .on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end(); // End the SSE stream
      })
      .on('error', error => {
        console.error('Request error:', error);
        res.statusCode = 500;
        res.end('Error streaming response from OpenAI');
      });
  } else {
    // Handle other routes or respond with a 404 if route is invalid
    res.statusCode = 404;
    res.end('Invalid route');
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
