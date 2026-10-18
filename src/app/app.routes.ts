import { Routes } from '@angular/router';
import { GameList } from './game/game-list/game-list';
import { GameCreate } from './game/game-create/game-create';

export const routes: Routes = [{ path: 'games', component: GameList }, { path: 'games/new', component: GameCreate }];