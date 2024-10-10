import { Component } from '@angular/core';
import { FetchingService } from '../fetchService.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  messages: { content: string, type: string }[] = [];  // Store user and bot messages
  messagesResp: { content: string, type: string }[] = [];  // Store user and bot messages
  currentMessage: string = '';  // Temporary message typed by user
  title = 'OpenAI Chat';
  userMessage: string = '';  // Bound to textarea input
  chatResponse: string = '';  // Store response from OpenAI stream

  constructor(private fetchingService: FetchingService) {}

  sendMessage(event: KeyboardEvent) {
    // Check if the pressed key is "Enter"
    if (event.key === "Enter") {
      // If Shift+Enter is pressed, allow a new line and return (don't send the message)
      if (event.shiftKey) {
        return;
      }

      // Prevent default "Enter" key behavior (which is adding a new line)
      event.preventDefault();

      if (this.userMessage.trim()) {
        // Add user's message to the chat
        this.messages.push({ content: this.userMessage, type: 'user' });

        // Clear previous bot response before starting a new one
        this.chatResponse = '';

        // Call OpenAI service to get a response
        this.fetchingService.createChatCompletionStream(this.userMessage).subscribe(
          {
            next: (chunk: string) => {
              this.chatResponse += chunk;  // Append each chunk of response
            },
            error: (err: any) => {
              console.error('Error:', err);
              this.chatResponse = 'Error with OpenAI API';
            },
            complete: () => {
              console.log('Response stream complete');
              // Push the complete response to the messages array
              this.messagesResp.push({ content: this.chatResponse, type: 'bot' });
            }
          }
        );

        // Clear user message input
        this.userMessage = '';
      }
    }
  }
}
