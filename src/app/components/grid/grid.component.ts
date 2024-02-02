import { Component, Input, SimpleChanges, OnChanges, ViewChild, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodeItem } from '../../models/node';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { DragDropService } from '../../drag-drop.service';
import { 
  DragDropModule,
  CdkDragDrop, 
  CdkDragStart, 
  CdkDragEnd,
  CdkDragExit, 
  CdkDropList, 
  CdkDragEnter,
  moveItemInArray
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, SettingsPanelComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() size: number;
  @Output() selectedNodeEmitter = new EventEmitter<NodeItem>();
  @ViewChild('gridList', { static: false }) dropList!: CdkDropList;
  viewBox: string = '0 0 500 500';
  gridLines: any[] = [];
  selectedNode: NodeItem | null = null;

  constructor(protected dragDropService: DragDropService) {
    this.size = 20; // default grid size
    this.updateViewBox();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['size']) {
      this.updateViewBox();
      this.createGridLines();
    }
  }

  ngOnDestroy() {
    this.dragDropService.removeDropList(this.dropList);
  }

  ngAfterViewInit() {
    // Use setTimeout to ensure change detection cycle is complete and view is fully initialized
    setTimeout(() => {
      this.dragDropService.addDropList(this.dropList);
      this.dragDropService.connectDropLists();
    });
  }

  // Method to update the viewBox based on the size of the view
  updateViewBox() {
    // Can be used to zoom in and out
    const viewSizeWidth = 600; 
    const viewSizeHeight = 400;
    this.viewBox = `0 0 ${viewSizeWidth} ${viewSizeHeight}`;
    // TODO: use the size of the window to determine the viewBox, but consider the left panel
    // this.viewBox = `0 0 ${window.innerWidth} ${window.innerHeight}`;
  }


  // Method to create the grid lines
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

  // Method to handle node click
  onNodeClick(node: NodeItem) {
    this.selectedNodeEmitter.emit(node); 
    this.selectedNode = node;
  }

  
}

