import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { forkJoin, of } from 'rxjs';
import { SectorsService } from '../Services/sectors.service';
import { ICAccountMaster } from '../Models/ICAccountMaster.model';
import { ICFYDetails } from '../Models/ICFYDetails.model';
import { PpfFYDeposit } from '../Models/PpfFYDeposit.model';

@Component({
  selector: 'app-add-ic-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatSelectModule, CdkDrag, CdkDragHandle],
  templateUrl: './add-ic-account.component.html',
  styleUrls: ['./add-ic-account.component.css'],
})
export class AddIcAccountComponent {
  acTypes: string[] = ['SAVING', 'RD', 'FD', 'PPF', 'IWISH'];
  banks: string[] = ['ICICI', 'UBI', 'SBI', 'PO'];
  fyOptions: string[] = [];
  masterForm: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private sectorsService: SectorsService,
    private dialogRef: MatDialogRef<AddIcAccountComponent>
  ) {
    this.fyOptions = this.buildFYOptions();
    this.masterForm = this.fb.group({
      bank: ['', Validators.required],
      acType: ['SAVING', Validators.required],
      acNo: ['', Validators.required],
      acName: [''],
      roi: [0],
      depositAmt: [0],
      finalAmt: [0],
      startDate: [''],
      endDate: [''],
      details: this.fb.array([])
    });
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

  get isPPF(): boolean {
    return this.masterForm.value.acType === 'PPF';
  }

  get isIWish(): boolean {
    return this.masterForm.value.acType === 'IWISH';
  }

  get details(): FormArray {
    return this.masterForm.get('details') as FormArray;
  }

  addRow(): void {
    if (this.isPPF) {
      this.details.push(this.fb.group({
        fy: [this.fyOptions[this.fyOptions.length - 1], Validators.required],
        ppfDepositAmt: [0],
        intAmt: [0]
      }));
    } else {
      this.details.push(this.fb.group({
        fy: [this.fyOptions[this.fyOptions.length - 1], Validators.required],
        amt: [0]
      }));
    }
  }

  removeRow(index: number): void {
    this.details.removeAt(index);
  }

  Save(): void {
    if (!this.masterForm.valid) {
      alert('Please fill the required inputs');
      return;
    }

    this.saving = true;
    const formVal = this.masterForm.value;
    const userId = localStorage.getItem('UserId') != null ? parseInt(localStorage.getItem('UserId')!) : 0;

    const master: any = {
      id: 0,
      userId: userId,
      bank: formVal.bank,
      acType: formVal.acType,
      acNo: formVal.acNo,
      acName: this.isIWish ? formVal.acName : '',
      depositAmt: formVal.depositAmt || 0,
      roi: formVal.roi || 0,
      finalAmt: formVal.finalAmt || 0,
      createdDate: new Date()
    };
    // Omit dates entirely when left blank so the API stores them as NULL instead of failing to parse
    if (formVal.startDate) { master.startDate = formVal.startDate; }
    if (formVal.endDate) { master.endDate = formVal.endDate; }

    this.sectorsService.saveICAccountMaster(master as ICAccountMaster).subscribe({
      next: (newId: number) => {
        const rows: any[] = formVal.details || [];
        if (rows.length === 0) {
          this.saving = false;
          alert('Added successfully');
          this.dialogRef.close(true);
          return;
        }

        const calls = rows.map(row => {
          if (this.isPPF) {
            const ppf: PpfFYDeposit = {
              fyId: 0,
              icId: newId,
              fy: row.fy,
              ppfDepositAmt: row.ppfDepositAmt || 0,
              intAmt: row.intAmt || 0,
              createdDate: new Date()
            };
            return this.sectorsService.savePpfFYDeposit(ppf);
          } else {
            const fy: ICFYDetails = {
              fyId: 0,
              icId: newId,
              fy: row.fy,
              amt: row.amt || 0,
              createdDate: new Date()
            };
            return this.sectorsService.saveICFYDetails(fy);
          }
        });

        forkJoin(calls.length ? calls : [of(null)]).subscribe({
          next: () => {
            this.saving = false;
            alert('Added successfully');
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.saving = false;
            console.log(err);
            alert('Account saved but issue in saving detail rows');
            this.dialogRef.close(true);
          }
        });
      },
      error: (err) => {
        this.saving = false;
        console.log(err);
        alert('Issue in data save');
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
