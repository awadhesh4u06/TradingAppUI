import { AfterViewInit, Component, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core'; 
import { SectorsService } from '../Services/sectors.service'; 
import {intrestcerificate,icdataa} from 'src/app/Models/Intrestcerificate'; 
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input'; 
import {MatSort, MatSortModule} from '@angular/material/sort';
import {NgIf,NgFor} from '@angular/common';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button'; 
import { ICFyComponent } from '../ic-fy/ic-fy.component'; 
import DataTable from 'datatables.net-dt';
@Component({
  selector: 'app-intrest-certificate',
  templateUrl: './intrest-certificate.component.html',
  styleUrls: ['./intrest-certificate.component.css'], 
  standalone: true,
  imports: [MatTableModule,MatSortModule, MatPaginatorModule,MatInputModule,NgFor,NgIf, MatButtonModule, MatIconModule]
 
})
export class IntrestCertificateComponent implements AfterViewInit{
  _dataSource=new MatTableDataSource<intrestcerificate>
  dataSource=new MatTableDataSource<intrestcerificate>
  ds=new MatTableDataSource<icdataa>
  public usrid:any=0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 
  displayedColumns: string[] = ['bank','acType','amt','acTypedetail']; 
 
 
  public printtot: Number=0;
   public isExpand:boolean=false
  tid: string;
  constructor(private employeser:SectorsService,private _dailog:MatDialog) { 

  } 
  ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;   
    }
Sortcolumn(iddd:string){
  let table = new DataTable('#'+iddd, {
    paging: false,
    searching: false, 
    retrieve: true,
   info:false,
   lengthChange: false,
});
//$('#'+iddd).addClass('tblbar');
}
  ngOnInit(): void {  
    this.LoadIC();     
   
  }  
  ShowFy(symbName:string) {
    const dialogConfig = new MatDialogConfig();  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data={Name: symbName}; 
    this._dailog.open(ICFyComponent, dialogConfig);
    }
    
  applyFilter(event: Event) {  
   
    const filterValue = (event.target as HTMLInputElement).value;   
    {
      this.dataSource.data=this._dataSource.data;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    if (this.dataSource.paginator) { 
      this.dataSource.paginator.firstPage(); 
      this.calculation(this.dataSource.filteredData);
    }
}

  calculation(dataS: intrestcerificate[]) {
    let tot: number = 0;
    let tid="";
    if (dataS)
    for (let row of dataS) { 
      tot += row.amt; 
      row.totamt=  Number(row.amt.toFixed(2)); 
      row.tblid=row.bank+'_'+row.acType;
    this.tid=row.tblid;
   //this.Sorttable(this.tid);
    }    
    this.printtot=  Number(tot.toFixed(2)); 
   }
 

  LoadIC(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.employeser.getIC(this.usrid).subscribe({
      next:(IC)=> {         
        this.dataSource.data= IC; 
        this._dataSource.data= IC; 
        console.log(IC);
        this.calculation(IC);
      //  this.detailchild(IC);        
      },
      error:(res)=>{console.log(res);}
    })
  } 

  
}
