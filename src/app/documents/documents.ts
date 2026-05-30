import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocumentList } from './document-list/document-list';

@Component({
  selector: 'cms-documents',
  imports: [DocumentList, RouterOutlet],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {}