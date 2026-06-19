import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactItem } from '../contact-item/contact-item';
import { ContactsFilterPipe } from '../contacts-filter.pipe';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ContactItem, ContactsFilterPipe],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  term: string = '';
  subscription!: Subscription;

  constructor(
    private contactService: ContactService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
        this.changeDetectorRef.detectChanges();
      }
    );

    this.contactService.getContacts();
  }

  search(value: string): void {
    this.term = value;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}