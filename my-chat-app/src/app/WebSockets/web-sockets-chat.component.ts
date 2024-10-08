// chat.component.ts
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
  theWholeMessage: boolean = false;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messages$.subscribe({
      next: (message: string) => {
        try {
          const data = JSON.parse(message); // Deserialize the JSON string
          this.currentMessage += data.message; // Append chunk to current message
          this.messages.push(data.message);
          console.log(this.currentMessage);      
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      },
      error: (err: any) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed'),
    });
  }

  sendMessage(content: string): void {
    if (content && content.trim()) {
      const message = { content: content.trim() }; // Create message object
      this.webSocketService.sendMessage(message); // Send message
      this.currentMessage = ''; // Clear current message
    } else {
      console.error('Message content cannot be empty');
    }
  }

    // Toggle chat visibility
    toggleChat() {
      this.theWholeMessage = !this.theWholeMessage; // Toggle the state
    }
}
