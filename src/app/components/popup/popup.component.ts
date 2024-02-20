import { Component, OnInit, ViewChild, Type } from '@angular/core';
import { InsertionDirective } from '../../directives/insertion.directive'; 
import { NodeBase } from '../../models/node';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {
  @ViewChild(InsertionDirective, {static: true}) insertionPoint!: InsertionDirective;

  ngOnInit(): void {}

  loadComponent(node: NodeBase): void {
    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(node.getSettingsComponent());
    // If you need to pass data to the component, do so here:
    // componentRef.instance.someInput = someValue;
  }

}
