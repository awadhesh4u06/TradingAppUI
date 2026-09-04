import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'; 
import { SectorsService } from '../Services/sectors.service';
import {LIC} from 'src/app/Models/LIC.Model'; 
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input'; 
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {NgIf,AsyncPipe,NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select'; 
import { MatDialogConfig,MatDialog } from '@angular/material/dialog';
import { LICDetailsComponent } from '../lic-details/lic-details.component';
@Component({
  selector: 'app-lic',
  templateUrl: './lic.component.html',
  styleUrls: ['./lic.component.css'],
  standalone: true,
  imports: [MatTableModule,MatSortModule, MatPaginatorModule,MatInputModule
    ,MatButtonModule,FormsModule,ReactiveFormsModule,NgFor,MatSelectModule],
})
export class LICComponent implements AfterViewInit{
  amcamount: any;
  _dataSource:  LIC[]=[];
 
  dataSource=new MatTableDataSource<LIC>
  public usrid:any=0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['policyName','policyNumber','startDate','sumInsurance','timePeriod','amtwithGST','casebackAmt','amtRd'
    ,'maturtydate'
  ]; 
  frmlic: FormGroup; 
  currentStringDate: string;
  constructor(private employeser:SectorsService ,private _fb: FormBuilder,private router: Router,private _dailog:MatDialog) {
    this.currentStringDate = new Date().toISOString().substring(0, 10);
    this.frmlic = this._fb.group({     
      id:new FormControl(0), 
      policyName:new FormControl(''),    
      policyNumber:new FormControl(''),  
      startDate:new FormControl(''),     
      sumInsurance:new FormControl(0), 
      timePeriod:new FormControl(0),       
      amtwithGST:new FormControl('', [Validators.required]),  
      casebackAmt:new FormControl(),
      amtRd:new FormControl(),     
      rD_ACNO:new FormControl(''),  
      maturtydate:new FormControl(''),   
      paymentDate:new FormControl(''),
      userid: new FormControl(0, [Validators.required])  ,
     });
     if (localStorage.getItem("UserId") != null) {
      this.frmlic.controls['userid'].setValue(localStorage.getItem("UserId"))
    }
     
 }
 ngAfterViewInit() {    
  this.dataSource.sort = this.sort; 
  this.dataSource.paginator = this.paginator;
  }

ngOnInit(): void {  
  this.LoadData();    
}
processChange(event: Event)
{  
  const filterValue = (event.target as HTMLInputElement).value;
  this.frmlic.controls['startDate'].setValue(filterValue); 
}
Selectval(event: any) {
  //debugger;
  const filterValue = event;
  this.frmlic.controls['id'].setValue(filterValue); 
}
LoadData(){   
  if (localStorage.getItem("UserId") != null) {
    this.usrid=localStorage.getItem("UserId");
  }
  this.employeser.getLIC(this.usrid).subscribe({
    next:(IC)=> {         
      this.dataSource.data= IC; 
      this._dataSource= IC; 
      console.log(IC);
       
    },
    error:(res)=>{console.log(res);}
  })
}
 ShowDetails(licid:number,val :string){ 
       this.OpenPopUp(licid,val)   
  }
  OpenPopUp(licid:number,val :string) {
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.data={licid: licid,name:val}; 
    this._dailog.open(LICDetailsComponent, dialogConfig);
  }
SaveDataVal()
  {  
    this.frmlic.value;
   
    if (this.frmlic.valid) { 
      this.employeser.SaveLIC(this.frmlic.value)
      .subscribe({
        next:(data) => { 
         alert('Added successfully');          
         window.location.reload(); 
        },
        error:(err) => {
          console.log(err);
          alert('Issue in data save');
        }
      })
      }  else{ 
         
          alert('Please fill the input');
      }
   } 
}
