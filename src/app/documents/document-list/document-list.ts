import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentItem } from '../document-item/document-item';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  imports: [CommonModule, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'CIT 260 - Object Oriented Programming', 'Learn object oriented programming concepts.', 'https://content.byui.edu/file/example/cit260-course-description.pdf', null),
    new Document('2', 'CIT 366 - Full Web Stack Development', 'Learn how to develop modern web applications using the MEAN stack.', 'https://content.byui.edu/file/b7c3e5ed-6947-497f-9d32-4e5b6b397cac/1/CIT%20366%20course%20description.pdf', null),
    new Document('3', 'CIT 425 - Data Warehousing', 'Learn data warehousing concepts and practices.', 'https://content.byui.edu/file/example/cit425-course-description.pdf', null),
    new Document('4', 'CIT 460 - Enterprise Development', 'Learn enterprise application development concepts.', 'https://content.byui.edu/file/example/cit460-course-description.pdf', null),
    new Document('5', 'CIT 495 - Senior Practicum', 'Senior practicum course document.', 'https://content.byui.edu/file/example/cit495-course-description.pdf', null),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}