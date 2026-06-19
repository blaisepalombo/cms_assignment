import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  imports: [],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem implements OnInit, OnDestroy {
  @Input() message!: Message;
  messageSender = '';

  private subscription!: Subscription;

  constructor(
    private contactService: ContactService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateMessageSender();

    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      () => {
        this.updateMessageSender();
        this.changeDetectorRef.detectChanges();
      }
    );

    this.contactService.getContacts();
  }

  updateMessageSender(): void {
    if (!this.message || !this.message.sender) {
      this.messageSender = '';
      return;
    }

    const contact: Contact | null = this.contactService.getContact(this.message.sender);

    if (contact) {
      this.messageSender = contact.name;
    } else {
      this.messageSender = this.message.sender;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}