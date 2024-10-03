// Angular DataService
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  constructor() { }

  getData(text: string): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(`/api/data?text=${text}`);
  
      eventSource.onmessage = event => {
        console.log('Received event data:', event.data); // Log raw event data
        try {
          // Assuming event.data is a valid JSON string
          if(event.data === '[DONE]'){
              eventSource.close();
              observer.complete();
            
          }else{
            observer.next(event.data);
          }
        } catch (error) {
          console.error('Error parsing event data:', error);
          observer.error('Error parsing event data');
        }
      };
  
      eventSource.onerror = error => {
        console.error('EventSource error:', error);
        observer.error('Error occurred in EventSource');
        return () => {
          eventSource.close();
        };
      };
  
      

  
      return () => {
        eventSource.close();
      };
    });
  }
  
}