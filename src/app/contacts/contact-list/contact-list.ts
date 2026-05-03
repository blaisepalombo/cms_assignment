import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  contacts = [
    {
      id: '1',
      name: 'R. Kent Jackson',
      email: 'jacksonk@byui.edu',
      phone: '208-496-3771',
      imageUrl: 'images/jacksonk.jpg',
      group: null
    },
    {
      id: '2',
      name: 'Rex Barzee',
      email: 'barzeer@byui.edu',
      phone: '208-496-3768',
      imageUrl: 'images/barzeer.jpg',
      group: null
    }
  ];
}