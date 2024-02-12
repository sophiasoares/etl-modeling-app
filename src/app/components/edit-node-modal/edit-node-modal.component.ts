import { Component, Input } from '@angular/core';
import { MatDialogModule, } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MyNode } from '../../models/node';


@Component({
  selector: 'app-edit-node-modal',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-node-modal.component.html',
  styleUrl: './edit-node-modal.component.scss'
})
export class EditNodeModalComponent {
  @Input() node: MyNode = {title: '', id: ''};

}
