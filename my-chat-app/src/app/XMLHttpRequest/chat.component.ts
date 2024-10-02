// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { OpenaiService } from '../openai.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [HttpClient]  // Provide HttpClient here
})
export class ChatComponent  {
  messages: string[] = [];
  currentMessage: string = '';
  title = 'OpenAI Chat';
  userMessage: string = '';
  chatResponse: string = '';

  constructor(private openaiService: OpenaiService) {}

  sendMessage() {
    console.log(this.userMessage);

    this.openaiService.createChatCompletionStream(this.userMessage).subscribe(
      (response) => {
        console.log(response);
        
        this.chatResponse += response;  // Append streaming chunks
      },
      (error) => {
        console.error('Error:', error);
        this.chatResponse = 'Error with OpenAI API';
      }
    );
  }

}
