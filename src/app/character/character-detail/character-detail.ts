import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Character } from '../character.model';
import { CharacterService } from '../character.service';
import { LoopSheet } from '../loop/loop-sheet/loop-sheet';
import { VaesenSheet } from '../vaesen/vaesen-sheet/vaesen-sheet';
import { ForbiddenLandsSheet } from '../forbidden-lands/forbidden-lands-sheet/forbidden-lands-sheet';
import { applySystemTheme } from '../../core/theme'; 

@Component({
  selector: 'app-character-detail',
  imports: [RouterLink, JsonPipe, LoopSheet, VaesenSheet, ForbiddenLandsSheet],
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
  code = signal('');
  joinError = signal('');
  joining = signal(false);

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
        applySystemTheme(c.systemCode);
      },
      error: () => {
        this.error.set('Postava nenalezena.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy() {
    applySystemTheme(null);
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

  join() {
    const c = this.character();
    if (!c) return;
    this.joining.set(true);
    this.joinError.set('');
    this.characterService.join(c.id, this.code()).subscribe({
      next: (updated) => {
        this.character.set(updated);
        this.code.set('');
        this.joining.set(false);
      },
      error: (err) => {
        this.joining.set(false);
        this.joinError.set(
          err.status === 409
            ? 'Postava už je ve hře.'
            : 'Neplatný nebo vypršelý kód, nebo jiný herní systém.',
        );
      },
    });
  }

  leave() {
    const c = this.character();
    if (!c) return;
    this.characterService.leave(c.id).subscribe({
      next: (updated) => this.character.set(updated),
      error: () => this.joinError.set('Odpojení se nepovedlo.'),
    });
  }
}