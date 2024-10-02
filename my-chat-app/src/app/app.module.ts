import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { OpenaiService } from './openai.service';
import { RouterModule } from '@angular/router'
import { WebSocketService } from './websocket.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,  // Import HttpClientModule here
    FormsModule,
    RouterModule
  ],
  providers: [OpenaiService],  // Optionally provide OpenaiService globally
  bootstrap: [AppComponent]
})
export class AppModule { }
