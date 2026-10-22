import { Component, inject, signal } from '@angular/core';
import { GameSystem } from './game-system/game-system.model';
import { GameSystemService } from './game-system/game-system.service';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  gameSystems = signal<GameSystem[]>([]);

  protected auth = inject(AuthService);
  private gameSystemService = inject(GameSystemService);
  private router = inject(Router);

  load() {
    this.gameSystemService.getAll()
      .subscribe({
        next: r => this.gameSystems.set(r),
        error: err => console.error('Failed on loading', err)
      });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}