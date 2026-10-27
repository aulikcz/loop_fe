export const FL_ATTRS = ['strength', 'agility', 'wits', 'empathy'] as const;
export type FlAttr = (typeof FL_ATTRS)[number];

// Rozdělení dovedností podle forbidden-sheets.com (Crafting patří pod Strength)
export const FL_SKILLS: Record<FlAttr, string[]> = {
  strength: ['might', 'endurance', 'melee', 'crafting'],
  agility: ['stealth', 'sleight of hand', 'move', 'marksmanship'],
  wits: ['scouting', 'lore', 'survival', 'insight'],
  empathy: ['manipulation', 'performance', 'healing', 'animal handling'],
};

export const FL_KINS = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Goblin', 'Wolfkin', 'Orc'];
export const FL_PROFESSIONS = [
  'Druid',
  'Fighter',
  'Hunter',
  'Minstrel',
  'Peddler',
  'Rider',
  'Rogue',
  'Sorcerer',
];
export const FL_AGES = ['Young', 'Adult', 'Old'];

export const FL_CONDITIONS = ['sleepless', 'thirsty', 'hungry', 'cold'] as const;
export const FL_CONSUMABLES = ['food', 'water', 'arrows', 'torches'] as const;
export type FlConsumable = (typeof FL_CONSUMABLES)[number];

// Kostka zásob: 0 = nic, jinak počet stěn (d6, d8, d10, d12)
export const FL_SUPPLY_DICE = [0, 6, 8, 10, 12];

// Váha předmětu (0, ¼, ½, 1, 2)
export const FL_WEIGHTS = [0, 0.25, 0.5, 1, 2];
export const FL_WEIGHT_LABELS: Record<number, string> = {
  0: '0',
  0.25: '¼',
  0.5: '½',
  1: '1',
  2: '2',
};

// Předpoklady pravidel – případně upravit na jednom místě
export const FL_CAPACITY_PER_STRENGTH = 2;
export const FL_COINS_PER_WEIGHT = 100;

export interface FlRankedEntry {
  name: string;
  rank: number; // 1–3
}

export interface FlArmorPiece {
  name: string;
  rating: number;
  weight: number;
}

export interface FlWeapon {
  name: string;
  bonus: number;
  damage: number;
  range: string;
  weight: number;
  comment: string;
}

export interface FlGearItem {
  name: string;
  weight: number;
  note: string;
}

export interface ForbiddenLandsSheetData {
  kin: string;
  profession: string;
  age: string;
  face: string;
  body: string;
  clothing: string;
  attrs: Record<FlAttr, number>;
  damage: Record<FlAttr, number>;
  skills: Record<string, number>;
  conditions: Record<string, boolean>;
  criticalInjuries: string;
  willpower: number;
  xp: number;
  reputation: number;
  pride: string;
  darkSecret: string;
  talents: FlRankedEntry[];
  spells: FlRankedEntry[];
  helmet: FlArmorPiece;
  armor: FlArmorPiece;
  shield: FlArmorPiece;
  weapons: FlWeapon[];
  gear: FlGearItem[];
  capacityBonus: number;
  coins: { gold: number; silver: number; copper: number };
  consumables: Record<FlConsumable, number>;
  mount: { name: string; strength: number; agility: number; notes: string };
  relationships: string;
  notes: string;
}

function emptyPiece(): FlArmorPiece {
  return { name: '', rating: 0, weight: 1 };
}

export function defaultForbiddenLandsSheet(): ForbiddenLandsSheetData {
  const skills: Record<string, number> = {};
  for (const attr of FL_ATTRS) {
    for (const s of FL_SKILLS[attr]) skills[s] = 0;
  }
  return {
    kin: '',
    profession: '',
    age: '',
    face: '',
    body: '',
    clothing: '',
    attrs: { strength: 2, agility: 2, wits: 2, empathy: 2 },
    damage: { strength: 0, agility: 0, wits: 0, empathy: 0 },
    skills,
    conditions: { sleepless: false, thirsty: false, hungry: false, cold: false },
    criticalInjuries: '',
    willpower: 0,
    xp: 0,
    reputation: 0,
    pride: '',
    darkSecret: '',
    talents: [],
    spells: [],
    helmet: emptyPiece(),
    armor: emptyPiece(),
    shield: emptyPiece(),
    weapons: [],
    gear: [],
    capacityBonus: 0,
    coins: { gold: 0, silver: 0, copper: 0 },
    consumables: { food: 0, water: 0, arrows: 0, torches: 0 },
    mount: { name: '', strength: 0, agility: 0, notes: '' },
    relationships: '',
    notes: '',
  };
}

export function toForbiddenLandsSheet(raw: Record<string, unknown>): ForbiddenLandsSheetData {
  const d = defaultForbiddenLandsSheet();
  const r = raw as Partial<ForbiddenLandsSheetData>;
  return {
    ...d,
    ...r,
    attrs: { ...d.attrs, ...r.attrs },
    damage: { ...d.damage, ...r.damage },
    skills: { ...d.skills, ...r.skills },
    conditions: { ...d.conditions, ...r.conditions },
    helmet: { ...d.helmet, ...r.helmet },
    armor: { ...d.armor, ...r.armor },
    shield: { ...d.shield, ...r.shield },
    coins: { ...d.coins, ...r.coins },
    consumables: { ...d.consumables, ...r.consumables },
    mount: { ...d.mount, ...r.mount },
    talents: r.talents ?? [],
    spells: r.spells ?? [],
    weapons: r.weapons ?? [],
    gear: r.gear ?? [],
  };
}

export function emptyFlRanked(): FlRankedEntry {
  return { name: '', rank: 1 };
}

export function emptyFlWeapon(): FlWeapon {
  return { name: '', bonus: 0, damage: 1, range: '', weight: 1, comment: '' };
}

export function emptyFlGear(): FlGearItem {
  return { name: '', weight: 1, note: '' };
}
