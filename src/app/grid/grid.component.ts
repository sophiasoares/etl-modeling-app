import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, copyArrayItem, DragDropModule, CdkDragStart } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnChanges {
  @Input() size: number;
  viewBox: string = '0 0 500 500';
  gridLines: any[] = [];
  nodes = Array(20).fill(0).map((x,i)=>i); // creates an array of 20 nodes
  gridNodes: number[] = [];

  constructor() {
    this.size = 20; // default grid size
    this.updateViewBox();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['size']) {
      this.updateViewBox();
      this.createGridLines();
    }
  }

  updateViewBox() {
    // Can be used to zoom in and out
    const viewSizeWidth = 500; 
    const viewSizeHeight = 500;
    this.viewBox = `0 0 ${viewSizeWidth} ${viewSizeHeight}`;
  }

  createGridLines() {
    const lines = [];
    const totalLines = 500 / this.size; 
    for (let i = 0; i <= totalLines; i++) {
      const position = i * this.size;
      // Horizontal lines
      lines.push({ x1: 0, y1: position, x2: 500, y2: position });
      // Vertical lines
      lines.push({ x1: position, y1: 0, x2: position, y2: 500 });
    }
    this.gridLines = lines;
  }

  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      // If the container is the same, we don't want to do anything
      return;
    }
  
    // Only allow adding to the gridNodes and not removing from nodes
    if (event.previousContainer !== event.container) {
      copyArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      console.log('Copied item in array');
    }
  } 

  
}
