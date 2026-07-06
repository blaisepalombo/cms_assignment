import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  documents: Document[] = [];
  private documentsLoaded = false;
  private apiUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {}

  getDocuments(): Document[] {
    if (this.documentsLoaded) {
      return this.documents.slice();
    }

    this.http.get<{ message: string; documents: Document[] }>(this.apiUrl).subscribe({
      next: (responseData) => {
        this.documents = responseData.documents ? responseData.documents : [];
        this.sortAndSend();
        this.documentsLoaded = true;
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }

    return null;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; document: Document }>(
      this.apiUrl,
      document,
      { headers: headers }
    ).subscribe({
      next: (responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      this.apiUrl + '/' + originalDocument.id,
      newDocument,
      { headers: headers }
    ).subscribe({
      next: () => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.apiUrl + '/' + document.id).subscribe({
      next: () => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  private sortAndSend() {
    this.documents.sort((a, b) => a.name.localeCompare(b.name));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}