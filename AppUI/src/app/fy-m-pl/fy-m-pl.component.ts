import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import { SectorsService } from 'src/app/Services/sectors.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { TradeLotSize } from 'src/app/Models/TradeLots.model';
import { HttpParams } from '@angular/common/http';
import { NgIf, NgFor, NgClass } from '@angular/common'; 
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-fy-m-pl',
  templateUrl: './fy-m-pl.component.html',
  styleUrls: ['./fy-m-pl.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, NgClass, NgFor, NgIf, CdkDrag, CdkDragHandle],
})
export class FyMPLComponent implements OnInit {
  public fyear: string = '';
  public printtot: number = 0;
  public usrid: any = 1;

  dataSource = new MatTableDataSource<TradeLotSize>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortCol1') sortCol1: MatSort;

  displayedColumns: string[] = [ 
    'monthName',
    'pi',
    'divident',
    'dpc',
    'finalBrok',
    'final',
    'perct'
  ];
  detailColumns: string[] = ['detail']; 
  expandedElement: TradeLotSize | null = null;
  lotlist: TradeLotSize[] = [];  
  combineuserd: any; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private employeser: SectorsService,
    private _dialogRef: MatDialogRef<FyMPLComponent>,
    private _dailog: MatDialog
  ) {}

  ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void { 
    if (localStorage.getItem("UserId") != null) {
      this.usrid = localStorage.getItem("UserId");
    }
    this.fyear = this.data.fyear;
    this.dataSource.sort = this.sortCol1;
    this.loadPL();      
  } 

  @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }

  closepage() {
    this._dialogRef.close(true); 
  }

  loadPL() { 
    const divparams = new HttpParams()
      .set('fyear', this.fyear)
      .set('usrid', this.usrid)
      .set('ismonthly','Y');

    this.employeser.getPLFyM(divparams).subscribe({
      next: (adddivlist) => {           
        this.dataSource.data = adddivlist;    
        console.log(adddivlist);    
        this.calculation(adddivlist);
      },
      error: (res) => { console.log(res); }
    });

    this._dialogRef.backdropClick().subscribe(() => { 
      this._dialogRef.close();
    });
  }
  toggleMonth(element: TradeLotSize) {
    this.expandedElement = this.expandedElement === element ? null : element;
  } 
ShowDetails(id: string) {
  const allDivs = document.getElementsByClassName('tblbardv');  
  for (let i = 0; i < allDivs.length; i++) {
    const div = allDivs[i] as HTMLElement;
    // Skip the incoming id
    if (div.id !== id) {
      div.classList.add('clshide');   // force hide
      div.classList.remove('clsshow');   // remove show if present
    }
  }

  // Toggle the target div
  const element = document.getElementById(id);
  if (element) {
    if (element.classList.contains('clshide')) {
      element.classList.remove('clshide');
      element.classList.add('clsshow');
    } else {
      element.classList.remove('clsshow');
      element.classList.add('clshide');
    }
  }
}

  calculation(dataS: TradeLotSize[]) {
    let tot: number = 0;
    let totfinal: number = 0;
    console.log(dataS);
    if (dataS) {
      for (let row of dataS) { 
        row.final_lot = (row.pl + row.divident) - (row.finalBrok + row.dpc);
        row.final_lot = Number(row.final_lot.toFixed(2)); 
        row.final = row.final_lot;

        if (row.buyAmt == 0) {
          row.perct = Number(((row.final) / 1).toFixed(2));
        } 
        else {
          row.perct = Number(((row.final * 100) / row.buyAmt).toFixed(2));
        }
        totfinal += row.final;
        tot += row.pl; 
       //  if(row._data)
      //  { 
          // for (let r of row._data) { 
            
          // }
        
        //}
      }
    }
    this.printtot = Number(tot.toFixed(2)); 
  } 
}
