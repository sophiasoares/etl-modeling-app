import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { newInstance, BezierConnector } from "@jsplumb/browser-ui";
import { isPlatformBrowser } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etl-modeling-area',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './etl-modeling-area.component.html',
  styleUrl: './etl-modeling-area.component.scss'
})
export class EtlModelingAreaComponent implements OnInit {
  jsPlumbInstance: any = null;
  controls: any = [ 
    {title: "Read CSV" }, {title: "Read MySQL" }, {title: "Select Columns" },
    {title: "Filter Columns" }, {title: "Simple Clean" }, {title: "Group Nodes" }, 
    {title: "Attach Files" }, {title: "Change Data Type" }, {title: "Replace Values" },
    {title: "Write CSV" }, {title: "Write MySQL" }];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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

      const newElement = document.getElementById(id);
      if (newElement) {
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
}

