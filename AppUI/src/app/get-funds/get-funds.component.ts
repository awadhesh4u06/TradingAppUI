import {Component, ViewChild } from '@angular/core'; 
import { SectorsService } from '../Services/sectors.service';
import {FormBuilder, FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { Funddetails} from 'src/app/Models/Funds.model'; 
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input'; 
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';  
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import{FyFundsComponent} from 'src/app/fy-funds/fy-funds.component'
@Component({
  selector: 'app-get-funds',
  templateUrl: './get-funds.component.html',
  styleUrls: ['./get-funds.component.css'],
  standalone: true,
  imports: [MatTableModule,MatSortModule, MatPaginatorModule,MatInputModule,
    MatSelectModule,MatButtonModule,FormsModule,ReactiveFormsModule],

})
export class GetFundsComponent { 
  _dataSource=new MatTableDataSource<Funddetails>
  dataSource=new MatTableDataSource<Funddetails>
  _List: Funddetails[] = [];  
  ddlval: any;
  public usrid:any=0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['particulars','date','debit','credit']; 
  public printtot: Number=0;
  public printcredit: Number=0;
  public printdebit: Number=0; 
  
  frmbst: FormGroup; 
  currentStringDate: string;
  public updted:boolean=false;
  constructor(private employeser:SectorsService,private _fb: FormBuilder,private _dailog:MatDialog) {  
    this.currentStringDate = new Date().toISOString().substring(0, 10);

   this.frmbst = this._fb.group({     
    Perticlar:new FormControl('', [Validators.required]), 
    partidate:new FormControl(''),      
    debit:new FormControl(0),
    credit:new FormControl(0),  
    userid: new FormControl(0, [Validators.required])  
   });
   if (localStorage.getItem("UserId") != null) {
    this.frmbst.controls['userid'].setValue(localStorage.getItem("UserId"))
  }
  } 
  ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
    }

  ngOnInit(): void {  
    this.LoadFunds();    
  } 
  SaveDataVal()
  {  
    const params = new HttpParams()
     .set('particulars', this.frmbst.controls['Perticlar'].value)
     .set('date', this.frmbst.controls['partidate'].value)
     .set('debit', this.frmbst.controls['debit'].value)
     .set('credit', this.frmbst.controls['credit'].value)
     .set('id', this.frmbst.controls['userid'].value)
    this.employeser.AddFunds(params)
    .subscribe({
      next:(data) => {
       alert('Update successfully');
      //  this.LoadFunds();            
       this.updted=true;
       this.redirectTo(); 
      },
      error:(err) => {
        console.log(err);
        alert( err.error);
      }
    })
  } 
  opendailogfy()
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    //dialogConfig.width='600px';
   // dialogConfig.panelClass='epsSelectorPanel';
    this._dailog.open(FyFundsComponent, dialogConfig); 
  }
  calculation(dataS: Funddetails[]) {
    let totdebit: number = 0;
    let totcredit: number = 0;
    if (dataS)
    for (let row of dataS) { 
      totdebit += row.debit;  
      totcredit+=row.credit;
    }    
    
    this.printcredit =  Number(totcredit.toFixed(2)); 
    this.printdebit=  Number(totdebit.toFixed(2)); 
    this.printtot=Number((totcredit-totdebit).toFixed(2));
   }
   processChange(event: Event)
   {  
     const filterValue = (event.target as HTMLInputElement).value;
     this.frmbst.controls['partidate'].setValue(filterValue); 
   }
   redirectTo(){   
    if(this.updted)   {
      window.location.reload(); 
    }           
  }
   applyFilter(event: Event) {     
    const filterValue = (event.target as HTMLInputElement).value;  
     var ddlvale=document.getElementById('ddlsect')?.innerText as string; 
     
    if( ddlvale!=undefined && ddlvale!='None'  && ddlvale!='none' && ddlvale!='' )
      {    
        this.ddlval=ddlvale;
       this._List=  this._dataSource.data;   

         if(ddlvale=='Debit'){
             this._List=this._List.filter(_List => _List.debit!=0);     
           }
        else
        {
          this._List=this._List.filter(_List => _List.credit!=0);  
        }
        this.dataSource.data =  this._List ; 
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
      else
      {
        this.dataSource.data=this._dataSource.data;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    if (this.dataSource.paginator) { 
      this.dataSource.paginator.firstPage(); 
      this.calculation(this.dataSource.filteredData);
    }
}
  LoadFunds(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.employeser.GetFunddetails(this.usrid).subscribe({
      next:(Fd)=> {         
        this.dataSource.data= Fd; 
        this._dataSource.data= Fd;  
        this.calculation(Fd);
      },
      error:(res)=>{console.log(res);}
    })
  } 

  Selectval(event: any) {  
    const filterVal=  (document.getElementById('filter') as HTMLInputElement).value='';
    const filterValue = event; 
    this._List=  this._dataSource.data; 
  
    if(event==undefined|| event=='none')
    {
      this.dataSource.data=  this._dataSource.data; 
      this.dataSource.filter= filterVal.trim().toLowerCase();
    }
     
    else if(event=='Debit'){
    this._List=this._List.filter(_List => _List.debit!=0);  
    this.dataSource.data =  this._List ;  
    this.dataSource.filter = filterVal.trim().toLowerCase();
    }
    else if(event=='Credit'){
      this._List=this._List.filter(_List => _List.credit!=0);  
      this.dataSource.data =  this._List ; 
      this.dataSource.filter = filterVal.trim().toLowerCase();
      }
    if (this.dataSource.paginator) { 
      this.dataSource.paginator.firstPage(); 
      this.calculation(this.dataSource.data);
    } 
  } 
}