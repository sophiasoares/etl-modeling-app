import { Injectable } from '@angular/core';
import { NodeItem } from './models/node';
import { ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
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
export class DragDropService implements OnInit {
  gridList!: CdkDropList;
  nodeList!: CdkDropList;
  nodes: NodeItem[] = [];
  gridNodes: NodeItem[] = []; 
  dropLists: CdkDropList[] = [];
  nodeBeingDragged!: NodeItem;
  connectionLines: { x1: number; y1: number; x2: number; y2: number }[] = [ 
    //{ x1: 0, y1: 0, x2: 0, y2: 0 }
  ];

  constructor() {
    this.fillArrays();
  }
  
  ngOnInit() {}

  addDropList(dropList: CdkDropList) {
    // Check the dropList's id and assign it to the correct service property
    if (dropList.id === 'grid-list') {
      this.gridList = dropList;
    } else if (dropList.id === 'node-list') {
      this.nodeList = dropList;
    }
    this.dropLists.push(dropList);
  }

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
    // If  the container is the node container, do nothing
    // if (event.container.id === this.nodeList.id) {
    //   console.log('entered node list');
    //   return;
    // }
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

  fillArrays() {
    const titles = [
      'Read CSV', 'Read MySQL', 'Select Columns', 'Filter Columns', 'Simple Clean', 'Group Nodes',
      'Attach File', 'Compare Columns', 'Fill New Column', 'Change Data Type', 'Replace Values',
      'Sort Rows', 'Write CSV', 'Write MySQL',
    ];

    // Fill the nodes array with NodeItems based on the titles
    this.nodes = titles.map((title, index) => {
      return { title: title, id: index }; 
    });
  }


  updateConnections(newNode: NodeItem) {
    // Assuming newNode is the latest node added and has its position set
    const previousNodeId = newNode.id - 1;
    const previousNode = this.gridNodes.find(node => node.id === previousNodeId);
  
    if (previousNode) {
      // Optional: Track connections on the node itself
      previousNode.connections = [...(previousNode.connections || []), newNode.id];
      newNode.connections = [...(newNode.connections || []), previousNodeId];
  
      // Calculate the line between the two nodes
      // get the width and height of the node
      const startElement = document.getElementById(`node-${previousNode.id}`);
      const endElement = document.getElementById(`node-${newNode.id}`);
      const previousNodeWidth = startElement ? startElement.clientWidth : 0;
      const previousNodeHeight = startElement ? startElement.clientHeight : 0;
      const newNodeWidth = endElement ? endElement.clientWidth : 0;
      const newNodeHeight = endElement ? endElement.clientHeight : 0;

      const line = {
        x1: previousNode.position!.left + (previousNodeWidth / 2),
        y1: previousNode.position!.top,
        x2: newNode.position!.left + (newNodeWidth / 2),
        y2: newNode.position!.top + (newNodeHeight / 2),
      };

      console.log('line', line);
  
      // Add this line to your array of lines to be drawn
      this.connectionLines.push(line);
    }
  
    // Ensure you trigger a redraw of your SVG lines if needed
  }
  







  updateConnectionsOld(newNode: NodeItem) {
    const svg = document.querySelector('.connections');
    if (!svg) {
      console.log('No SVG found');
      return;
    }
    svg.innerHTML = ''; // Clear existing lines
  
    this.nodes[0].connections = [3];
    
    if (!this.nodeBeingDragged.connections) {
      console.log('No connections found');
      return;
    }
    
    this.nodes.forEach(node => {
      if (!node.connections) {
        console.log('None found');
        return;
      }

      const startElement = document.getElementById(`node-${node.id}`);
      node.connections.forEach(connectionId => {
        const endElement = document.getElementById(`node-${connectionId}`);
        
        if (startElement && endElement) {
          const startPos = startElement.getBoundingClientRect();
          const endPos = endElement.getBoundingClientRect();
  
          // Calculate start and end positions for the line
          const x1 = startPos.left + startPos.width / 2;
          const y1 = startPos.top + startPos.height / 2;
          const x2 = endPos.left + endPos.width / 2;
          const y2 = endPos.top + endPos.height / 2;
  
          // Create an SVG line element
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1.toString());
          line.setAttribute('y1', y1.toString());
          line.setAttribute('x2', x2.toString());
          line.setAttribute('y2', y2.toString());
          line.setAttribute('stroke', 'black'); // Style as needed
  
          svg.appendChild(line);
        }
      });
    });
  }
  
}
