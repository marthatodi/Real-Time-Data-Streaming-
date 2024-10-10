import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environments/environment'; // Adjust path as necessary
@Injectable({
  providedIn: 'root'
})
export class FetchingService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openaiApiKey; // Use the API key from environment

  constructor() {}

  createChatCompletionStream(message: string): Observable<string> {
    return new Observable<string>(observer => {
      const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        stream: true
      });

      fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: body
      })
      .then(response => {
        if (!response.ok) {
          observer.error('Network response was not ok');
          return;
        }
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        const readStream = () => {
          if (!reader) {
            observer.error('Reader not initialized');
            return;
          }
          
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();  // End the stream when done
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            // Process the chunk and filter lines
            const lines = chunk.split('\n').filter(Boolean);
            lines.forEach(chunk => {
              if (chunk?.startsWith('data:')) {
                const data = chunk.slice(5);  // Remove the 'data:' prefix
                if (data === " [DONE]") {
                  observer.complete();  // End the stream when done
                } else {
                  try {
                    if(data && data.length && JSON.parse(data) && JSON.parse(data)?.choices && JSON?.parse(data)?.choices?.length && JSON.parse(data)?.choices?.[0]?.delta && JSON.parse(data)?.choices?.[0]?.delta?.content) {  
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content || '';
                    if (content) {
                      console.log(content);
                      
                      observer.next(content);  // Emit the actual content
                    }
                  }
                  } catch (err) {
                    observer.error('An error occurred while parsing the response.');
                    console.error('Error parsing chunk:', err);
                  }
                }
              }
            });

            // Continue reading the stream
            readStream();
          }).catch(error => {
            observer.error('Error reading stream: ' + error.message);
          });
        };

        // Start reading the stream
        readStream();
      })
      .catch(error => {
        observer.error('Fetch error: ' + error.message);
      });
    });
  }
}
