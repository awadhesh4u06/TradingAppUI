import {Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service'
import {TradeLotSize} from 'src/app/Models/TradeLots.model'
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,MatSortModule} from '@angular/material/sort'; 
import {HttpParams} from '@angular/common/http';
import {getInitials} from 'src/app/Sharedutils';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-trade-lot',
  templateUrl: './trade-lot.component.html',
  styleUrls: ['./trade-lot.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,MatTooltipModule, CdkDrag, CdkDragHandle],
})
export class TradeLotComponent  implements OnInit{
  
  public nameshare:string='';
  public combineuserd:any='';
  public printtot:number=0;
  public clsname:string='clsgreen';
  public currentuser:any;
   dataSource=new MatTableDataSource<TradeLotSize>
  
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

 displayedColumns: string[] = ['srno','lotsize','qty', 'buyAmt',
 'buyAvg','sellAmt','sellAvg','pl','finalBrok','dpc','final_lot','perct','userName'
]; 
lotlist: TradeLotSize[] = []; 
  usrid: any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
  private employeser: SectorsService,  private _dialogRef: MatDialogRef<TradeLotComponent>) {
} 
ngAfterViewInit() {    
  this.dataSource.sort = this.sort; 
  this.dataSource.paginator = this.paginator;
  }

ngOnInit(): void {  
  this.nameshare=this.data.Name;
  this.combineuserd=this.data.combineusers;
  if (localStorage.getItem("UserId") != null) {
    this.usrid=localStorage.getItem("UserId");    
    this.currentuser=localStorage.getItem("UserName");
  }
 this.LoadData();    
} 
calculation(dataS: TradeLotSize[]) {
  let tot: number = 0;
  let _cur:string='';
  let i:number=1;
  // Use Set to get unique usernames
const distinctUsernames = Array.from(
  new Set(dataS.map(user => user.userName))
); 
  if (dataS)   {  
  for (let row of dataS) { 
    if(this.currentuser==row.userName)
    {
      row.clsName='name-circle user';
    }
    else 
    {
    const index = distinctUsernames.findIndex(user => user === row.userName);
    const position = index !== -1 ? index + 1 : 0;

        row.clsName='name-circle user'+ position+'';
    }
    row.IntialName=getInitials(row.userName);
    row.final_lot=row.pl-(row.finalBrok+row.dpc);
    row.final_lot=Number(row.final_lot.toFixed(2)); 
    row.final=row.final_lot;
    tot += row.final;  
    if(row.sellAmt>0)
    {
      row.perct=Number((row.final_lot*100/row.buyAmt).toFixed(2))      
    }    
  }
  this.printtot= Number(tot.toFixed(2)); 
  if(this.printtot<0)
  {
    this.clsname='clsred';
  } 
}
 }
 @HostListener('window:keyup.esc') onKeyUp() {
  this._dialogRef.close();
}
closepage() {
  this._dialogRef.close(true); 
  } 
  LoadData() { 
    const lotparams = new HttpParams()
      .set('name', this.nameshare)
      .set('usrid', this.usrid)
       .set('userids', this.combineuserd);
    this.employeser.getLotSize(lotparams).subscribe({
      next:(lotlist)=> {         
      this.dataSource.data= lotlist;  
       
      this.calculation(lotlist);
      },
      error:(res)=>{console.log(res);}
    }) 
    this._dialogRef.backdropClick().subscribe(() => { 
      this._dialogRef.close();
    })
  }  
  
}
