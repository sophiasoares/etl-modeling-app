import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlModelingAreaComponent } from './etl-modeling-area.component';

describe('EtlModelingAreaComponent', () => {
  let component: EtlModelingAreaComponent;
  let fixture: ComponentFixture<EtlModelingAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtlModelingAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EtlModelingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
