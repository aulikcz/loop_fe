import { Component, inject, OnInit, signal } from '@angular/core';
import { GameService } from '../game.service';
import { GameSystemService } from '../../game-system/game-system.service';
import { Router, RouterLink } from '@angular/router';
import { GameSystem } from '../../game-system/game-system.model';

@Component({
  imports: [RouterLink],
  selector: 'app-game-create',
  styleUrl: './game-create.css',
  templateUrl: './game-create.html',
})
export class GameCreate implements OnInit{
    private gameService = inject(GameService);
    private gameSystemService = inject(GameSystemService);
    private router = inject(Router);

    name = signal('');
    gameSystemCode = signal('');
    gameSystems = signal<GameSystem[]>([]);

    ngOnInit() {
        this.gameSystemService.getAll()
            .subscribe({
            next: r => this.gameSystems.set(r),
            error: err => console.error('Failed on loading', err)
      });
    }

    save() {
        this.gameService.create({
            name: this.name(),
            gameSystemCode: this.gameSystemCode(),
        }).subscribe({
            next: () => this.router.navigate(['/games']),
            error: err => console.error('Založení hry selhalo', err)
        })
    }
}
