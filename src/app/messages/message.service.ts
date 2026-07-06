import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new BehaviorSubject<Message[]>([]);
  messages: Message[] = [];
  private messagesLoaded = false;
  private apiUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  getMessages(): Message[] {
    if (this.messagesLoaded) {
      return this.messages.slice();
    }

    this.http.get<{ message: string; messages: Message[] }>(this.apiUrl).subscribe({
      next: (responseData) => {
        this.messages = responseData.messages ? responseData.messages : [];
        this.messagesLoaded = true;
        this.messageChangedEvent.next(this.messages.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }

    return null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; newMessage: Message }>(
      this.apiUrl,
      message,
      { headers: headers }
    ).subscribe({
      next: (responseData) => {
        this.messages.push(responseData.newMessage);
        this.messageChangedEvent.next(this.messages.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}