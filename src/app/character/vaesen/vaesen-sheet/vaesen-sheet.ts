import { Component, computed, input, model } from '@angular/core';
import {
  MENTAL_CONDITIONS,
  PHYSICAL_CONDITIONS,
  VAESEN_AGE_GROUPS,
  VAESEN_ARCHETYPES,
  VAESEN_ATTRS,
  VAESEN_SKILLS,
  VaesenAttr,
  VaesenSheetData,
  emptyVaesenTalent,
  emptyVaesenWeapon,
  toVaesenSheet,
} from '../vaesen-sheet.model';

@Component({
  selector: 'app-vaesen-sheet',
  templateUrl: './vaesen-sheet.html',
})
export class VaesenSheet {
  sheet = model.required<Record<string, unknown>>();
  readonly = input(false);
  data = computed(() => toVaesenSheet(this.sheet()));

  attrs = VAESEN_ATTRS;
  skillGroups = VAESEN_ATTRS.map((a) => ({ attr: a, skills: VAESEN_SKILLS[a] }));
  physicalConditions = PHYSICAL_CONDITIONS;
  mentalConditions = MENTAL_CONDITIONS;
  ageGroups = VAESEN_AGE_GROUPS;
  archetypes = VAESEN_ARCHETYPES;
  levels = [1, 2, 3, 4, 5];
  pcSlots = [0, 1, 2, 3];

  patch(changes: Partial<VaesenSheetData>) {
    this.sheet.set({ ...this.data(), ...changes });
  }

  setText(field: string, value: string) {
    this.patch({ [field]: value } as Partial<VaesenSheetData>);
  }

  setNumber(field: 'xp', value: string) {
    const n = Math.max(0, Math.floor(Number(value)) || 0);
    this.patch({ [field]: n });
  }

  setAttr(name: VaesenAttr, value: number) {
    this.patch({ attrs: { ...this.data().attrs, [name]: value } });
  }

  setSkill(key: string, value: number) {
    const current = this.data().skills[key];
    this.patch({ skills: { ...this.data().skills, [key]: current === value ? 0 : value } });
  }

  // Počet kostek do hodu = atribut + dovednost
  pool(attr: VaesenAttr, skill: string): number {
    return this.data().attrs[attr] + this.data().skills[skill];
  }

  setResources(value: number) {
    this.patch({ resources: this.data().resources === value ? 0 : value });
  }

  toggleCondition(group: 'physical' | 'mental', name: string) {
    const current = this.data()[group];
    this.patch({ [group]: { ...current, [name]: !current[name] } } as Partial<VaesenSheetData>);
  }

  setRelationship(i: number, value: string) {
    const rel = [...this.data().relationships];
    rel[i] = value;
    this.patch({ relationships: rel });
  }

  // --- zbroj ---
  setArmorText(value: string) {
    this.patch({ armor: { ...this.data().armor, name: value } });
  }

  setArmorNumber(field: 'protection' | 'agility', value: string) {
    this.patch({ armor: { ...this.data().armor, [field]: Math.floor(Number(value)) || 0 } });
  }

  // --- talenty ---
  addTalent() {
    this.patch({ talents: [...this.data().talents, emptyVaesenTalent()] });
  }

  setTalent(i: number, field: 'name' | 'note', value: string) {
    this.patch({
      talents: this.data().talents.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    });
  }

  removeTalent(i: number) {
    this.patch({ talents: this.data().talents.filter((_, idx) => idx !== i) });
  }

  // --- zbraně ---
  addWeapon() {
    this.patch({ weapons: [...this.data().weapons, emptyVaesenWeapon()] });
  }

  setWeaponText(i: number, field: 'name' | 'range', value: string) {
    this.patch({
      weapons: this.data().weapons.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)),
    });
  }

  setWeaponNumber(i: number, field: 'bonus' | 'damage', value: string) {
    const n = Math.floor(Number(value)) || 0;
    this.patch({
      weapons: this.data().weapons.map((w, idx) => (idx === i ? { ...w, [field]: n } : w)),
    });
  }

  removeWeapon(i: number) {
    this.patch({ weapons: this.data().weapons.filter((_, idx) => idx !== i) });
  }
}
