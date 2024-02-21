import { Component, OnInit, ViewChildren, AfterViewInit, AfterContentChecked, ContentChild } from '@angular/core';
import { InsertionDirective } from '../../directives/insertion.directive'; 
import { NodeBase } from '../../models/node';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements AfterViewInit {
  @ContentChild(InsertionDirective) insertionPoint: InsertionDirective | undefined;
  node: NodeBase | undefined; // Store the node

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.node = data.node;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.node) {
        this.loadComponent(this.node);
      }
    }, 0);
  }

  loadComponent(node: NodeBase): void {
    console.log('insertion point: ' + this.insertionPoint);
    const viewContainerRef = this.insertionPoint?.viewContainerRef;
    if (!viewContainerRef) {
      console.log(viewContainerRef);
      console.log(this.insertionPoint);
      console.error('View container not found.');
      return; // Exit if the view container is not found
    }
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(node.getSettingsComponent());
    // If you need to pass data to the component, do so here:
    // componentRef.instance.someInput = someValue;
  }
}
