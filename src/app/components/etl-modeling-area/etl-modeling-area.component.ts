import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { newInstance, BezierConnector, EVENT_DRAG_STOP } from "@jsplumb/browser-ui";
import { isPlatformBrowser } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EditNodeModalComponent } from '../edit-node-modal/edit-node-modal.component';
import { NodeBase } from '../../models/node';
import { PopupComponent } from '../popup/popup.component';
import { SimpleCleanNode } from '../../models/simple-clean-node';
import { GroupNode } from '../../models/group-node';
import { SelectColumnsNode } from '../../models/select-columns-node';
import { DragDropService } from '../../drag-drop.service';

@Component({
  selector: 'app-etl-modeling-area',
  standalone: true,
  imports: [DragDropModule, CommonModule, MatDialogModule, EditNodeModalComponent],
  templateUrl: './etl-modeling-area.component.html',
  styleUrl: './etl-modeling-area.component.scss'
})
export class EtlModelingAreaComponent implements OnInit {
  jsPlumbInstance: any = null;
  nodesInGrid: NodeBase[] = [];
  controls: NodeBase[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    public dialog: MatDialog, 
    protected dragDropService: DragDropService) {}

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

    this.jsPlumbInstance.bind(EVENT_DRAG_STOP, (p: any) => {
      this.onDragStop(p);
    });

    document.getElementById("diagram")!.style.transform = "scale(1.0)"

    // const control1 = document.getElementById('control1');
    // const control2 = document.getElementById('control2');
    // this.jsPlumbInstance.connect({
    //   source: control1, 
    //   target: control2,
    //   anchors:["Right", "Left" ],
    //   endpoint:"Dot",
    //   paintStyle: {stroke: "green", strokeWidth: 3},
    //   hoverPaintStyle: {stroke: "blue", strokeWidth: 5},
    //   connector:{
    //     type:BezierConnector.type,
    //     options:{
    //         curviness: 50
    //     }
    //   }
    // });
  }

  openEditModal(node: NodeBase) {
    const dialogRef = this.dialog.open(PopupComponent, { 
      width: '450px', 
      data: { node: node}
    });

    // dialogRef.afterOpened().subscribe(() => {
    //   //console.log('Node: ', node);
    //   dialogRef.componentInstance.loadComponent(node);
    // });
  }
  
  onDrop(event: any): void {  
    if (!this.dragDropService.currentDraggedNode) {
      console.error('No node is currently being dragged.');
      return;
    }

    const diagramContainer = document.getElementById('diagram');
    if (diagramContainer) {

      // Get the drop point relative to the diagram container
      const containerRect = diagramContainer.getBoundingClientRect();
      const dropX = event.dropPoint.x - containerRect.left;
      const dropY = event.dropPoint.y - containerRect.top;
    

      let newNode: NodeBase = new SimpleCleanNode();

      if (this.dragDropService.currentDraggedNode instanceof GroupNode) {
        newNode = new GroupNode();
      } else if (this.dragDropService.currentDraggedNode instanceof SelectColumnsNode) {
        newNode = new SelectColumnsNode();
      }

      this.nodesInGrid.push(newNode);

      const clone = event.item.element.nativeElement.cloneNode(true);
      clone.setAttribute('id', newNode.Id);

      // Adjust the position of the clone to be at the drop location
      clone.style.position = 'absolute';
      clone.style.left = `${dropX}px`;
      clone.style.top = `${dropY}px`;

      diagramContainer.appendChild(clone);

      const newElement = document.getElementById(newNode.Id);
      if (newElement) {
        this.attachDoubleClickListener(newElement);
        this.addEndpoints(newElement);
      } else {
        console.error('Failed to find new element after drop');
      }
    } else {
      console.error('Failed to find diagram container');
    }
    this.dragDropService.endDrag(); // Clear the current dragged node
  }
  

  // Method to attach a double-click listener to an element
  attachDoubleClickListener(element: HTMLElement) {
    element.addEventListener('dblclick', (event) => {
      const targetId = (event.target as HTMLElement).id;
      const node = this.nodesInGrid.find(n => n.Id === targetId);
      if (node) {
        this.openEditModal(node);
      } else {
        console.error('Node not found for id:', targetId);
      }
    });
  }

  initNodes() {
    this.controls = [
      new SimpleCleanNode(),
      new GroupNode(),
      new SelectColumnsNode()
    ];
  }

  addEndpoints(newElement: any) {
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
  }

  onDragStop(payload: any) {
    const element = payload.el; // The DOM element that was dragged
    if (element) {
      const rect = element.getBoundingClientRect();
  
      // Depending on where your grid is positioned, you may need to adjust these values.
      // For example, if your grid is offset from the top/left of the document, you would subtract that offset.
      const x = rect.left;
      const y = rect.top;
  
      // Assuming you have the logic to map the DOM element to your MyNode object
      const nodeId = element.id;
      const node = this.nodesInGrid.find(n => n.Id === nodeId);
      if (node) {
        node.Position = { left: x, top: y };
  
        // If you need to trigger Angular's change detection, do so here
        // this.changeDetectorRef.detectChanges(); // If you have ChangeDetectorRef injected
      }
    }
  }

  onDragStart(node: NodeBase): void {
    this.dragDropService.startDrag(node);
  }

  
  

}


