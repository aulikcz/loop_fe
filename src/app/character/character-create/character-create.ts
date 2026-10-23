import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { GameSystem } from '../../game-system/game-system.model';
import { GameSystemService } from '../../game-system/game-system.service';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-create',
  imports: [RouterLink],
  templateUrl: './character-create.html',
})
export class CharacterCreate implements OnInit {
  private characterService = inject(CharacterService);
  private gameSystemService = inject(GameSystemService);
  private router = inject(Router);

  systems = signal<GameSystem[]>([]);
  name = signal('');
  systemCode = signal('');
  loading = signal(false);
  error = signal('');

  ngOnInit() {
    this.gameSystemService.getAll()
      .subscribe({
        next: r => this.systems.set(r),
        error: err => console.error('Herní systémy se nepodařilo načíst.', err)
      });
  }

  submit() {
    this.loading.set(true);
    this.error.set('');

    this.characterService
      .create({ name: this.name().trim(), systemCode: this.systemCode() })
      .subscribe({
        next: () => this.router.navigate(['/characters']),
        error: () => {
          this.error.set('Postavu se nepodařilo vytvořit.');
          this.loading.set(false);
        },
      });
  }
}
