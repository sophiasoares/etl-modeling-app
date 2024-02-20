import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupNodeSettingsComponent } from './group-node-settings.component';

describe('GroupNodeSettingsComponent', () => {
  let component: GroupNodeSettingsComponent;
  let fixture: ComponentFixture<GroupNodeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupNodeSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupNodeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
