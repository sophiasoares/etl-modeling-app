import { Component, AfterViewInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-etl-modeling-area',
  standalone: true,
  imports: [],
  templateUrl: './etl-modeling-area.component.html',
  styleUrl: './etl-modeling-area.component.scss'
})
export class EtlModelingAreaComponent {
  jsPlumbInstance: any = null;

  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
  }

  addNode() {
    // Logic to add a node
  }

  moveNode() {
    // Logic to update node position
  }

  connectNodes(sourceId: string, targetId: string) {
    // Logic to connect two nodes
  }


}
