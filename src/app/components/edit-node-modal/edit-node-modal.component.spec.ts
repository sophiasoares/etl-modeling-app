import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNodeModalComponent } from './edit-node-modal.component';

describe('EditNodeModalComponent', () => {
  let component: EditNodeModalComponent;
  let fixture: ComponentFixture<EditNodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNodeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditNodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
