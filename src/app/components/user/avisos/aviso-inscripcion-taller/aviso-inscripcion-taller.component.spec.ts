import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoInscripcionTallerComponent } from './aviso-inscripcion-taller.component';

describe('AvisoInscripcionTallerComponent', () => {
  let component: AvisoInscripcionTallerComponent;
  let fixture: ComponentFixture<AvisoInscripcionTallerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisoInscripcionTallerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoInscripcionTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
