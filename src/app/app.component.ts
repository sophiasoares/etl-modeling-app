import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GridComponent } from './components/grid/grid.component';
import { FormsModule } from '@angular/forms';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { NodePanelComponent } from './components/node-panel/node-panel.component';
import { NodeItem } from './models/node';
import { EtlModelingAreaComponent } from './components/etl-modeling-area/etl-modeling-area.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    GridComponent, 
    FormsModule, 
    SettingsPanelComponent, 
    NodePanelComponent,
    EtlModelingAreaComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'etl-modeling-app';
  gridSize: number = 20; 
  selectedNode: NodeItem | null = null;

  onSelectedNode(node: NodeItem) {
    this.selectedNode = node; 
  }

}
