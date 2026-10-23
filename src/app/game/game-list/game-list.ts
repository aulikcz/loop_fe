import { Component, inject, OnInit, signal } from '@angular/core';
import { GameListItem } from '../game.model';
import { GameService } from '../game.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    imports: [RouterLink],
    selector: 'app-game-list',
    styleUrl: './game-list.css',
    templateUrl: './game-list.html',
})
export class GameList implements OnInit{
    games = signal<GameListItem[]>([]);
    private gameService = inject(GameService);

    ngOnInit() {
        this.gameService.getAll()
            .subscribe({
                next: r => this.games.set(r),
                error: err => console.error('Failed on loading', err)
            });
    }
}
