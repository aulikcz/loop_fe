export const ATTRS = ['body', 'tech', 'heart', 'mind'] as const;

export const SKILLS: Record<(typeof ATTRS)[number], string[]> = {
  body: ['sneak', 'force', 'move'],
  tech: ['tinker', 'program', 'calculate'],
  heart: ['contact', 'charm', 'lead'],
  mind: ['investigate', 'comprehend', 'empathize'],
};

export const CONDITIONS = ['upset', 'scared', 'exhausted', 'injured', 'broken'] as const;

export const ARCHETYPES = [
  'The Bookworm',
  'The Hick',
  'The Jock',
  'The Computer Geek',
  'The Popular Kid',
  'The Rocker',
  'The Troublemaker',
  'The Weirdo',
];

export interface LoopSheetData {
  age: number;
  archetype: string;
  attrs: { body: number; tech: number; heart: number; mind: number };
  skills: Record<string, number>;
  conditions: {
    upset: boolean;
    scared: boolean;
    exhausted: boolean;
    injured: boolean;
    broken: boolean;
  };
  luckUsed: number[];
  drive: string;
  anchor: string;
  problem: string;
  pride: string;
  relationships: string;
  items: string;
  hideout: string;
  xp: number;
  notes: string;
}

export function defaultLoopSheet(): LoopSheetData {
  return {
    age: 12,
    archetype: 'The Bookworm',
    attrs: { body: 2, tech: 2, heart: 2, mind: 2 },
    skills: {
      sneak: 0, force: 0, move: 0,
      tinker: 0, program: 0, calculate: 0,
      contact: 0, charm: 0, lead: 0,
      investigate: 0, comprehend: 0, empathize: 0,
    },
    conditions: { upset: false, scared: false, exhausted: false, injured: false, broken: false },
    luckUsed: [],
    drive: '',
    anchor: '',
    problem: '',
    pride: '',
    relationships: '',
    items: '',
    hideout: '',
    xp: 0,
    notes: '',
  };
}

export function toLoopSheet(raw: Record<string, unknown>): LoopSheetData {
  const d = defaultLoopSheet();
  const r = raw as Partial<LoopSheetData>;
  return {
    ...d,
    ...r,
    attrs: { ...d.attrs, ...r.attrs },
    skills: { ...d.skills, ...r.skills },
    conditions: { ...d.conditions, ...r.conditions },
  };
}

export function luckMax(age: number): number {
  return Math.max(0, 15 - age);
}