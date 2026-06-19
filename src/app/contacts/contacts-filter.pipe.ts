import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
  standalone: true
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    if (!contacts || contacts.length === 0) {
      return [];
    }

    if (!term || term.trim() === '') {
      return contacts;
    }

    const filteredContacts = contacts.filter((contact: Contact) =>
      contact.name.toLowerCase().includes(term.toLowerCase())
    );

    if (filteredContacts.length === 0) {
      return contacts;
    }

    return filteredContacts;
  }
}