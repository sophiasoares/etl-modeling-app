import { Component, Input, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, copyArrayItem, moveItemInArray, DragDropModule, CdkDragExit, CdkDropList, CdkDragEnter } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NodeItem } from '../models/node';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnChanges {
  @Input() size: number;
  @ViewChild('gridList', { static: false }) gridList!: CdkDropList;
  @ViewChild('nodeList', { static: false }) nodeList!: CdkDropList;
  viewBox: string = '0 0 500 500';
  gridLines: any[] = [];
  nodes: NodeItem[] = Array(15).fill(0).map((x,i)=> { return { title: `Node ${i}`, id: i }; });
  gridNodes: NodeItem[] = [];

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
  

  // Method to update the viewBox based on the size of the view
  updateViewBox() {
    // Can be used to zoom in and out
    const viewSizeWidth = 500; 
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


  // Method to calculate the position of a node relative to the grid
  calculateGridPosition(dropX: number, dropY: number, gridElement: HTMLElement): {left: number, top: number} {
    const gridRect = gridElement.getBoundingClientRect();
    const left = dropX - gridRect.left;
    const top = dropY - gridRect.top;
    return { left, top };
  }


  // Method to handle dropping a node
  drop(event: CdkDragDrop<NodeItem[]>) {
    // Dragging within the same container
    if (event.previousContainer === event.container) {
      // If moving a node within the grid, replace it
      // If moving a node within the node panel, do nothing
      if (event.container.id === this.gridList.id) {
        this.handleGridReorder(event);
      } else { // TODO: remove else
        console.log('Dropping from the panel to the panel');
      }
    } else {
      // Dragging from the panel to the grid
      if (event.previousContainer.id === this.nodeList.id && event.container.id === this.gridList.id) {
        this.handlePanelToGridDrop(event);
      }
    }
  }


  // Method to handle reordering of nodes within the grid
  handleGridReorder(event: CdkDragDrop<NodeItem[]>) {
    // Move item within gridNodes
    moveItemInArray(this.gridNodes, event.previousIndex, event.currentIndex);
    // Update position based on drop point
    const item = this.gridNodes[event.currentIndex];
    const dropPointRelative = this.calculateGridPosition(event.dropPoint.x, event.dropPoint.y, event.container.element.nativeElement);
    item.position = dropPointRelative;
  }


  // Method to handle dropping a node from the panel to the grid
  handlePanelToGridDrop(event: CdkDragDrop<NodeItem[]>) {
    let itemCopy: NodeItem = { ...event.item.data as NodeItem, temp: false };
    // Calculate and set the position for the dropped item
    const dropPointRelative = this.calculateGridPosition(event.dropPoint.x, event.dropPoint.y, event.container.element.nativeElement);
    itemCopy.position = dropPointRelative;
    this.gridNodes.push(itemCopy);

    // Remove any temporary items from the panel's list
    this.nodes = this.nodes.filter(item => !item.temp);
  }


  // Method to handle exiting a node from a container
  exited(event: CdkDragExit<NodeItem[]>) {
    // Safely access the first element if event.item.data is mistakenly treated as an array
    const nodeBeingDragged = Array.isArray(event.item.data) ? event.item.data[0] : event.item.data;
  
    // Check if the node is valid and not already marked as a temporary node
    if (nodeBeingDragged && !nodeBeingDragged.temp) {
      const tempNode: NodeItem = { ...nodeBeingDragged, temp: true };
      const currentIdx = this.nodes.findIndex(node => node.id === nodeBeingDragged.id);
  
      if (currentIdx > -1) {
        // Insert the temporary node at the current index
        this.nodes.splice(currentIdx + 1, 0, tempNode);
      }
    }
  }

  
  // Method to handle entering a node into a container
  entered(event: CdkDragEnter<NodeItem[]>) {
    this.nodes = this.nodes.filter(node => !node.temp);
    // If  the container is the node container, do nothing
    // if (event.container.id === this.nodeList.id) {
    //   console.log('entered node list');
    //   return;
    // }
  }
  
}

