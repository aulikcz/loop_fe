import { Routes } from '@angular/router';
import { GameList } from './game/game-list/game-list';
import { GameCreate } from './game/game-create/game-create';
import { Login } from './auth/login/login';
import { authGuard, guestGuard } from './core/auth.guard';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
import { CharacterList } from './character/character-list/character-list';
import { CharacterCreate } from './character/character-create/character-create';
import { CharacterDetail } from './character/character-detail/character-detail';
import { GameDetail } from './game/game-detail/game-detail';
import { GameCharacterModal } from './game/game-character-modal/game-character-modal';

export const routes: Routes = [
    { path: '', redirectTo: 'games', pathMatch: 'full' },
    { path: 'games', component: GameList, canActivate: [authGuard] }, 
    { path: 'games/new', component: GameCreate, canActivate: [authGuard] }, 
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuard] },
    { path: 'reset-password', component: ResetPassword, canActivate: [guestGuard] },
    { path: 'characters', component: CharacterList, canActivate: [authGuard] },
    { path: 'characters/new', component: CharacterCreate, canActivate: [authGuard] },
    { path: 'characters/:id', component: CharacterDetail, canActivate: [authGuard] },
    {
        path: 'games/:id',
        component: GameDetail,
        canActivate: [authGuard],
        children: [{ path: 'characters/:characterId', component: GameCharacterModal }],
    },
    { path: '**', redirectTo: 'games' }
];