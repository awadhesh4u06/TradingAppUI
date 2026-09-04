import { AfterViewInit, Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core';   
import {SectorsService} from 'src/app/Services/sectors.service'
import {FyReport} from 'src/app/Models/FyReport.model'
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort';  
import { MatDialogConfig,MatDialog } from '@angular/material/dialog';
import { FYDividentComponent } from '../fy-divident/fy-divident.component';
import { FYPLComponent } from '../fy-pl/fy-pl.component';
@Component({
  selector: 'app-fy-report',
  templateUrl: './fy-report.component.html',
  styleUrls: ['./fy-report.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule],
})
export class FYReportComponent implements AfterViewInit{
  dataSource=new MatTableDataSource<FyReport>  
  _dataSource=new MatTableDataSource<FyReport>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 
  displayedColumns: string[] = ['fYear','pl','divdt','brok','dp','amc','final','per']; 
  public usrid:any=0;
  public printPL: Number=0;
  public printDv: Number=0;
  public printBr: Number=0;
  public printDP: Number=0;
  public printAmc: Number=0;
  public printF: Number=0;
  public printP: Number=0;
 constructor(private employeser:SectorsService,private _dailog:MatDialog) {  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {  
    this.LoadData();    
  } 
  LoadData(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.employeser.GetFTReport(this.usrid).subscribe({
      next:(IC)=> {         
        
        this._dataSource.data= IC; 
        this.dataSource.data= IC; 
        this.dataSource.data=IC.filter(dataSource => dataSource.fYear?.toLowerCase()!="total");
       this.dataSource.data= this.dataSource.data.sort((b,a) => a.fYear.localeCompare(b.fYear)) ; 
        console.log(this.dataSource.data);
       this.calculation(IC);
      },
      error:(res)=>{console.log(res);}
    })
  }
    
  calculation(dataS: FyReport[]) { 
   dataS=dataS.filter(dataS => dataS.fYear?.toLowerCase()=="total");
     let totPL: number = 0;
    let totdv: number = 0;
    let totbr: number = 0;
    let totdp: number = 0;
    let totamc: number = 0;
    let totf: number = 0;
    let totp: number = 0; 
    if (dataS)
    {
      //
       for (let row of dataS) { 
      totPL += row.pl
      totdv+=row.divdt;
      totbr+=row.brok;
      totdp+=row.dp;
      totamc+=row.amc;
      totf+=row.final;
      totp+=row.percentage;
    } 
} 
    this.printPL =  Number(totPL.toFixed(2)); 
    this.printDv =  Number(totdv.toFixed(2)); 
    this.printBr =  Number(totbr.toFixed(2)); 
    this.printDP =  Number(totdp.toFixed(2)); 
    this.printAmc =  Number(totamc.toFixed(2)); 
    this.printF =  Number(totf.toFixed(2)); 
    this.printP =  Number(totp.toFixed(2)); 
  }
  ShowDivDetails(fy:string,val :string) {    
    if(Number(val)>0 && fy!='Total' )
    { 
     this.OpenPopUpdivident(fy)
    } 
  }
  OpenPopUpdivident(fy: string) {
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.disableClose = true;
    dialogConfig.data={fyear: fy}; 
    this._dailog.open(FYDividentComponent, dialogConfig);
  }
  ShowPLDetails(fy:string,val :string){
    if(Number(val)!=0 && fy!='Total' )
      { 
       this.OpenPopUpPL(fy)
      } 
  }
  
  OpenPopUpPL(fy: string) {
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.disableClose = true;
    dialogConfig.data={fyear: fy}; 
    this._dailog.open(FYPLComponent, dialogConfig);
  }
}
