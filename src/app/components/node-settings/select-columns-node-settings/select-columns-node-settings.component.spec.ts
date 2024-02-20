import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectColumnsNodeSettingsComponent } from './select-columns-node-settings.component';

describe('SelectColumnsNodeSettingsComponent', () => {
  let component: SelectColumnsNodeSettingsComponent;
  let fixture: ComponentFixture<SelectColumnsNodeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectColumnsNodeSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectColumnsNodeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
