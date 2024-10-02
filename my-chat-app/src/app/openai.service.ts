
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = '';  // Replace with your actual API key

  constructor(private http: HttpClient) {}

  createChatCompletionStream(message: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      stream: true  // Enable streaming
    };

    return new Observable<string>(observer => {
      // Open a connection to the API using HttpClient
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.apiUrl, true);

      // Set headers
      xhr.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      // On progress, process the stream
      xhr.onprogress = (event) => {
        const response = xhr.responseText.split('\n').filter(Boolean); // Split and filter out empty lines
        console.log('resposne',response);
        
        response.forEach(chunk => {
          if (chunk.startsWith('data:')) {
            const data = chunk.slice(5);  // Remove the 'data:' prefix
            if (data === '[DONE]') {
              observer.complete();  // End the stream when done
            } else {
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  observer.next(content);  // Emit the actual content
                }
              } catch (err) {
                console.error('Error parsing chunk:', err);
              }
            }
          }
        });
      };

      // Handle errors
      xhr.onerror = () => {
        observer.error('An error occurred while connecting to the API.');
      };

      // Send the request with the body
      xhr.send(JSON.stringify(body));
    });
  }
}

