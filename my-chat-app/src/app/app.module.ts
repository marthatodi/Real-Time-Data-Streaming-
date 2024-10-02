import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './XMLHttpRequest/chat.component';
import { OpenaiService } from './openai.service';
import { RouterModule, Routes } from '@angular/router'
import { WebSocketsChatComponent } from './WebSockets/web-sockets-chat.component'; 

const routes: Routes = [
  { path: 'web-sockets-chat', component: WebSocketsChatComponent }, // The new component
];
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    WebSocketsChatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),  // Make sure RouterModule is imported here    HttpClientModule,  // Import HttpClientModule here
    FormsModule,
  ],
  providers: [OpenaiService],  // Optionally provide OpenaiService globally
  bootstrap: [AppComponent]
})
export class AppModule { }
