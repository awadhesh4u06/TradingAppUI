import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service' 
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort';  
import { HttpParams } from '@angular/common/http';
import {intrestcerificate} from 'src/app/Models/Intrestcerificate'; 
import {NgIf,NgFor} from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-ic-fy',
  templateUrl: './ic-fy.component.html',
  styleUrls: ['./ic-fy.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,NgFor,NgIf, CdkDrag, CdkDragHandle],
})
export class ICFyComponent implements OnInit { 
  dataSource=new MatTableDataSource<intrestcerificate>
  public nameshare:  string='';
  public usrid:any=0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['srno','fy','depositeamt','amt']; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
  private employeser: SectorsService,  private _dialogRef: MatDialogRef<ICFyComponent>) {   
} 
ngAfterViewInit() {    
  this.dataSource.sort = this.sort; 
  this.dataSource.paginator = this.paginator;
  }

ngOnInit(): void { 
    if (localStorage.getItem("UserId") != null) {
    this.usrid=localStorage.getItem("UserId");
  }
  this.nameshare=this.data.Name;
  this.loadData();    
} 
  calculation(dataS: intrestcerificate[]) {
   
    if (dataS)
    for (let row of dataS) { 
     if(row.acName.trim()=='PPF')
        {
          row.clsname='clsshow'
        }
        else
        {
           row.clsname='clshide'
        }
    }     
   }
 
  loadData() {
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    const divparams = new HttpParams()
    .set('accno', this.nameshare)
    .set('usrid', this.usrid);
    this.employeser.getICacno(divparams).subscribe({
      next:(IC)=> {         
        this.dataSource.data= IC; 
       // this._dataSource.data= IC; 
        console.log(IC); 
        this.calculation(this.dataSource.data);
      },
      error:(res)=>{console.log(res);}
    })
  } 
  
@HostListener('window:keyup.esc') onKeyUp() {
  this._dialogRef.close();
}
closepage() {
  this._dialogRef.close(true); 
  }
}