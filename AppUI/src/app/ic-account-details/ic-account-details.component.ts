import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SectorsService } from '../Services/sectors.service';
import { ICAccountMaster } from '../Models/ICAccountMaster.model';
import { ICFYDetails } from '../Models/ICFYDetails.model';
import { PpfFYDeposit } from '../Models/PpfFYDeposit.model';
import { IcFyDetailDialogComponent, FyDetailRow } from './ic-fy-detail-dialog.component';
import { AddIcAccountComponent } from './add-ic-account.component';
import { EditIcAccountComponent } from './edit-ic-account.component';
import DataTable from 'datatables.net-dt';

interface AccountDetailRow {
  id: number;
  srNo: number;
  acNo: string;
  acName: string;
  tat?: string;
  startDate?: string;
  endDate?: string;
  roi?: number;
  depositAmt: number;
  intAmt: number;
  finalAmt: number;
  isCompleted: boolean;
  fyRecords: FyDetailRow[];
}

interface GroupedAccount {
  bank: string;
  acType: string;
  amt: number;
  totamt?: number;
  tblid: string;
  details: AccountDetailRow[];
}

@Component({
  selector: 'app-ic-account-details',
  templateUrl: './ic-account-details.component.html',
  styleUrls: ['./ic-account-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule
  ]
})
export class IcAccountDetailsComponent implements OnInit, AfterViewInit {
  
