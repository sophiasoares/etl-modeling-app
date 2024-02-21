import { Injectable } from '@angular/core';
import { NodeItem, NodeBase } from './models/node';
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

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  gridList!: CdkDropList;
  nodeList!: CdkDropList;
  nodes: NodeItem[] = [];
  gridNodes: NodeItem[] = []; 
  dropLists: CdkDropList[] = [];
  nodeBeingDragged!: NodeItem;
  connectionLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  currentDraggedNode: NodeBase | null = null;

  startDrag(node: NodeBase): void {
    this.currentDraggedNode = node;
  }

  endDrag(): void {
    this.currentDraggedNode = null;
  }

  constructor() {
    this.fillArrays();
  }
  
  // Method to add a drop list to the group
  addDropList(dropList: CdkDropList) {
    // Check the dropList's id and assign it to the correct service property
    if (dropList.id === 'grid-list') {
      this.gridList = dropList;
    } else if (dropList.id === 'node-list') {
      this.nodeList = dropList;
    }
    this.dropLists.push(dropList);
  }


  // Method to remove a drop list from the group
  removeDropList(dropList: CdkDropList) {
    const index = this.dropLists.indexOf(dropList);
    if (index > -1) {
      this.dropLists.splice(index, 1);
    }
  }


  // This method will be used to connect all drop lists in the group
  connectDropLists() {
    this.dropLists.forEach(dropList => {
      if (dropList) {
        dropList.connectedTo = this.dropLists
          .filter(otherList => otherList && otherList !== dropList);
      }
    });
  }


  // Method to handle dropping a node
  drop(event: CdkDragDrop<NodeItem[]>) {
    // Dragging within the same container
    if (event.previousContainer === event.container) {
      // If moving a node within the grid, replace it
      // If moving a node within the node panel, do nothing
      if (event.container.id === this.gridList.id) {
        this.handleGridReorder(event);
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
    itemCopy.id = this.gridNodes.length + 1;
    this.gridNodes.push(itemCopy);

    // Remove any temporary nodes from the panel's list
    this.nodes = this.nodes.filter(node => !node.temp);

    // Update connections
    this.updateConnections(itemCopy);
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
  }


  // Method to handle the start of a drag event
  dragStarted(event: CdkDragStart<NodeItem>) {
    this.nodeBeingDragged = event.source.data;
  }  


  // Method to calculate the position of a node relative to the grid
  calculateGridPosition(dropX: number, dropY: number, gridElement: HTMLElement): {left: number, top: number} {
    const gridRect = gridElement.getBoundingClientRect();
    const left = dropX - gridRect.left;
    const top = dropY - gridRect.top;
    return { left, top };
  }


  // Method to fill the nodes array 
  fillArrays() {
    const titles = [
      'Read CSV', 'Read MySQL', 'Select Columns', 'Filter Columns', 'Simple Clean', 'Group Nodes',
      'Attach File', 'Compare Columns', 'Fill New Column', 'Change Data Type', 'Replace Values',
      'Sort Rows', 'Write CSV', 'Write MySQL',
    ];

    this.nodes = titles.map((title, index) => {
      return { title: title, id: index }; 
    });
  }


  // Method to update the connections between nodes
  updateConnections(newNode: NodeItem) {
    console.log('newNode', newNode);
    // Assuming newNode is the latest node added and has its position set
    const previousNodeId = newNode.id - 1;
    const previousNode = this.gridNodes.find(node => node.id === previousNodeId);
  
    if (previousNode) {
      previousNode.connections = [...(previousNode.connections || []), newNode.id];
      newNode.connections = [...(newNode.connections || []), previousNodeId];
  
      // Calculate the line between the two nodes
      // get the width and height of the node
      setTimeout(() => {
        const startElement = document.getElementById(`node-${previousNode.id}`);
        const endElement = document.getElementById(`node-${newNode.id}`);
        const previousNodeWidth = startElement ? startElement.clientWidth : 0;
        const previousNodeHeight = startElement ? startElement.clientHeight : 0;
        const newNodeWidth = endElement ? endElement.clientWidth : 0;
        const newNodeHeight = endElement ? endElement.clientHeight : 0;

        console.log('endElement', endElement);
        console.log('newNodeWidth', newNodeWidth);
        console.log('newNodeHeight', newNodeHeight); 


        const line = {
          // Right-center of the old node
          x1: previousNode.position!.left + previousNodeWidth, // Right edge of the old node
          y1: previousNode.position!.top + (previousNodeHeight / 2), // Vertical center of the old node
        
          // Left-center of the new node
          x2: newNode.position!.left, // Left edge of the new node
          y2: newNode.position!.top + (newNodeHeight / 2) // Vertical center of the new node
        };        
  
        console.log('line', line);
         // Add this line to your array of lines to be drawn
        this.connectionLines.push(line);
      }, 0);
    }
  }

  
}
