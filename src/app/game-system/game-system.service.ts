import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameSystem } from './game-system.model';

@Injectable({ providedIn: 'root' })
export class GameSystemService {
  private http = inject(HttpClient);

  getAll(): Observable<GameSystem[]> {
    return this.http.get<GameSystem[]>(`${environment.apiUrl}/api/game-systems`);
  }
}