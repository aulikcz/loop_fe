export const VAESEN_ATTRS = ['physique', 'precision', 'logic', 'empathy'] as const;
export type VaesenAttr = (typeof VAESEN_ATTRS)[number];

// Dovednosti seskupené podle atributu (podle oficiální karty Free League)
export const VAESEN_SKILLS: Record<VaesenAttr, string[]> = {
  physique: ['agility', 'close combat', 'force'],
  precision: ['medicine', 'ranged combat', 'stealth'],
  logic: ['investigation', 'learning', 'vigilance'],
  empathy: ['inspiration', 'manipulation', 'observation'],
};

export const PHYSICAL_CONDITIONS = ['exhausted', 'battered', 'wounded', 'broken'] as const;
export const MENTAL_CONDITIONS = ['angry', 'frightened', 'hopeless', 'broken'] as const;

export const VAESEN_AGE_GROUPS = ['Young', 'Middle-aged', 'Old'];

// Jen nápověda (datalist) – archetyp jde napsat i vlastní
export const VAESEN_ARCHETYPES = [
  'Academic',
  'Aristocrat',
  'Detective',
  'Doctor',
  'Hunter',
  'Journalist',
  'Occultist',
  'Officer',
  'Priest',
  'Servant',
];

export interface VaesenTalent {
  name: string;
  note: string;
}

export interface VaesenWeapon {
  name: string;
  bonus: number;
  damage: number;
  range: string;
}

export interface VaesenArmor {
  name: string;
  protection: number;
  agility: number;
}

export interface VaesenSheetData {
  ageGroup: string;
  archetype: string;
  attrs: Record<VaesenAttr, number>;
  skills: Record<string, number>;
  resources: number;
  xp: number;
  physical: Record<string, boolean>;
  mental: Record<string, boolean>;
  motivation: string;
  trauma: string;
  darkSecret: string;
  relationships: string[]; // PC 1 – PC 4
  talents: VaesenTalent[];
  armor: VaesenArmor;
  weapons: VaesenWeapon[];
  equipment: string;
  memento: string;
  advantages: string;
  insightsAndDefects: string;
  notes: string;
}

function flags(names: readonly string[]): Record<string, boolean> {
  return Object.fromEntries(names.map((n) => [n, false]));
}

export function defaultVaesenSheet(): VaesenSheetData {
  const skills: Record<string, number> = {};
  for (const attr of VAESEN_ATTRS) {
    for (const s of VAESEN_SKILLS[attr]) skills[s] = 0;
  }
  return {
    ageGroup: '',
    archetype: '',
    attrs: { physique: 2, precision: 2, logic: 2, empathy: 2 },
    skills,
    resources: 0,
    xp: 0,
    physical: flags(PHYSICAL_CONDITIONS),
    mental: flags(MENTAL_CONDITIONS),
    motivation: '',
    trauma: '',
    darkSecret: '',
    relationships: ['', '', '', ''],
    talents: [],
    armor: { name: '', protection: 0, agility: 0 },
    weapons: [],
    equipment: '',
    memento: '',
    advantages: '',
    insightsAndDefects: '',
    notes: '',
  };
}

export function toVaesenSheet(raw: Record<string, unknown>): VaesenSheetData {
  const d = defaultVaesenSheet();
  const r = raw as Partial<VaesenSheetData>;
  return {
    ...d,
    ...r,
    attrs: { ...d.attrs, ...r.attrs },
    skills: { ...d.skills, ...r.skills },
    physical: { ...d.physical, ...r.physical },
    mental: { ...d.mental, ...r.mental },
    armor: { ...d.armor, ...r.armor },
    relationships: d.relationships.map((_, i) => r.relationships?.[i] ?? ''),
    talents: r.talents ?? [],
    weapons: r.weapons ?? [],
  };
}

export function emptyVaesenTalent(): VaesenTalent {
  return { name: '', note: '' };
}

export function emptyVaesenWeapon(): VaesenWeapon {
  return { name: '', bonus: 0, damage: 1, range: '' };
}
