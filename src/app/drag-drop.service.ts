import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  startDrag(clone: HTMLElement, node: number, container: HTMLElement, dropModel: number[]) {
    // Implement drag logic here
    // For example, track mousemove events and update the position of the clone
    // On mouseup, determine if the clone is over the grid container and add the node to the dropModel
    // Finally, remove the clone from the DOM
  }
}
