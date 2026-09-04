import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'; 
import { SectorsService } from '../Services/sectors.service';
import {Amc} from 'src/app/Models/Amc.model'; 
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input'; 
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-amc',
  templateUrl: './amc.component.html',
  styleUrls: ['./amc.component.css'],
  standalone: true,
  imports: [MatTableModule,MatSortModule, MatPaginatorModule,MatInputModule
    ,MatButtonModule,FormsModule,ReactiveFormsModule],
})
export class AmcComponent implements AfterViewInit{
  amcamount: any;
  _dataSource=new MatTableDataSource<Amc>
  dataSource=new MatTableDataSource<Amc>
  public usrid:any=0;
  frmamc: FormGroup; 
  currentStringDate: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['from_Date','to_Date','postingDate','amount','remarks']; 
  public printtot: Number=0;
  constructor(private employeser:SectorsService ,private _fb: FormBuilder,private router: Router) {    
    this.currentStringDate = new Date().toISOString().substring(0, 10);
    this.frmamc = this._fb.group({     
      from_Date:new FormControl('', [Validators.required]), 
      to_Date:new FormControl('', [Validators.required]),      
      postingDate:new FormControl('', [Validators.required]),
      amc_amount:new FormControl(''),  
      remarks:new FormControl(''),  
      userid: new FormControl(0, [Validators.required])  
     });
     if (localStorage.getItem("UserId") != null) {
      this.frmamc.controls['userid'].setValue(localStorage.getItem("UserId"))
    }
  } 
  onChange() {
    var frd = (document.getElementById("from_Date")) as HTMLInputElement;
    var tod = (document.getElementById("to_Date")) as HTMLInputElement;
    var amt = (document.getElementById("amc_amount")) as HTMLInputElement;     
    this.amcamount ='AMC for Demat Account for '+frd.value +' to '+tod.value+' Rs. '+ amt.value; 
    this.frmamc.controls['remarks'].setValue(this.amcamount); 
  }
  resetform()
  {  
   
    this.frmamc.controls['from_Date'].setValue(''); 
    this.frmamc.controls['to_Date'].setValue(''); 
    this.frmamc.controls['postingDate'].setValue(''); 
    this.frmamc.controls['amc_amount'].setValue(''); 
    this.frmamc.controls['remarks'].setValue(''); 
    this.amcamount ='';
  }
  SaveDataVal() {
    this.frmamc.value;
      
     if (this.frmamc.valid) { 
      this.employeser.SaveAmc(this.frmamc.value)
      .subscribe({
        next:(data) => { 
         alert('Added successfully'); 
         this.resetform();
         this.LoadData();  
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
    
  ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
    }

  ngOnInit(): void {  
    this.LoadData();    
  } 
  calculation(dataS: Amc[]) { 
    let tot: number = 0;
    if (dataS)
    for (let row of dataS) { 
      tot += row.amount; 
        
    }    
    this.printtot=  Number(tot.toFixed(2)); 
   }
  LoadData(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    this.employeser.getAMC(this.usrid).subscribe({
      next:(IC)=> {         
        this.dataSource.data= IC; 
        this._dataSource.data= IC; 
        console.log(IC);
        this.calculation(IC);
      },
      error:(res)=>{console.log(res);}
    })
  } 
}
