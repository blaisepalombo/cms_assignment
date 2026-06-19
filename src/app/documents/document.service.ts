import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Document } from './document.model';
import { FIREBASE_URL } from '../firebase-url';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  documents: Document[] = [];
  maxDocumentId = 0;
  private documentsLoaded = false;

  constructor(private http: HttpClient) {}

  getDocuments(): Document[] {
    if (this.documentsLoaded) {
      return this.documents.slice();
    }

    this.http.get<Document[]>(`${FIREBASE_URL}/documents.json`).subscribe({
      next: (documents: Document[] | null) => {
        this.documents = documents ? documents.filter((document) => document !== null) : [];
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentsLoaded = true;
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    return this.documents.slice();
  }

  storeDocuments() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(`${FIREBASE_URL}/documents.json`, JSON.stringify(this.documents), { headers }).subscribe({
      next: () => {},
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);
    this.documents.sort((a, b) => a.name.localeCompare(b.name));

    this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);

    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    this.documents[pos] = newDocument;
    this.documents.sort((a, b) => a.name.localeCompare(b.name));

    this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);

    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);

    this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }
}