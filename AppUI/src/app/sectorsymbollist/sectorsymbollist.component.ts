
import {Symbols} from 'src/app/Models/sectors.model' 
import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
 
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {SectorsService} from 'src/app/Services/sectors.service'
import { Router } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgFor, AsyncPipe} from '@angular/common';
 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddSymbolComponent } from 'src/app/add-symbol/add-symbol.component'; 
import { UpdateDividentComponent } from 'src/app/update-divident/update-divident.component'  
@Component({
  selector: 'app-sectorsymbollist',
  templateUrl: './selectsymbollists.component.html',
  styleUrls: ['./sectorsymbollist.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule,
     MatSortModule, MatPaginatorModule, NgFor,
     AsyncPipe],
})
 
export class SectorsymbollistComponent implements AfterViewInit 
 {  
 
   displayedColumns: string[] = ['srno','id', 'name', 'sector','Divident','buy','sell']; 
   dataSource=new MatTableDataSource<Symbols>
   symbolList: Symbols[] = []; 
   
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

    ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
    }

  constructor(private employeser:SectorsService,private _dailog:MatDialog,private router: Router) {      
    this.loadAllsymbols(); 
  } 
  
  goToPage(SymbId :string,symbName:string,flag:string){  
    if(flag=='div')
    {
      this.OpenPopUpdivident(SymbId ,symbName);
    }
    if(flag=='buy' || flag=='sell')
    {
      this.OpenBuypopup(SymbId ,symbName,flag);
    }
     
  }
  loadAllsymbols() {   
    this.employeser.getallsectornames().subscribe({
      next:(symbolList)=> { 
        
      this.dataSource.data= symbolList; 
      },
      error:(res)=>{console.log(res);}
    })
  }  
  
  OpenBuypopup(SymbId :string,symbName:string,flagname:string){
    //const dialogConfig = new MatDialogConfig();    
    //   dialogConfig.disableClose = true;
    //   dialogConfig.autoFocus = true;
     //  dialogConfig.data={id: SymbId, Name: symbName,flagnme: flagname};     
    //   this._dailog.open(BuySellTradebookComponent, dialogConfig);      
  //   debugger;  
         // this.router.navigate(['/buysell-shares'], { queryParams:{ id: SymbId, Name: symbName,flagnme: flagname } });
          const host: string =  location.origin;
          const url: string = host + '/#/' + String(this.router.createUrlTree(['/buysell-shares'], 
          { queryParams: { id: SymbId, Name: symbName,flagnme: flagname } }));
          window.open(url, '_blank');
         
}
  OpenPopUpdivident(SymbId :string,symbName:string){
      const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data={id: SymbId, Name: symbName};
        //dialogConfig.width='600px';
       // dialogConfig.panelClass='epsSelectorPanel';
        this._dailog.open(UpdateDividentComponent, dialogConfig);        
  }
  openNewTab(SymbId :string,symbName:string) { 
    const host: string =  location.origin;
           const url: string = host +  String(this.router.createUrlTree(['/update-divident'],
            { queryParams: { id: SymbId, Name: symbName } }));
           window.open(url, '_blank');
  }
    opendailogadd() {
      const dialogRef = this._dailog.open(AddSymbolComponent)
      dialogRef.afterClosed().subscribe({        
        next: (val) => {
          if (val) { 
            this.loadAllsymbols();
          }
        },
      });
    }
   
    applyFilter(event: Event) { 
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }
 
 
}
 