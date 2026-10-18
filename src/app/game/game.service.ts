import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateGameRequest, GameListItem } from './game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
    private http = inject(HttpClient);

    getAll(): Observable<GameListItem[]> {
        return this.http.get<GameListItem[]>(`${environment.apiUrl}/api/games`);
    }

    create(req: CreateGameRequest): Observable<unknown> {
        return this.http.post<unknown>(`${environment.apiUrl}/api/games`, req);
    }
}