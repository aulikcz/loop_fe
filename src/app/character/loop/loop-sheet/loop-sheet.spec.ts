import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoopSheet } from './loop-sheet';

describe('LoopSheet', () => {
  let component: LoopSheet;
  let fixture: ComponentFixture<LoopSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoopSheet],
    }).compileComponents();

    fixture = TestBed.createComponent(LoopSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
