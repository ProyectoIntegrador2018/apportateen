import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalleresInscritosComponent } from './talleres-inscritos.component';

describe('TalleresInscritosComponent', () => {
  let component: TalleresInscritosComponent;
  let fixture: ComponentFixture<TalleresInscritosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalleresInscritosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalleresInscritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
