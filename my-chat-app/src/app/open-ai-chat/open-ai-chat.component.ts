import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { OpenAIService } from './OpenAIService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-open-ai-chat',
  templateUrl: './open-ai-chat.component.html',
  styleUrls: ['./open-ai-chat.component.scss']
})

export class OpenAiChatComponent implements OnDestroy {
  chatResponse:string = '' ;
  newchatResponse:string = '' ;
  userQuestion: string = '';
  subscription: Subscription | null = null; // Initialize to null
  theWholeMessage: boolean = true;
  messages: string[] = [];
  startTime = 0;
  time = 0;
  constructor(private dataService: OpenAIService, private cdRef: ChangeDetectorRef  ) {}


  getData(): void {
    if (!this.userQuestion) {
      console.error('Text to translate is empty');
      return; // Prevent making a request if there is no text
    }
    this.chatResponse = ''
    this.messages = [];
    this.startTime = Date.now()
    this.time = 0
    // Subscribe to the streaming data from OpenAIService
    this.subscription = this.dataService.getData(this.userQuestion).subscribe({
      next: (data) => {
        console.log('Received data:', data); // Log the received data
        this.chatResponse += data; // Append the streamed data chunks to the response
        this.messages.push(data);        
        this.cdRef.detectChanges()
      },
      error: (err) => {
        console.error('Error receiving streamed response:', err);
      },
     
      complete: () => {
        this.time += (Date.now() - this.startTime)/1000 // in sec;
        this.cdRef.detectChanges()
        console.log(this.time);
        console.log('Streaming complete');
      }
    });
  }

  toggleChat() {
    this.theWholeMessage = !this.theWholeMessage; // Toggle the state
  }
  ngOnDestroy() {
    // Unsubscribe from the data stream to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
