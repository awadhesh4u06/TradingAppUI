import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service' 
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort'; 
import {LIC} from 'src/app/Models/LIC.Model'; 
import { HttpParams } from '@angular/common/http';
import {NgClass} from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-lic-details',
  templateUrl: './lic-details.component.html',
  styleUrls: ['./lic-details.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,NgClass, CdkDrag, CdkDragHandle],
})
export class LICDetailsComponent implements OnInit{
  public namepolicy:  string='';
  public licid:  number=0;
  public usrid:any=1;
   dataSource=new MatTableDataSource<LIC>
  
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

 displayedColumns: string[] = ['srno','paymentDate','amtwithGST', 'casebackAmt','amtRd','rD_ACNO' ]; 
 constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
 private employeser: SectorsService,  private _dialogRef: MatDialogRef<LIC>) {   } 
 ngAfterViewInit() {    
  this.dataSource.sort = this.sort; 
  this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {  
    this.namepolicy=this.data.name;
    this.licid=this.data.licid;
    this.LoadData();    
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }
  closepage() {
    this._dialogRef.close(true); 
    }
  LoadData(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    const divparams = new HttpParams()
      .set('licid', this.licid)
      this.employeser.getLICDetails(divparams).subscribe({  
      next:(IC)=> {         
        this.dataSource.data= IC;         
        console.log(IC);         
      },
      error:(res)=>{console.log(res);}
    })
  }
}
