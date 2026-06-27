import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail implements OnInit {
  contact!: Contact;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      const contact = this.contactService.getContact(id);

      if (contact) {
        this.contact = contact;
      }
    });
  }

  useFallbackImage(event: Event): void {
  const image = event.target as HTMLImageElement;
  image.src = 'images/barzeer.jpg';
  }
  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
}