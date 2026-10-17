import { Component, inject, Inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { GameSystem } from './game-system/game-system.model';
import { GameSystemService } from './game-system/game-system.service';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="load()">Načíst Game Systems</button>
    @for (gs of gameSystems(); track gs.id) {
     <p>{{ gs.name }} ({{ gs.code }})</p>
   }
  `,
})
export class App {
  gameSystems = signal<GameSystem[]>([]);
  private gameServiceSystem = inject(GameSystemService);
  load() {
    this.gameServiceSystem.getAll()
      .subscribe({
        next: r => this.gameSystems.set(r),
        error: err => console.error('Failed on loading', err)
      });
  }
}