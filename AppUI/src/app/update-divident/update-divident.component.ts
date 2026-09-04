 
import { Component, Inject, OnInit ,NgModule, Injectable} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog} from '@angular/material/dialog'; 
import { ActivatedRoute } from '@angular/router';  
import { FormBuilder, FormGroup,FormControl,Validators,ReactiveFormsModule,FormsModule,NgForm} from '@angular/forms'; 
import {SectorsService} from 'src/app/Services/sectors.service'
import {AddDivident} from 'src/app/Models/AddDivident.model'
import {MatIconModule} from '@angular/material/icon';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-update-divident',
  templateUrl: './update-divident.component.html',
  styleUrls: ['./update-divident.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,ReactiveFormsModule,MatIconModule,FormsModule, CdkDrag, CdkDragHandle],
})
export class UpdateDividentComponent implements OnInit { 
  frmDiv: FormGroup;
  public nameshare:  string='';
  public symbid: number;
   currentStringDate: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
  private _fb: FormBuilder,  private employeser: SectorsService,  private _dialogRef: MatDialogRef<UpdateDividentComponent>) {
    this.currentStringDate = new Date().toISOString().substring(0, 10);
    this.frmDiv = this._fb.group({     
       id:new FormControl(0), 
       name:new FormControl(''), 
       nos:new FormControl(0),  
       divpershare:new FormControl(0), 
       amount :new FormControl(0), 
       depositeDate:new FormControl(''),
       userid: new FormControl(0),
      userName:new FormControl(''),
      intialname:new FormControl(''), 
      });

  }
  addDivdata:AddDivident={   
    name:'',
    nos:0,
    divpershare:0,
    amount :0,
    depositeDate:'',
    userName:'' ,
    intialname:'' ,
    clsName:''
   }
  SaveDataVal(){    
    this.frmDiv.value;
      this.employeser.SaveDividennt(this.frmDiv.value)
    .subscribe({
      next:(data) => { 
       alert('Added successfully');
       this._dialogRef.close(true); 
      
      },
      error:(err) => {
        console.log(err);
        alert(err.error);
      }
    })
  }  
  closepage() {
    this._dialogRef.close(true); 
    }
  processChange(event: Event)
  {  
    const filterValue = (event.target as HTMLInputElement).value;
    this.frmDiv.controls['depositeDate'].setValue(filterValue); 
  }
  calamount() {
    const price=(document.getElementById('nos') as HTMLInputElement).value; 
    const pricepsh=(document.getElementById('divpershare') as HTMLInputElement).value; 
    this.frmDiv.controls['amount'].setValue((parseFloat(price)*parseFloat(pricepsh))); 
    
    }
    ngOnInit() {
      debugger;
      // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
      // this.activatedRoute.queryParams.subscribe(params => {
      //     const userId = params['id'];
      //     console.log(userId);
      //     this.frmDiv.controls['id'].setValue(params['id']); 
      //     this.frmDiv.controls['name'].setValue(params['Name']); 
      //     this.nameshare=params['name'];
      //     console.log( this.nameshare);
      //   });
      this.nameshare=this.data.Name;
      this.frmDiv.controls['name'].setValue(this.nameshare);
      this.frmDiv.controls['id'].setValue(this.data.id); 
      if (localStorage.getItem("UserId") != null) {
        this.frmDiv.controls['userid'].setValue(localStorage.getItem("UserId"))
      }
    }
  }
   
 
 
