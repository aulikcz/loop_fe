import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCreate } from './character-create';

describe('CharacterCreate', () => {
  let component: CharacterCreate;
  let fixture: ComponentFixture<CharacterCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
