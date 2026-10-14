import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="load()">Načíst z DB</button>
    <p>{{ message() }}</p>
  `,
})
export class App {
  message = signal('');
  constructor(private http: HttpClient) {}
  load() {
    this.http.get<{ message: string }>(`${environment.apiUrl}/api/hello`)
      .subscribe(r => this.message.set(r.message));
  }
}