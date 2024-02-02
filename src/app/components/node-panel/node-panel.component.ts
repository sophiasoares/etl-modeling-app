import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DragDropService } from '../../drag-drop.service';
import { NodeItem } from '../../models/node';
import { CommonModule } from '@angular/common';
import { 
  DragDropModule,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-node-panel',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './node-panel.component.html',
  styleUrl: './node-panel.component.scss'
})
export class NodePanelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('nodeList', { static: false }) dropList!: CdkDropList;

  constructor(protected dragDropService: DragDropService) {}

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

}
