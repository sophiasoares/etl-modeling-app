import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, copyArrayItem, DragDropModule, CdkDragExit } from '@angular/cdk/drag-drop';
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

  updateViewBox() {
    // Can be used to zoom in and out
    const viewSizeWidth = 500; 
    const viewSizeHeight = 400;
    this.viewBox = `0 0 ${viewSizeWidth} ${viewSizeHeight}`;
    // TODO: use the size of the window to determine the viewBox, but consider the left panel
    // this.viewBox = `0 0 ${window.innerWidth} ${window.innerHeight}`;
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

  drop(event: CdkDragDrop<NodeItem[]>) {
    if (event.previousContainer !== event.container) {
      copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Remove any temporary items from the source container
      event.previousContainer.data = event.previousContainer.data.filter(item => !item.temp);
    }
  
    // If it's the same container, Angular CDK handles reordering, but you might still need to clean up temporary items
    this.nodes = this.nodes.filter(item => !item.temp);
  }

  exited(event: CdkDragExit<NodeItem[]>) {
    // Safely access the first element if event.item.data is mistakenly treated as an array
    const itemBeingDragged = Array.isArray(event.item.data) ? event.item.data[0] : event.item.data;
  
    // Check if the item is valid and not already marked as a temporary item
    if (itemBeingDragged && !itemBeingDragged.temp) {
      const tempItem: NodeItem = { ...itemBeingDragged, temp: true };
      const currentIdx = this.nodes.findIndex(node => node.id === itemBeingDragged.id);
  
      if (currentIdx > -1) {
        // Insert the temporary item at the current index
        this.nodes.splice(currentIdx + 1, 0, tempItem);
      }
    }
  }
  
  
  entered() {
    this.nodes = this.nodes.filter(node => !node.temp);
    // TODO: not allow to enter the pink panel
  }






  // --------------- using mouse events -----------------

  // startDrag(event: MouseEvent, node: number) {
  //   // Prevent any default browser behavior
  //   event.preventDefault();

  //   // Create a clone of the node element
  //   const clone = this.createClone(event.target as HTMLElement);

  //   // Add custom logic to track the movement of the clone
  //   const move = (moveEvent: MouseEvent) => {
  //     clone.style.left = `${moveEvent.pageX}px`;
  //     clone.style.top = `${moveEvent.pageY}px`;
  //   };

  //   // Add mouse move event listener to document
  //   document.addEventListener('mousemove', move);

  //   // Add mouse up event listener to document
  //   document.addEventListener('mouseup', () => {
  //     document.removeEventListener('mousemove', move);
  //     clone.remove(); // Remove the clone after dropping
  //     // Add logic to handle the drop, e.g., add node to gridNodes
  //   }, { once: true });
  // }

  // private createClone(element: HTMLElement): HTMLElement {
  //   const clone = element.cloneNode(true) as HTMLElement;
  //   // Set the styles to position the clone at the mouse cursor
  //   const rect = element.getBoundingClientRect();
  //   clone.style.position = 'absolute';
  //   clone.style.left = `${rect.left}px`;
  //   clone.style.top = `${rect.top}px`;
  //   clone.classList.add('dragging-clone');
  //   document.body.appendChild(clone);
  //   return clone;
  // }



  // --------------- using render and mouse events -----------------

  // startDrag(event: MouseEvent, node: number) {
  //   this.clone = this.createClone(event.target as HTMLElement, node);

  //   // Define the move function
  //   this.dragMoveListener = this.renderer.listen('document', 'mousemove', (moveEvent: MouseEvent) => {
  //     this.moveClone(moveEvent);
  //   });

  //   // Define the mouseup function and remove the listeners after mouseup
  //   this.dragEndListener = this.renderer.listen('document', 'mouseup', () => {
  //     if (this.clone) {
  //       this.renderer.removeChild(document.body, this.clone);
  //       this.clone = null;
  //     }
  //     // Remove event listeners
  //     if (this.dragMoveListener) this.dragMoveListener();
  //     if (this.dragEndListener) this.dragEndListener();
  //   });
  // }

  // private moveClone(moveEvent: MouseEvent) {
  //   if (this.clone) {
  //     this.renderer.setStyle(this.clone, 'left', `${moveEvent.pageX - window.scrollX}px`);
  //     this.renderer.setStyle(this.clone, 'top', `${moveEvent.pageY - window.scrollY}px`);
  //   }
  // }

  // private createClone(element: HTMLElement, node: number): HTMLElement {
  //   const clone = element.cloneNode(true) as HTMLElement;
  //   this.renderer.setStyle(clone, 'position', 'fixed');
  //   this.renderer.setStyle(clone, 'pointerEvents', 'none');
  //   this.renderer.setStyle(clone, 'opacity', '0.7');
  //   this.renderer.setStyle(clone, 'left', `${element.getBoundingClientRect().left}px`);
  //   this.renderer.setStyle(clone, 'top', `${element.getBoundingClientRect().top}px`);
  //   this.renderer.appendChild(document.body, clone);
  //   return clone;
  // }

  
}

