import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { GameViewService } from '../game-view.service';
import { GameCharacterListItem, GameInfo, InviteInfo } from '../game-view.model';

@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, RouterOutlet, DatePipe],
  templateUrl: './game-detail.html',
})
export class GameDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viewService = inject(GameViewService);

  private gameId = Number(this.route.snapshot.paramMap.get('id'));

  game = signal<GameInfo | null>(null);
  characters = signal<GameCharacterListItem[]>([]);
  invite = signal<InviteInfo | null>(null);
  loading = signal(true);
  error = signal('');
  inviteError = signal('');
  copied = signal(false);

  isNarrator = computed(() => this.game()?.playerRole === 'NARRATOR');
  inviteExpired = computed(() => {
    const i = this.invite();
    return !!i && new Date(i.expiresAt).getTime() < Date.now();
  });

  constructor() {
    // po zavření okna s kartou se seznam načte znovu (mohlo se změnit jméno postavy)
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.loadCharacters());
  }

  ngOnInit() {
    if (!Number.isInteger(this.gameId)) {
      this.error.set('Hra nenalezena.');
      this.loading.set(false);
      return;
    }
    this.viewService.game(this.gameId).subscribe({
      next: (g) => {
        this.game.set(g);
        this.loading.set(false);
        this.loadCharacters();
        if (g.playerRole === 'NARRATOR') {
          this.loadInvite();
        }
      },
      error: () => {
        this.error.set('Hra nenalezena.');
        this.loading.set(false);
      },
    });
  }

  loadCharacters() {
    this.viewService.characters(this.gameId).subscribe({
      next: (c) => this.characters.set(c),
      error: () => this.characters.set([]),
    });
  }

  loadInvite() {
    this.viewService.invite(this.gameId).subscribe({
      next: (i) => this.invite.set(i),
      error: () => this.invite.set(null),
    });
  }

  regenerate() {
    this.inviteError.set('');
    this.viewService.regenerateInvite(this.gameId).subscribe({
      next: (i) => this.invite.set(i),
      error: () => this.inviteError.set('Kód se nepodařilo vytvořit.'),
    });
  }

  copy() {
    const i = this.invite();
    if (!i) return;
    navigator.clipboard.writeText(i.code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}