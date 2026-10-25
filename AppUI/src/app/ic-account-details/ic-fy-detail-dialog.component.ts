import { Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SectorsService } from '../Services/sectors.service';

export interface FyDetailRow {
  fyId: number;
  source: 'FY' | 'PPF';
  fy: string;
  depositAmt: number;
  intAmt: number;
}

export interface FyDetailDialogData {
  icId: number;
  acNo: string;
  records: FyDetailRow[];
  showDepositAmt?: boolean;
}

@Component({
  selector: 'app-ic-fy-detail-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatDialogModule, MatButtonModule, MatIconModule, CdkDrag, CdkDragHandle],
  templateUrl: './ic-fy-detail-dialog.component.html',
  styleUrls: ['./ic-fy-detail-dialog.component.css'],
})
export class IcFyDetailDialogComponent {
  displayedColumns: string[];
  editingIndex = -1;
  editDepositAmt = 0;
  editIntAmt = 0;
  saving = false;

  addingNew = false;
  fyOptions: string[] = [];
  newFy = '';
  newDepositAmt = 0;
  newIntAmt = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FyDetailDialogData,
    private dialogRef: MatDialogRef<IcFyDetailDialogComponent>,
    private sectorsService: SectorsService
  ) {
    this.displayedColumns = data.showDepositAmt
      ? ['srno', 'fy', 'depositAmt', 'intAmt', 'edit']
      : ['srno', 'fy', 'intAmt', 'edit'];
    this.fyOptions = this.buildFYOptions();
  }

  private buildFYOptions(): string[] {
    const today = new Date();
    // Financial year runs Apr-Mar; before April the current FY started the previous calendar year
    const currentFYStart = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const options: string[] = [];
    for (let i = 3; i >= 0; i--) {
      const startYear = currentFYStart - i;
      const endYearShort = (startYear + 1).toString().slice(-2);
      options.push(`${startYear}-${endYearShort}`);
    }
    return options;
  }

  startAddNew(): void {
    this.addingNew = true;
    this.newFy = this.fyOptions[this.fyOptions.length - 1];
    this.newDepositAmt = 0;
    this.newIntAmt = 0;
  }

  cancelAddNew(): void {
    this.addingNew = false;
  }

  saveNew(): void {
    if (!this.newFy) {
      alert('Please select FY');
      return;
    }
    this.saving = true;
    const call = this.data.showDepositAmt
      ? this.sectorsService.savePpfFYDeposit({
          fyId: 0,
          icId: this.data.icId,
          fy: this.newFy,
          ppfDepositAmt: this.newDepositAmt,
          intAmt: this.newIntAmt,
          createdDate: new Date()
        })
      : this.sectorsService.saveICFYDetails({
          fyId: 0,
          icId: this.data.icId,
          fy: this.newFy,
          amt: this.newIntAmt,
          createdDate: new Date()
        });

    call.subscribe({
      next: () => {
        this.data.records.unshift({
          fyId: 0,
          source: this.data.showDepositAmt ? 'PPF' : 'FY',
          fy: this.newFy,
          depositAmt: this.newDepositAmt,
          intAmt: this.newIntAmt
        });
        this.saving = false;
        this.addingNew = false;
      },
      error: (err) => {
        console.log(err);
        this.saving = false;
        alert('Issue in saving data');
      }
    });
  }

  startEdit(index: number, row: FyDetailRow): void {
    this.editingIndex = index;
    this.editDepositAmt = row.depositAmt;
    this.editIntAmt = row.intAmt;
  }

  cancelEdit(): void {
    this.editingIndex = -1;
  }

  saveEdit(row: FyDetailRow): void {
    this.saving = true;
    const call = row.source === 'PPF'
      ? this.sectorsService.updatePpfFYDeposit({
          fyId: row.fyId,
          icId: 0,
          fy: row.fy,
          ppfDepositAmt: this.editDepositAmt,
          intAmt: this.editIntAmt,
          createdDate: new Date()
        })
      : this.sectorsService.updateICFYDetails({
          fyId: row.fyId,
          icId: 0,
          fy: row.fy,
          amt: this.editIntAmt,
          createdDate: new Date()
        });

    call.subscribe({
      next: () => {
        row.depositAmt = this.editDepositAmt;
        row.intAmt = this.editIntAmt;
        this.saving = false;
        this.editingIndex = -1;
      },
      error: (err) => {
        console.log(err);
        this.saving = false;
        alert('Issue in updating data');
      }
    });
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  closepage(): void {
    this.dialogRef.close(true);
  }
}

