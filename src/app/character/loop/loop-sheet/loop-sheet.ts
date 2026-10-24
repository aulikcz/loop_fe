import { Component, computed, input, model } from '@angular/core';
import {
  ARCHETYPES,
  ATTRS,
  CONDITIONS,
  SKILLS,
  LoopSheetData,
  luckMax,
  toLoopSheet,
} from '../loop-sheet.model';

@Component({
  selector: 'app-loop-sheet',
  templateUrl: './loop-sheet.html',
  styleUrl: './loop-sheet.css',
})
export class LoopSheet {
  sheet = model.required<Record<string, unknown>>();
  data = computed(() => toLoopSheet(this.sheet()));

  archetypes = ARCHETYPES;
  attrs = ATTRS;
  conditions = CONDITIONS;
  skillGroups = ATTRS.map((a) => ({ attr: a, skills: SKILLS[a] }));
  levels = [1, 2, 3, 4, 5];
  xpSlots = Array.from({ length: 10 }, (_, i) => i);
  luckSlots = computed(() => Array.from({ length: luckMax(this.data().age) }, (_, i) => i));
  readonly = input(false);

  patch(changes: Partial<LoopSheetData>) {
    this.sheet.set({ ...this.data(), ...changes });
  }

  setAge(value: string) {
    const age = Number(value);
    if (!Number.isInteger(age) || age < 10 || age > 15) return;
    const max = luckMax(age);
    this.patch({ age, luckUsed: this.data().luckUsed.filter((i) => i < max) });
  }

  setAttr(name: (typeof ATTRS)[number], value: number) {
    this.patch({ attrs: { ...this.data().attrs, [name]: value } });
  }

  setSkill(key: string, value: number) {
    const current = this.data().skills[key];
    this.patch({ skills: { ...this.data().skills, [key]: current === value ? 0 : value } });
  }

  toggleCondition(name: (typeof CONDITIONS)[number]) {
    const c = this.data().conditions;
    this.patch({ conditions: { ...c, [name]: !c[name] } });
  }

  toggleLuck(i: number) {
    const used = this.data().luckUsed;
    this.patch({ luckUsed: used.includes(i) ? used.filter((x) => x !== i) : [...used, i] });
  }

  setXp(i: number) {
    const xp = this.data().xp;
    this.patch({ xp: xp === i + 1 ? i : i + 1 });
  }

  setText(field: string, value: string) {
    this.patch({ [field]: value } as Partial<LoopSheetData>);
  }
}