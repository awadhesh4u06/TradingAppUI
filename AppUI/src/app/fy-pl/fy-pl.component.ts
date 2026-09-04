import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA,  MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service' 
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort'; 
import {TradeLotSize,dataa} from 'src/app/Models/TradeLots.model'
import { HttpParams } from '@angular/common/http';
import {NgIf,NgFor,NgClass} from '@angular/common'; 
import { FyMPLComponent } from '../fy-m-pl/fy-m-pl.component';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-fy-pl',
  templateUrl: './fy-pl.component.html',
  styleUrls: ['./fy-pl.component.css'],  
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,NgClass, CdkDrag, CdkDragHandle],
})
export class FYPLComponent implements OnInit{
  public fyear:  string='';
  public printtot:  number=0;
  public usrid:any=1;
   dataSource=new MatTableDataSource<TradeLotSize> 
   
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;


@ViewChild('sortCol1') sortCol1: MatSort; 
@ViewChild('sortCol2') sortCol2: MatSort; 
dataSource1 = new MatTableDataSource<dataa>;
//this.dataSource1.sort =sortCol1;
activeClass: boolean;    
  disColumns: string[] = ['srno','sector','pl','divident' ,'dpc','brok' ,'final','per']; 
  displayedColumns: string[] = ['srno','symbol','pl','divident' ,'dpc','finalBrok' ,'final','perct']; 
  adddivlist: TradeLotSize[] = []; 
  combineuserd: any;
   
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
    private employeser: SectorsService,  private _dialogRef: MatDialogRef<FYPLComponent>,private _dailog:MatDialog) {
  } 
  ngAfterViewInit() {    
    this.dataSource.sort = this.sortCol2; 
    this.dataSource1.sort =this.sortCol1;
    this.dataSource.paginator = this.paginator;
    }
    ngOnInit(): void { 
      if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.fyear=this.data.fyear;
    this.dataSource1.sort =this.sortCol1;
    this.loadPL();      
  } 
  @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }

   ShowMonthly() {
        const dialogConfig = new MatDialogConfig();   
        dialogConfig.backdropClass = 'app-transparent-backdrop';
        dialogConfig.data={fyear: this.data.fyear}; 
        this._dailog.open(FyMPLComponent, dialogConfig);
      }
  
  closepage() {
    this._dialogRef.close(true); 
    }
    loadPL() { 
      const divparams = new HttpParams()
      .set('fyear', this.fyear)
      .set('usrid', this.usrid);
      this.employeser.getPLFy(divparams).subscribe({
        next:(adddivlist)=> {           
        this.dataSource.data= adddivlist;    
      //  console.log(adddivlist);    
        this.calculation(adddivlist);
        
        },
        error:(res)=>{console.log(res);}
      }) 
    }
    opendata(id:any)
    {  
      //var span = document.getElementsByClassName("close")[0];
      this.activeClass = !this.activeClass;
    }
    closepop()
    {
      this.activeClass = !this.activeClass  
    }
  
    calculation(dataS: TradeLotSize[]) {
      let tot: number = 0;
      let totfinal: number = 0;
      if (dataS)
      for (let row of dataS) { 
        row.final_lot=(row.pl+row.divident)-(row.finalBrok+row.dpc);
        row.final_lot=Number(row.final_lot.toFixed(2)); 
        row.final=row.final_lot;
        if(row.buyAmt==0)
        {row.perct=Number(((row.final)/1).toFixed(2))

        }
        else
        {
          row.perct=Number(((row.final*100)/row.buyAmt).toFixed(2))
        }
        
        totfinal += row.final;
        tot += row.pl; 
        if(row._data)
        {
          this.dataSource1.data=row._data;
         // console.log(this.dataSource1.data);
        }
      }
      this.printtot= Number(tot.toFixed(2)); 
     } 
}
