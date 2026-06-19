import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;

  get imagePath(): string {
    if (!this.contact || !this.contact.imageUrl) {
      return 'images/barzeer.jpg';
    }

    return this.contact.imageUrl.replace('../assets/', '');
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = 'images/barzeer.jpg';
  }
}