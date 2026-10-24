import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GameViewService } from '../game-view.service';
import { GameCharacterDetail } from '../game-view.model';
import { CharacterService } from '../../character/character.service';
import { LoopSheet } from '../../character/loop/loop-sheet/loop-sheet';

@Component({
  selector: 'app-game-character-modal',
  imports: [LoopSheet, JsonPipe],
  templateUrl: './game-character-modal.html',
})
export class GameCharacterModal implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viewService = inject(GameViewService);
  private characterService = inject(CharacterService);

  private gameId = Number(this.route.parent?.snapshot.paramMap.get('id'));
  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  detail = signal<GameCharacterDetail | null>(null);
  name = signal('');
  sheet = signal<Record<string, unknown>>({});
  loading = signal(true);
  error = signal('');
  saving = signal(false);
  message = signal('');

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((p) => this.load(Number(p.get('characterId'))));
  }

  ngAfterViewInit() {
    this.dialog().nativeElement.showModal();
  }

  private load(characterId: number) {
    this.loading.set(true);
    this.error.set('');
    this.message.set('');
    this.viewService.character(this.gameId, characterId).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.name.set(d.name);
        this.sheet.set(d.sheet);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Postava nenalezena.');
        this.loading.set(false);
      },
    });
  }

  closeDialog() {
    this.dialog().nativeElement.close();
  }

  navigateBack() {
    this.router.navigate(['/games', this.gameId]);
  }

  onDialogClick(event: MouseEvent) {
    // kliknutí na ztmavené pozadí (mimo obsah) zavře okno
    if (event.target === this.dialog().nativeElement) {
      this.closeDialog();
    }
  }

  save() {
    const d = this.detail();
    if (!d || !d.canEdit) return;
    this.saving.set(true);
    this.message.set('');
    this.characterService.update(d.id, { name: this.name().trim(), sheet: this.sheet() }).subscribe({
      next: () => {
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