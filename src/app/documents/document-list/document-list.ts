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
    new Document('1', 'Angular Notes', 'Notes about Angular components and directives.', 'https://angular.dev', null),
    new Document('2', 'Project Plan', 'Basic project planning document for the CMS app.', 'https://example.com/project-plan', null),
    new Document('3', 'Meeting Notes', 'Notes from a team meeting about the documents feature.', 'https://example.com/meeting-notes', null),
    new Document('4', 'Assignment Guide', 'Guide for completing the W04 documents assignment.', 'https://example.com/assignment-guide', null),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}