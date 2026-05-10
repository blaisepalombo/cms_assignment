import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';
import { MessageItem } from '../message-item/message-item';
import { MessageEdit } from '../message-edit/message-edit';

@Component({
  selector: 'cms-message-list',
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {

  messages: Message[] = [
    new Message('1', 'Golf Range', 'The range was packed today but I finally fixed my slice a little.', 'Tyler'),
    new Message('2', 'New Driver', 'I tried the new driver this morning and it added like 20 yards.', 'Connor'),
    new Message('3', 'Weekend Tee Time', 'We should book a tee time early Saturday before everything fills up.', 'Mason')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}