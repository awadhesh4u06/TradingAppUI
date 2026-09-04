  
import {Component, HostListener,Inject ,OnInit, ViewChild} from '@angular/core'; 
import {MatDialogRef, MAT_DIALOG_DATA,MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service' 
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort'; 
import {TradeLotSize,Sectordiv} from 'src/app/Models/TradeLots.model'
import {HttpParams } from '@angular/common/http';
import {NgIf,NgFor,NgClass} from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DivgraphComponent } from '../divgraph/divgraph.component';

@Component({
  selector: 'app-fy-divident',
  templateUrl: './fy-divident.component.html',
  styleUrls: ['./fy-divident.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,NgClass, CdkDrag, CdkDragHandle],
})
export class FYDividentComponent implements OnInit{
  public fyear:  string='';
  public printtot:  number=0;
  public usrid:any=1;
  dataSource=new MatTableDataSource<TradeLotSize>
   dataSource1=new MatTableDataSource<TradeLotSize>
   dataSource2=new MatTableDataSource<Sectordiv>

@ViewChild('sortCol1') sortCol1: MatSort; 
@ViewChild('sortCol2') sortCol2: MatSort;

   @ViewChild(MatPaginator) paginator: MatPaginator;
   
  SecList: Array<Sectordiv> = [];
  activeClass: boolean;    
  disColumns: string[] = ['srno' ,'sector','divident']; 
  displayedColumns: string[] = ['srno','symbol','sector','divident' ]; 
 adddivlist: TradeLotSize[] = []; 
  combineuserd: any;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
    private employeser: SectorsService,  private _dialogRef: MatDialogRef<FYDividentComponent>,private _dailog:MatDialog) {
      
  } 
  ngAfterViewInit() {    
    this.dataSource.sort = this.sortCol2; 
    this.dataSource2.sort =this.sortCol1; 
    this.dataSource.paginator = this.paginator;
    }
    ngOnInit(): void { 
      if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.fyear=this.data.fyear;
    this.loadDivident();      
  } 
  @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }
     ShowGraph(nameshare:string)
      {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.backdropClass = 'app-transparent-backdrop';
        dialogConfig.autoFocus = true;
        dialogConfig.data = { fyear: nameshare, combineusers: this.combineuserd };
        dialogConfig.width = 'auto';
        dialogConfig.height = 'auto';
        dialogConfig.panelClass = 'draggable-dialog';
      dialogConfig.position = { right: '2vh', top: '10vh' }; // Open on the right side
      this._dailog.open(DivgraphComponent, dialogConfig);
      }
  closepage() {
    this._dialogRef.close(true); 
    }
    loadDivident() { 
      const divparams = new HttpParams()
      .set('fyear', this.fyear)
      .set('usrid', this.usrid);
      this.employeser.getDividentsFy(divparams).subscribe({
        next:(adddivlist)=> {           
        this.dataSource.data= adddivlist; 
        this.dataSource1.data=adddivlist;
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
      let secnam:any;
      let secname:any;
      let secdiv:number=0;
      let secdivtot:any;
      dataS= dataS.sort((a,b) => a.sector.localeCompare(b.sector)) ; 
     
      console.log(dataS);
      
      if (dataS)
      {
        for (let row of dataS) { 
          tot += row.divident; 
        }   
        this.printtot= Number(tot.toFixed(2));     
        let i:number=1;
        for (let row of dataS) { 
            secnam=row.sector; 
            if((secname!='' && secname !='undefined' && secname!= null) && secnam!=secname)
              { 
                this.dataSource1.filter = secname.trim().toLowerCase()
                    for( let r of this.dataSource1.filteredData)
                    {
                      secdiv+=r.divident;
                      secdivtot=secdiv; 
                    }                     
                      this.SecList.push({ divident: secdivtot, sector: secname });
                      secdiv=0;
              }
            secname=row.sector;
           // debugger;
            if(i==dataS.length)
            {
              this.dataSource1.filter = row.sector.trim().toLowerCase()
              for( let r of this.dataSource1.filteredData)
              {
                secdiv+=r.divident;
                secdivtot=secdiv; 
              }
              this.SecList.push({ divident: secdivtot, sector: row.sector });
              secdiv=0; 
            }
         i++;
        }
        this.dataSource2.data=this.SecList;
        console.log(this.SecList);
      }
      
      
     }  
}
