import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePanelComponent } from './node-panel.component';

describe('NodePanelComponent', () => {
  let component: NodePanelComponent;
  let fixture: ComponentFixture<NodePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
