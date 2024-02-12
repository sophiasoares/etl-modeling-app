import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { newInstance, BezierConnector } from "@jsplumb/browser-ui";
import { isPlatformBrowser } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EditNodeModalComponent } from '../edit-node-modal/edit-node-modal.component';
import { MyNode } from '../../models/node';

@Component({
  selector: 'app-etl-modeling-area',
  standalone: true,
  imports: [DragDropModule, CommonModule, MatDialogModule, EditNodeModalComponent],
  templateUrl: './etl-modeling-area.component.html',
  styleUrl: './etl-modeling-area.component.scss'
})
export class EtlModelingAreaComponent implements OnInit {
  jsPlumbInstance: any = null;
  nodesInGrid: MyNode[] = [];
  controls: MyNode[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public dialog: MatDialog) {}

  ngOnInit() {
    this.initNodes();
    if (isPlatformBrowser(this.platformId)) {
      this.initializeJsPlumb();
    }
  } 

  initializeJsPlumb() {
    this.jsPlumbInstance = newInstance({
      container: document.getElementById('diagram')!,
    });

    document.getElementById("diagram")!.style.transform = "scale(1.0)"

    const control1 = document.getElementById('control1');
    const control2 = document.getElementById('control2');
    this.jsPlumbInstance.connect({
      source: control1, 
      target: control2,
      anchors:["Right", "Left" ],
      endpoint:"Dot",
      paintStyle: {stroke: "green", strokeWidth: 3},
      hoverPaintStyle: {stroke: "blue", strokeWidth: 5},
      connector:{
        type:BezierConnector.type,
        options:{
            curviness: 50
        }
      }
    });
  }

  openEditModal(element: HTMLElement) {
    const nodeId = element.id;
    console.log(nodeId);
    const nodeData = this.nodesInGrid.find((control: any) => control.id === nodeId);
    if (nodeData) {
      console.log("Node data", nodeData);
      const dialogRef = this.dialog.open(EditNodeModalComponent, {
        width: '350px',
        data: { node: nodeData }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        // Handle the result from your modal here...
      });
    } else {
      console.error('Node data not found for element', element);
    }
  }
  
  onDrop(event: any): void {
    const id = this.uuidv4(); // Generate a unique ID for the new element
    const clone = event.item.element.nativeElement.cloneNode(true);
    clone.setAttribute('id', id);
  
    // Append clone to the diagram container
    const diagramContainer = document.getElementById('diagram');
    if (diagramContainer) {

      // Get the drop point relative to the diagram container
      const containerRect = diagramContainer.getBoundingClientRect();
      const dropX = event.dropPoint.x - containerRect.left;
      const dropY = event.dropPoint.y - containerRect.top;

      // Adjust the position of the clone to be at the drop location
      clone.style.position = 'absolute';
      clone.style.left = `${dropX}px`;
      clone.style.top = `${dropY}px`;

      diagramContainer.appendChild(clone);

      const newNode: MyNode = {
        title: clone.innerText || "New Node", 
        id: id,
        position: { left: dropX, top: dropY }
      };

      this.nodesInGrid.push(newNode);

      const newElement = document.getElementById(id);
      if (newElement) {
        this.attachDoubleClickListener(newElement);

        this.jsPlumbInstance.addEndpoint(newElement, {
          endpoint: "Dot",
          anchor: ["Right"],
          source: true,
          connector:{
            type:BezierConnector.type,
            options:{
                curviness: 50
            }
          }
        });
        this.jsPlumbInstance.addEndpoint(newElement, {
          endpoint: "Dot",
          anchor: ["Left"],
          target: true,
          connector:{
            type:BezierConnector.type,
            options:{
                curviness: 50
            }
          }
        });
      } else {
        console.error('Failed to find new element after drop');
      }
    } else {
      console.error('Failed to find diagram container');
    }
  }
  

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Method to attach a double-click listener to an element
  attachDoubleClickListener(element: HTMLElement) {
    element.addEventListener('dblclick', (event) => {
      const target = event.target as HTMLElement;
        this.openEditModal(target);
    });
  }


  initNodes() {
    this.controls = [
    {title: "Read CSV", id: this.uuidv4() }, {title: "Read MySQL", id: this.uuidv4() }, {title: "Select Columns", id: this.uuidv4() },
    {title: "Filter Columns", id: this.uuidv4() }, {title: "Simple Clean", id: this.uuidv4() }, {title: "Group Nodes", id: this.uuidv4() }, 
    {title: "Attach Files", id: this.uuidv4() }, {title: "Change Data Type", id: this.uuidv4() }, {title: "Replace Values", id: this.uuidv4() },
    {title: "Write CSV", id: this.uuidv4() }, {title: "Write MySQL", id: this.uuidv4() }];
  }
  

}


