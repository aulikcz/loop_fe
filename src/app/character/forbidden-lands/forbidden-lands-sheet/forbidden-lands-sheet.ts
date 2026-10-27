import { Component, computed, input, model } from '@angular/core';
import {
  FL_AGES,
  FL_ATTRS,
  FL_CAPACITY_PER_STRENGTH,
  FL_COINS_PER_WEIGHT,
  FL_CONDITIONS,
  FL_CONSUMABLES,
  FL_KINS,
  FL_PROFESSIONS,
  FL_SKILLS,
  FL_SUPPLY_DICE,
  FL_WEIGHTS,
  FL_WEIGHT_LABELS,
  FlAttr,
  FlConsumable,
  ForbiddenLandsSheetData,
  emptyFlGear,
  emptyFlRanked,
  emptyFlWeapon,
  toForbiddenLandsSheet,
} from '../forbidden-lands-sheet.model';

type PieceKey = 'helmet' | 'armor' | 'shield';
type RankedKey = 'talents' | 'spells';

@Component({
  selector: 'app-forbidden-lands-sheet',
  templateUrl: './forbidden-lands-sheet.html',
})
export class ForbiddenLandsSheet {
  sheet = model.required<Record<string, unknown>>();
  readonly = input(false);
  data = computed(() => toForbiddenLandsSheet(this.sheet()));

  attrs = FL_ATTRS;
  skillGroups = FL_ATTRS.map((a) => ({ attr: a, skills: FL_SKILLS[a] }));
  kins = FL_KINS;
  professions = FL_PROFESSIONS;
  ages = FL_AGES;
  conditions = FL_CONDITIONS;
  consumableKeys = FL_CONSUMABLES;
  supplyDice = FL_SUPPLY_DICE;
  weights = FL_WEIGHTS;
  weightLabels = FL_WEIGHT_LABELS;
  levels = [1, 2, 3, 4, 5];
  ranks = [1, 2, 3];
  pieces: { key: PieceKey; label: string }[] = [
    { key: 'helmet', label: 'Helmet' },
    { key: 'armor', label: 'Armor' },
    { key: 'shield', label: 'Shield' },
  ];

  // --- odvozené hodnoty (propojení polí) ---
  capacity = computed(
    () => this.data().attrs.strength * FL_CAPACITY_PER_STRENGTH + this.data().capacityBonus,
  );

  carried = computed(() => {
    const d = this.data();
    const sum = (xs: { weight: number }[]) => xs.reduce((s, x) => s + (Number(x.weight) || 0), 0);
    const coins = (d.coins.gold + d.coins.silver + d.coins.copper) / FL_COINS_PER_WEIGHT;
    return sum([d.helmet, d.armor, d.shield]) + sum(d.weapons) + sum(d.gear) + coins;
  });

  carriedLabel = computed(() => Math.round(this.carried() * 100) / 100);
  overloaded = computed(() => this.carried() > this.capacity());

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  currentAttr(attr: FlAttr): number {
    const d = this.data();
    return Math.max(0, d.attrs[attr] - d.damage[attr]);
  }

  isBroken(attr: FlAttr): boolean {
    const d = this.data();
    return d.attrs[attr] > 0 && d.damage[attr] >= d.attrs[attr];
  }

  // Počet kostek do hodu = dovednost + aktuální atribut (po zranění)
  pool(attr: FlAttr, skill: string): number {
    return this.data().skills[skill] + this.currentAttr(attr);
  }

  patch(changes: Partial<ForbiddenLandsSheetData>) {
    this.sheet.set({ ...this.data(), ...changes });
  }

  setText(field: string, value: string) {
    this.patch({ [field]: value } as Partial<ForbiddenLandsSheetData>);
  }

  setNumber(field: 'willpower' | 'xp' | 'reputation' | 'capacityBonus', value: string) {
    const n = Math.floor(Number(value)) || 0;
    this.patch({ [field]: field === 'capacityBonus' ? n : Math.max(0, n) });
  }

  // --- atributy a zranění ---
  setAttr(name: FlAttr, value: number) {
    const d = this.data();
    this.patch({
      attrs: { ...d.attrs, [name]: value },
      damage: { ...d.damage, [name]: Math.min(d.damage[name], value) },
    });
  }

