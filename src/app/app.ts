import { Component, inject, signal } from '@angular/core';
import { GameSystem } from './game-system/game-system.model';
import { GameSystemService } from './game-system/game-system.service';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  gameSystems = signal<GameSystem[]>([]);
  private gameSystemService = inject(GameSystemService);
  load() {
    this.gameSystemService.getAll()
      .subscribe({
        next: r => this.gameSystems.set(r),
        error: err => console.error('Failed on loading', err)
      });
  }
}