import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character, CreateCharacterRequest, UpdateCharacterRequest } from './character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/characters`;

  list(): Observable<Character[]> {
    return this.http.get<Character[]>(this.baseUrl);
  }

  get(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/${id}`);
  }

  create(req: CreateCharacterRequest): Observable<Character> {
    return this.http.post<Character>(this.baseUrl, req);
  }

  update(id: number, req: UpdateCharacterRequest): Observable<Character> {
    return this.http.put<Character>(`${this.baseUrl}/${id}`, req);
  }
}