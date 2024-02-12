import { Component, Inject } from '@angular/core';
import { MatDialogModule, } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MyNode } from '../../models/node';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-node-modal',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-node-modal.component.html',
  styleUrl: './edit-node-modal.component.scss'
})
export class EditNodeModalComponent {

  constructor(
    public dialogRef: MatDialogRef<EditNodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onSave(): void {
    this.dialogRef.close({ newName: this.data.node.title, success: true });
  }

}
