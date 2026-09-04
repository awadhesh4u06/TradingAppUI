  
import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service'
import { Funddetails} from 'src/app/Models/Funds.model';  
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort';  
import { HttpParams } from '@angular/common/http';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-fy-funds',
  templateUrl: './fy-funds.component.html',
  styleUrls: ['./fy-funds.component.css'],
  standalone: true,
  imports: [MatTableModule,MatSortModule, MatPaginatorModule, CdkDrag, CdkDragHandle],
})
export class FyFundsComponent {
 
  public printtot: Number=0;
  public printcredit: Number=0;
  public printdebit: Number=0; 
  public usrid:any=1;
  dataSource=new MatTableDataSource<Funddetails>  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 
  displayedColumns: string[] = ['srno','fy','credit','debit','balance']; 
 fundlist: Funddetails[] = []; 
 constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
   private employeser: SectorsService,  private _dialogRef: MatDialogRef<FyFundsComponent>) {   
 } 
 ngAfterViewInit() {    
  this.dataSource.sort = this.sort; 
  this.dataSource.paginator = this.paginator;
  }

ngOnInit(): void { 
    if (localStorage.getItem("UserId") != null) {
    this.usrid=localStorage.getItem("UserId");
  }  
  this.LoadFYFunds();    
} 
@HostListener('window:keyup.esc') onKeyUp() {
  this._dialogRef.close();
}
closepage() {
  this._dialogRef.close(true); 
  }

  calculation(dataS: Funddetails[]) {
    let totdebit: number = 0;
    let totcredit: number = 0;
    let totblc: number = 0;
    if (dataS)
    for (let row of dataS) { 
      totdebit += row.debit;  
      totcredit+=row.credit;
      totblc+=row.balance
    }        
    this.printcredit =  Number(totcredit.toFixed(2)); 
    this.printdebit=  Number(totdebit.toFixed(2)); 
    this.printtot=Number((totblc).toFixed(2));
   }
  LoadFYFunds() {
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.employeser.GetFYFunddetails(this.usrid).subscribe({
      next:(Fd)=> {         
        this.dataSource.data= Fd;  
      this. calculation(Fd);
      },
      error:(res)=>{console.log(res);}
    })
  }
}
