import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../character.model';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-list',
  imports: [RouterLink],
  templateUrl: './character-list.html',
})
export class CharacterList {
  private characterService = inject(CharacterService);

  characters = signal<Character[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
        this.characterService.list()
            .subscribe({
                next: r => {
                  this.characters.set(r);
                  this.loading.set(false);
                },
                error: err => {
                  console.error('Failed on loading', err);
                  this.error.set('Postavy se nepodařilo načíst.');
                  this.loading.set(false);
                }
            });
    }
}
