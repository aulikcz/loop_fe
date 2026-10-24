import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCharacterModal } from './game-character-modal';

describe('GameCharacterModal', () => {
  let component: GameCharacterModal;
  let fixture: ComponentFixture<GameCharacterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCharacterModal],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCharacterModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
