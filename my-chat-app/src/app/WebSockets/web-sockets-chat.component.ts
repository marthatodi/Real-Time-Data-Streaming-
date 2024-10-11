import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'web-sockets-chat',
  templateUrl: './web-sockets-chat.component.html',
  styleUrls: ['./web-sockets-chat.component.scss']
})
export class WebSocketsChatComponent implements OnInit {
  messages: string[] = [];
  currentMessage: string = '';
  theWholeMessage: boolean = true;
  startTime = 0;
  totalTime = 0; // Total time in seconds
  answerComplete: boolean = false; // Flag to track if the answer is complete

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messages$.subscribe({
      next: (message: string) => {
        try {
          const data = JSON.parse(message); // Deserialize the JSON string
          // Check if the response indicates completion
          if (data.message === '[DONE]') {            
            this.answerComplete = true;
            this.stopTimer(); // Stop timer when the answer is complete
          }else{
            this.currentMessage += data.message; // Append chunk to current message
            this.messages.push(data.message);
          }

          console.log(this.currentMessage);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      },
      error: (err: any) => console.error('WebSocket error:', err),
      complete: () => {
        console.log('WebSocket connection closed');
      },
    });
  }

  sendMessage(content: string): void {
    this.messages = [];
    if (content && content.trim()) {
      const message = { content: content.trim() }; // Create message object
      this.startTime = Date.now(); // Start timer
      this.totalTime = 0; // Reset total time
      this.answerComplete = false; // Reset completion flag
      this.currentMessage = ''; // Clear current message
      this.webSocketService.sendMessage(message); // Send message
    } else {
      console.error('Message content cannot be empty');
    }
  }

  // Function to stop the timer
  private stopTimer(): void {
    const endTime = Date.now();
    this.totalTime =(endTime - this.startTime) / 1000; // Calculate total time in seconds
  }

  // Toggle chat visibility
  toggleChat() {
    this.theWholeMessage = !this.theWholeMessage; // Toggle the state
  }
}