  setDamage(name: FlAttr, value: number) {
    const d = this.data();
    const next = d.damage[name] === value ? value - 1 : value;
    this.patch({ damage: { ...d.damage, [name]: next } });
  }

  setSkill(key: string, value: number) {
    const current = this.data().skills[key];
    this.patch({ skills: { ...this.data().skills, [key]: current === value ? 0 : value } });
  }

  toggleCondition(name: string) {
    const c = this.data().conditions;
    this.patch({ conditions: { ...c, [name]: !c[name] } });
  }

  // --- zbroj ---
  setPieceName(key: PieceKey, value: string) {
    this.patch({ [key]: { ...this.data()[key], name: value } } as Partial<ForbiddenLandsSheetData>);
  }

  setPieceRating(key: PieceKey, value: string) {
    const n = Math.max(0, Math.floor(Number(value)) || 0);
    this.patch({ [key]: { ...this.data()[key], rating: n } } as Partial<ForbiddenLandsSheetData>);
  }

  setPieceWeight(key: PieceKey, value: string) {
    this.patch({
      [key]: { ...this.data()[key], weight: Number(value) || 0 },
    } as Partial<ForbiddenLandsSheetData>);
  }

  // --- talenty a kouzla ---
  addRanked(key: RankedKey) {
    this.patch({ [key]: [...this.data()[key], emptyFlRanked()] } as Partial<ForbiddenLandsSheetData>);
  }

  setRankedName(key: RankedKey, i: number, value: string) {
    this.patch({
      [key]: this.data()[key].map((e, idx) => (idx === i ? { ...e, name: value } : e)),
    } as Partial<ForbiddenLandsSheetData>);
  }

  setRankedRank(key: RankedKey, i: number, rank: number) {
    this.patch({
      [key]: this.data()[key].map((e, idx) => (idx === i ? { ...e, rank } : e)),
    } as Partial<ForbiddenLandsSheetData>);
  }

  removeRanked(key: RankedKey, i: number) {
    this.patch({
      [key]: this.data()[key].filter((_, idx) => idx !== i),
    } as Partial<ForbiddenLandsSheetData>);
  }

  // --- zbraně ---
  addWeapon() {
    this.patch({ weapons: [...this.data().weapons, emptyFlWeapon()] });
  }

  setWeaponText(i: number, field: 'name' | 'range' | 'comment', value: string) {
    this.patch({
      weapons: this.data().weapons.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)),
    });
  }

  setWeaponNumber(i: number, field: 'bonus' | 'damage' | 'weight', value: string) {
    const n = Number(value) || 0;
    this.patch({
      weapons: this.data().weapons.map((w, idx) => (idx === i ? { ...w, [field]: n } : w)),
    });
  }

  removeWeapon(i: number) {
    this.patch({ weapons: this.data().weapons.filter((_, idx) => idx !== i) });
  }

  // --- vybava ---
  addGear() {
    this.patch({ gear: [...this.data().gear, emptyFlGear()] });
  }

  setGearText(i: number, field: 'name' | 'note', value: string) {
    this.patch({
      gear: this.data().gear.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)),
    });
  }

  setGearWeight(i: number, value: string) {
    const n = Number(value) || 0;
    this.patch({
      gear: this.data().gear.map((g, idx) => (idx === i ? { ...g, weight: n } : g)),
    });
  }

  removeGear(i: number) {
    this.patch({ gear: this.data().gear.filter((_, idx) => idx !== i) });
  }

  // --- penize, zasoby, mount ---
  setCoin(field: 'gold' | 'silver' | 'copper', value: string) {
    const n = Math.max(0, Math.floor(Number(value)) || 0);
    this.patch({ coins: { ...this.data().coins, [field]: n } });
  }

  setConsumable(key: FlConsumable, value: string) {
    this.patch({ consumables: { ...this.data().consumables, [key]: Number(value) || 0 } });
  }

  setMountText(field: 'name' | 'notes', value: string) {
    this.patch({ mount: { ...this.data().mount, [field]: value } });
  }

  setMountNumber(field: 'strength' | 'agility', value: string) {
    const n = Math.max(0, Math.floor(Number(value)) || 0);
    this.patch({ mount: { ...this.data().mount, [field]: n } });
  }
}
