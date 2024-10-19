**Real-Time Chat with OpenAI GPT-3.5 Turbo**

This project is a single-page website built using Angular v15 that allows users to interact with OpenAI's GPT-3.5 Turbo in real-time through three different chat interfaces. Each chat demonstrates a unique method of communication with the OpenAI API, and also provides response times for performance comparison. Additionally, users can see how data is streamed into parts for more efficient communication with the model.
![image](https://github.com/user-attachments/assets/0944f0ec-24b1-465f-bcb7-da896c075f28)

**Features:**

1. Real-Time Chat via Fetch API:
        The first chat interface utilizes the native Fetch API for communication with the OpenAI API.
        This approach provides a simple, client-side way to make HTTP requests, allowing users to send prompts and receive responses in real time.

2. Real-Time Chat via Node.js Server:
        The second chat interface connects to a Node.js server that acts as an intermediary between the Angular front-end and the OpenAI API.
        This implementation demonstrates how to handle API requests on the server side, offering more flexibility for managing environment variables, API keys, and data processing before relaying the results back to the user.

3. Real-Time Chat via WebSockets:
        The third chat interface uses WebSockets to create a persistent, full-duplex communication channel between the client and the server.
        This approach ensures real-time, low-latency interaction with OpenAI's GPT-3.5 Turbo, making it ideal for applications requiring fast, ongoing communication without frequent reconnections.

**Technologies Used:**

  - Angular v15: Front-end framework for building a dynamic and responsive UI.
  - OpenAI GPT-3.5 Turbo: Language model powering the real-time chat responses.
  - Fetch API: Client-side API used for handling HTTP requests in one of the chat interfaces.
  - Node.js: Server-side environment for handling OpenAI API calls and responses.
  - WebSockets: Protocol for establishing real-time, continuous connections between the client and server.

**How It Works:**

Each chat interface is designed to allow users to communicate with OpenAI's GPT-3.5 Turbo, while offering the ability to compare performance metrics between different technologies. By measuring response times and observing how data is streamed, users can get a better understanding of the trade-offs between simplicity, speed, and data handling across different communication methods.

Feel free to explore each chat option to see how the different communication methods compare in terms of performance, usability, and implementation complexity.

You can navigate between Node AI and Web Socket chats by clicking the button in the middle of the screen.

**Add your CHATGPT API KEY:**

  1. apiKey in fetchService
  2. CHATGPT_API_KEY in server-ai.js
  3. CHATGPT_API_KEY in node server.js

**Installation & Setup:**

  1. Clone the repository: git clone git@github.com:marthatodi/Real-Time-Data-Streaming-.git

  2. Navigate to the project folder: cd Real-Time-Data-Streaming-/my-chat-app

  3. Install dependencies: npm install

  4. Run the Angular project: ng serve (you must run the app in http://localhost:8080)

  5. Run servers in seperate terminals:
        - For the Node.js server, navigate to the server folder and start the Node AI serveR: node server-ai.js
        - For the Node.js server, navigate to the server folder and start the Web Sockets server: node server.js




