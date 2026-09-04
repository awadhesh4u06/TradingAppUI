import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-confirmdailog',
  templateUrl: './confirmdailog.component.html',
  styleUrls: ['./confirmdailog.component.css'],
  standalone: true,
  imports: [CdkDrag, CdkDragHandle]
})
export class ConfirmdailogComponent implements OnInit {
  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmdailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
   
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() { 
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

