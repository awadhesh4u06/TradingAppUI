  
import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service'
import {AddDivident} from 'src/app/Models/AddDivident.model'
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort';  
import {HttpParams} from '@angular/common/http';
import {getInitials} from 'src/app/Sharedutils';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
 import {DivgraphComponent} from 'src/app/divgraph/divgraph.component';  
@Component({
  selector: 'app-get-dividents',
  templateUrl: './get-dividents.component.html',
  styleUrls: ['./get-dividents.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,MatTooltipModule, CdkDrag, CdkDragHandle],
})
 
export class GetDividentsComponent implements OnInit {
  public nameshare:  string='';
  public printtot:  number=0;
  public usrid:any=1; public combineuserd:any='';
   dataSource=new MatTableDataSource<AddDivident>
  public currentuser:any;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

 displayedColumns: string[] = ['srno','depositeDate','nos', 'divpershare','amount','userName' ]; 
 adddivlist: AddDivident[] = []; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
    private employeser: SectorsService,  private _dialogRef: MatDialogRef<GetDividentsComponent>,private _dailog:MatDialog) {   
  } 
    ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
    }

  ngOnInit(): void { 
      if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
        this.currentuser=localStorage.getItem("UserName");
    } 
    this.nameshare=this.data.Name;
    this.combineuserd=this.data.combineusers;
    this.loadDivident();    
  } 
   calculation(dataS: AddDivident[]) {
    let tot: number = 0;
    const distinctUsernames = Array.from(
  new Set(dataS.map(user => user.userName))); 
  if (dataS) 
   {   
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
    row.intialname=getInitials(row.userName);
    
      tot += row.amount; 
    }
    this.printtot= Number(tot.toFixed(2)); 
   }
  
}
   @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }
  closepage() {
    this._dialogRef.close(true); 
    }
    loadDivident() {  
      const divparams = new HttpParams()
      .set('name', this.nameshare)
      .set('usrid', this.usrid)  .set('combineusers', this.combineuserd);
      this.employeser.getDividents(divparams).subscribe({
        next:(adddivlist)=> {           
        this.dataSource.data= adddivlist; 
       // console.log(adddivlist);
        this.calculation(adddivlist);
        },
        error:(res)=>{console.log(res);}
      }) 
      this._dialogRef.backdropClick().subscribe(() => {
        // Close the dialog
        this._dialogRef.close();
      })
    } 
    ShowGraph(nameshare:string)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.backdropClass = 'app-transparent-backdrop';
    dialogConfig.autoFocus = true;
    dialogConfig.data = { Name: nameshare, combineusers: this.combineuserd };
    dialogConfig.width = 'auto';
    dialogConfig.height = 'auto';
    dialogConfig.panelClass = 'draggable-dialog';
  dialogConfig.position = { right: '2vh', top: '10vh' }; // Open on the right side
  this._dailog.open(DivgraphComponent, dialogConfig);
  }
}
