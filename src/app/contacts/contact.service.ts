import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { FIREBASE_URL } from '../firebase-url';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId = 0;

  constructor(private http: HttpClient) {}

  getContacts(): Contact[] {
    this.http.get<Contact[]>(`${FIREBASE_URL}/contacts.json`).subscribe({
      next: (contacts: Contact[] | null) => {
        this.contacts = contacts ? contacts.filter((contact) => contact !== null) : [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    return this.contacts.slice();
  }

  storeContacts() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(`${FIREBASE_URL}/contacts.json`, JSON.stringify(this.contacts), { headers }).subscribe({
      next: () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);

    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }
}