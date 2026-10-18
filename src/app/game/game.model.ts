export interface GameListItem {
    id: number;
    name: string;
    gameSystem: string;
    playerRole: 'NARRATOR' | 'PLAYER';
}

export interface CreateGameRequest {
    name: string;
    gameSystemCode: string;
}