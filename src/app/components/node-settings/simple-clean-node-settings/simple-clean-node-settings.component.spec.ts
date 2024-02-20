import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCleanNodeSettingsComponent } from './simple-clean-node-settings.component';

describe('SimpleCleanNodeSettingsComponent', () => {
  let component: SimpleCleanNodeSettingsComponent;
  let fixture: ComponentFixture<SimpleCleanNodeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleCleanNodeSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleCleanNodeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