  _dataSource = new MatTableDataSource<GroupedAccount>();
  dataSource = new MatTableDataSource<GroupedAccount>();
  masterDisplayedColumns: string[] = ['bank', 'acType', 'amt', 'acDetails'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public userId: number = 0;
  public printtot: number = 0;

  constructor(private sectorsService: SectorsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.LoadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  LoadData(): void {
    if (localStorage.getItem('UserId') != null) {
      this.userId = parseInt(localStorage.getItem('UserId')!);
    }

    // Load IC Account Master
    this.sectorsService.getICAccountMaster(this.userId).subscribe({
      next: (masterData: ICAccountMaster[]) => {
        console.log('IC Account Master Data:', masterData);
        
        // Load FY Details
        this.sectorsService.getICFYDetails(this.userId).subscribe({
          next: (fyData: ICFYDetails[]) => {
            console.log('IC FY Details Data:', fyData);
            
            // Load PPF Details
            this.sectorsService.getPpfFYDeposit(this.userId).subscribe({
              next: (ppfData: PpfFYDeposit[]) => {
                console.log('PPF FY Deposit Data:', ppfData);
                
                // Combine all data
                const combinedData = this.combineData(masterData, fyData, ppfData);
                this.dataSource.data = combinedData;
                this._dataSource.data = combinedData;
                this.calculation(combinedData);
              },
              error: (error) => {
                console.error('Error loading PPF:', error);
                const combinedData = this.combineData(masterData, fyData, []);
                this.dataSource.data = combinedData;
                this._dataSource.data = combinedData;
                this.calculation(combinedData);
              }
            });
          },
          error: (error) => {
            console.error('Error loading FY Details:', error);
            const combinedData = this.combineData(masterData, [], []);
            this.dataSource.data = combinedData;
            this._dataSource.data = combinedData;
            this.calculation(combinedData);
          }
        });
      },
      error: (error) => {
        console.error('Error loading IC Account Master:', error);
      }
    });
  }

  combineData(
    masters: ICAccountMaster[],
    fyDetails: ICFYDetails[],
    ppfDetails: PpfFYDeposit[]
  ): GroupedAccount[] {
    const groups = new Map<string, GroupedAccount>();

    masters.forEach(master => {
      const key = master.bank + '||' + master.acType;
      if (!groups.has(key)) {
        groups.set(key, {
          bank: master.bank,
          acType: master.acType,
          amt: 0,
          details: [],
          tblid: master.bank + '_' + master.acType
        });
      }
      const group = groups.get(key)!;

      // FY entries carry interest-only Amt; PPF entries carry deposit + interest split
      const fyRecords: FyDetailRow[] = [
        ...fyDetails.filter(fy => fy.icId === master.id)
          .map(fy => ({ fyId: fy.fyId, source: 'FY' as const, fy: fy.fy, depositAmt: 0, intAmt: fy.amt })),
        ...ppfDetails.filter(ppf => ppf.icId === master.id)
          .map(ppf => ({ fyId: ppf.fyId, source: 'PPF' as const, fy: ppf.fy, depositAmt: ppf.ppfDepositAmt, intAmt: ppf.intAmt }))
      ];

      // DepositAmt/FinalAmt come from ICAccountMaster, except PPF whose totals live in PpfFYDeposit
      const ppfDepositTotal = fyRecords.reduce((sum, r) => sum + (r.depositAmt || 0), 0);
      const intAmt = fyRecords.reduce((sum, r) => sum + r.intAmt, 0);
      const depositAmt = master.acType === 'PPF' ? ppfDepositTotal : master.depositAmt;
      const finalAmt = master.acType === 'PPF' ? (ppfDepositTotal + intAmt) : master.finalAmt;

      // Fall back to FY-derived dates (1 Apr of earliest FY to 31 Mar of latest FY) when master dates are unset
      let startDate = master.startDate;
      let endDate = master.endDate;
    //   if (this.isDefaultDate(startDate) || this.isDefaultDate(endDate)) {
    //     const derived = this.deriveDatesFromFY(fyRecords);
    //     if (derived.start) startDate = derived.start;
    //     if (derived.end) endDate = derived.end;
    //   }

      group.details.push({
        id: master.id,
        srNo: group.details.length + 1,
        acNo: master.acNo,
        acName: master.acName,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        tat: this.calculateTAT(startDate, endDate),
        roi: master.roi,
        depositAmt: depositAmt,
        intAmt: intAmt,
        finalAmt: finalAmt,
        fyRecords: fyRecords,
        isCompleted: master.isCompleted || false,
      });

      // Group Amt reflects accrued interest across all accounts in the type
      group.amt += intAmt;
    });

    return Array.from(groups.values());
  }

  private isDefaultDate(value: any): boolean {
    const d = new Date(value);
    return !value || isNaN(d.getTime()) || d.getFullYear() <= 1;
  }

  private parseFY(fy: string): { start: Date; end: Date } | null {
    if (!fy) return null;
    const parts = fy.split('-');
    if (parts.length !== 2) return null;
    const startYear = parseInt(parts[0], 10);
    const endYearPart = parseInt(parts[1], 10);
    if (isNaN(startYear) || isNaN(endYearPart)) return null;
    const century = Math.floor(startYear / 100) * 100;
    let endYear = century + endYearPart;
    if (endYear <= startYear) endYear += 100;
    return {
      start: new Date(startYear, 3, 1), // 1 April
      end: new Date(endYear, 2, 31) // 31 March
    };
  }

  private deriveDatesFromFY(fyRecords: FyDetailRow[]): { start: Date | null; end: Date | null } {
    let minStart: Date | null = null;
    let maxEnd: Date | null = null;
    fyRecords.forEach(r => {
      const parsed = this.parseFY(r.fy);
      if (parsed) {
        if (!minStart || parsed.start < minStart) minStart = parsed.start;
        if (!maxEnd || parsed.end > maxEnd) maxEnd = parsed.end;
      }
    });
    return { start: minStart, end: maxEnd };
  }

  calculateTAT(startDate: any, endDate: any): string {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (days < 30) {
        return `${days}D`;
      } else if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months}M ${days % 30}D`;
      } else {
        const years = Math.floor(days / 365);
        return `${years}Y ${Math.floor((days % 365) / 30)}M`;
      }
    } catch (e) {
      return '';
    }
  }

  calculation(dataS: GroupedAccount[]): void {
    let tot: number = 0;
    if (dataS) {
      for (let row of dataS) {
        tot += row.amt || 0;
        row.totamt = Number((row.amt || 0).toFixed(2));
      }
    }
    this.printtot = Number(tot.toFixed(2));
  }

  ShowFy(detail: AccountDetailRow, acType: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '650px';
    dialogConfig.panelClass = ['draggable-dialog', 'ic-fy-detail-dialog-panel'];
    dialogConfig.data = { icId: detail.id, acNo: detail.acNo, records: detail.fyRecords, showDepositAmt: acType === 'PPF' };
    const dialogRef = this.dialog.open(IcFyDetailDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.LoadData();
      }
    });
  }

  openAddDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.panelClass = ['draggable-dialog', 'ic-fy-detail-dialog-panel'];
    const dialogRef = this.dialog.open(AddIcAccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.LoadData();
      }
    });
  }

  openEditDialog(detail: AccountDetailRow): void {
    console.log('Opening Edit Dialog for detail:', detail);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    dialogConfig.panelClass = ['draggable-dialog', 'ic-fy-detail-dialog-panel'];
    dialogConfig.data = {
      id: detail.id,
      acNo: detail.acNo,
      startDate: detail.startDate,
      endDate: detail.endDate,
      roi: detail.roi,
      depositAmt: detail.depositAmt,
      finalAmt: detail.finalAmt
    };
    const dialogRef = this.dialog.open(EditIcAccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.LoadData();
      }
    });
  }

  SortColumn(tableId: string): void {
    try {
      const table = new DataTable('#' + tableId, {
        paging: false,
        searching: false,
        retrieve: true,
        info: false,
        lengthChange: false
      });
    } catch (e) {
      console.log('DataTable already initialized or not found');
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this._dataSource.data;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.calculation(this.dataSource.filteredData);
    }
  }
}



