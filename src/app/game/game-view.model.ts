export interface GameInfo {
  id: number;
  name: string;
  gameSystem: string;
  gameSystemCode: string;
  playerRole: string;
}

export interface GameCharacterListItem {
  id: number;
  name: string;
  systemCode: string;
  ownerName: string;
  mine: boolean;
}

export interface GameCharacterDetail {
  id: number;
  name: string;
  systemCode: string;
  templateVersion: number;
  sheet: Record<string, unknown>;
  ownerName: string;
  canEdit: boolean;
}

export interface InviteInfo {
  code: string;
  expiresAt: string;
}