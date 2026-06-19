import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Message } from './message.model';
import { FIREBASE_URL } from '../firebase-url';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new Subject<Message[]>();
  messages: Message[] = [];
  maxMessageId = 0;

  constructor(private http: HttpClient) {}

  getMessages(): Message[] {
    this.http.get<Message[]>(`${FIREBASE_URL}/messages.json`).subscribe({
      next: (messages: Message[] | null) => {
        this.messages = messages ? messages.filter((message) => message !== null) : [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next(this.messages.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    return this.messages.slice();
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(`${FIREBASE_URL}/messages.json`, JSON.stringify(this.messages), { headers }).subscribe({
      next: () => {
        this.messageChangedEvent.next(this.messages.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }
}