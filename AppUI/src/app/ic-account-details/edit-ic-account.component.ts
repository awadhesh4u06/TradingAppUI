import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { SectorsService } from '../Services/sectors.service';
import { ICAccountMaster } from '../Models/ICAccountMaster.model';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
export interface EditIcAccountDialogData {
  id: number;
  acNo: string;
  startDate?: string;
  endDate?: string;
  roi?: number;
  depositAmt?: number;
  finalAmt?: number; 
  isCompleted: boolean;
}

@Component({
  selector: 'app-edit-ic-account',
  standalone: true,
  imports: [CommonModule,MatRadioModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, CdkDrag, CdkDragHandle],
  templateUrl: './edit-ic-account.component.html',
  styleUrls: ['./edit-ic-account.component.css'],
})
export class EditIcAccountComponent {
  editForm: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private sectorsService: SectorsService,
    private dialogRef: MatDialogRef<EditIcAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditIcAccountDialogData
  ) { console.log('EditIcAccountComponent data:', data);
    this.editForm = this.fb.group({
      startDate: [this.toDateInput(data.startDate)],
      endDate: [this.toDateInput(data.endDate)],
      roi: [data.roi || 0, Validators.required],
      depositAmt: [data.depositAmt || 0, Validators.required],
      finalAmt: [data.finalAmt || 0, Validators.required],
      isCompleted: [data.isCompleted || false]
    });
    console.log('EditIcAccountComponent form initialized:', this.editForm.value);
  }

  private toDateInpututc(value?: string): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime()) || d.getFullYear() <= 1) return '';
    return d.toISOString().substring(0, 10);
  }
private toDateInput(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime()) || d.getFullYear() <= 1) return '';

  // Instead of UTC ISO string, use local date parts
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  Save(): void {
    if (!this.editForm.valid) {
      alert('Please fill the required inputs');
      return;
    }

    this.saving = true;
    const formVal = this.editForm.value; debugger;
    const master: any = {
      id: this.data.id,
      roi: formVal.roi ?? 0,
      depositAmt: formVal.depositAmt ?? 0,
      finalAmt: formVal.finalAmt ?? 0,
      isCompleted: formVal.isCompleted ?? false
    };
    if (formVal.startDate) { master.startDate = formVal.startDate; }
    if (formVal.endDate) { master.endDate = formVal.endDate; }

    this.sectorsService.updateICAccountMaster(master as ICAccountMaster).subscribe({
      next: () => {
        this.saving = false;
        alert('Updated successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        console.log(err);
        alert('Issue in updating data');
      }
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  closepage(): void {
    this.dialogRef.close();
  }
}
