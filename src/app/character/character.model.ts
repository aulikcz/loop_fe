export interface Character {
  id: number;
  name: string;
  systemCode: string;
  templateVersion: number;
  sheet: Record<string, unknown>;
}

export interface CreateCharacterRequest {
  name: string;
  systemCode: string;
  sheet?: Record<string, unknown>;
}

export interface UpdateCharacterRequest {
  name: string;
  sheet: Record<string, unknown>;
}