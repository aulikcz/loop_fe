import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Character } from '../character.model';
import { CharacterService } from '../character.service';
import { LoopSheet } from '../loop/loop-sheet/loop-sheet';

@Component({
  selector: 'app-character-detail',
  imports: [RouterLink, JsonPipe, LoopSheet],
  templateUrl: './character-detail.html',
})
export class CharacterDetail implements OnInit {
  private characterService = inject(CharacterService);
  private route = inject(ActivatedRoute);

  character = signal<Character | null>(null);
  name = signal('');
  sheet = signal<Record<string, unknown>>({});
  loading = signal(true);
  error = signal('');
  saving = signal(false);
  message = signal('');

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (idParam === null || !Number.isInteger(id)) {
      this.error.set('Postava nenalezena.');
      this.loading.set(false);
      return;
    }

    this.characterService.get(id).subscribe({
      next: (c) => {
        this.character.set(c);
        this.name.set(c.name);
        this.sheet.set(c.sheet);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Postava nenalezena.');
        this.loading.set(false);
      },
    });
  }

  save() {
    const c = this.character();
    if (!c) return;

    this.saving.set(true);
    this.message.set('');

    this.characterService
      .update(c.id, { name: this.name().trim(), sheet: this.sheet() })
      .subscribe({
        next: (updated) => {
          this.character.set(updated);
          this.saving.set(false);
          this.message.set('Uloženo.');
        },
        error: () => {
          this.saving.set(false);
          this.message.set('Uložení se nepovedlo.');
        },
      });
  }
}