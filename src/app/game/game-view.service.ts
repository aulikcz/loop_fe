import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameCharacterDetail, GameCharacterListItem, GameInfo, InviteInfo } from './game-view.model';

@Injectable({ providedIn: 'root' })
export class GameViewService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/games`;

  game(id: number): Observable<GameInfo> {
    return this.http.get<GameInfo>(`${this.base}/${id}`);
  }

  characters(gameId: number): Observable<GameCharacterListItem[]> {
    return this.http.get<GameCharacterListItem[]>(`${this.base}/${gameId}/characters`);
  }

  character(gameId: number, characterId: number): Observable<GameCharacterDetail> {
    return this.http.get<GameCharacterDetail>(`${this.base}/${gameId}/characters/${characterId}`);
  }

  invite(gameId: number): Observable<InviteInfo> {
    return this.http.get<InviteInfo>(`${this.base}/${gameId}/invite`);
  }

  regenerateInvite(gameId: number): Observable<InviteInfo> {
    return this.http.post<InviteInfo>(`${this.base}/${gameId}/invite`, {});
  }
}