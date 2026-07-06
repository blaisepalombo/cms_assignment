import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new BehaviorSubject<Contact[]>([]);
  contacts: Contact[] = [];
  private contactsLoaded = false;
  private apiUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Contact[] {
    if (this.contactsLoaded) {
      return this.contacts.slice();
    }

    this.http.get<{ message: string; contacts: Contact[] }>(this.apiUrl).subscribe({
      next: (responseData) => {
        this.contacts = responseData.contacts ? responseData.contacts : [];
        this.sortAndSend();
        this.contactsLoaded = true;
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; contact: Contact }>(
      this.apiUrl,
      contact,
      { headers: headers }
    ).subscribe({
      next: (responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      this.apiUrl + '/' + originalContact.id,
      newContact,
      { headers: headers }
    ).subscribe({
      next: () => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.apiUrl + '/' + contact.id).subscribe({
      next: () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  private sortAndSend() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}