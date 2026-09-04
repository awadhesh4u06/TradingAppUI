import { Component, Inject, OnInit } from '@angular/core';
import {SectorsService} from 'src/app/Services/sectors.service'
import {NgIf,AsyncPipe,NgFor} from '@angular/common';
import { FormBuilder, FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map,startWith } from 'rxjs/operators';
import {sectorsfilter} from 'src/app/Models/sectorsfilter.model '    
import {MatSelectModule} from '@angular/material/select'; 
@Component({
  selector: 'app-add-symbol',
  templateUrl: './add-symbol.component.html',
  styleUrls: ['./add-symbol.component.css'],
  standalone: true,
  imports: [NgIf,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule, MatAutocompleteModule,
    AsyncPipe,NgFor,MatSelectModule],
})

export class AddSymbolComponent implements OnInit  {
  empForm: FormGroup;
  sector_name = new  FormControl<string | sectorsfilter>('');
_symbolList: sectorsfilter[] = [];  
   filteredOptions: Observable<sectorsfilter[]>; 
   colorList: sectorsfilter[] = [];  
   
constructor(private _fb: FormBuilder,  private employeser: SectorsService,
  private _dialogRef: MatDialogRef<AddSymbolComponent>,@Inject(MAT_DIALOG_DATA) public data: any
 ,  private router: Router ) {
   
  this.empForm = this._fb.group({
  symbolname: new FormControl('', [Validators.required]),   
  sectorname:new FormControl('', [Validators.required]),    
   Id:new FormControl(0), 
   Name:new FormControl(''),
   Sector:new FormControl(''),
   colorName:new FormControl(''),
  });  
}
  loadSectorFilter() {    
    this.employeser.GetSectorFilter().subscribe({
      next:(_symbolList)=> { 
        this._symbolList= _symbolList; 
        console.log(this._symbolList);
      },
      error:(res)=>{console.log(res);}
    })
  }  
  loadColorList() {    
    this.employeser.GetColorList().subscribe({
      next:(lst)=> { 
        this.colorList= lst;  
        console.log(lst);
      },
      error:(res)=>{console.log(res);}
    })
  }  
ngOnInit(): void {   
  this.loadColorList();  
   this.loadSectorFilter();  
  this.empForm.patchValue(this.data); 
  this.filteredOptions =this.sector_name.valueChanges.pipe(
    startWith(''),  
    map(value => {
      const name = typeof value === 'string' ? value : value?.sector;     
      return name ? this._filter(name as string) : this._symbolList.slice();
    }),
  );    
 
} 
processChange1(event: Event,val:any)
{ 
 const filterid = (event.target as HTMLInputElement); 
 filterid.style.background=val;
}
displayFn(user: sectorsfilter): string {  
  return user && user.sector ? user.sector : '';
}
processChange(event: Event)
{ 
 const filterValue = (event.target as HTMLInputElement).value;
 this.empForm.controls['sectorname'].setValue(filterValue);  
}
Selectval(nameval:any)
{
  var valsave=nameval;
 this.empForm.controls['sectorname'].setValue(valsave); 
}
Select_val(nameval:any)
{debugger;
  var valsave=nameval;
 this.empForm.controls['colorName'].setValue(valsave); 
 
 var e = (document.getElementById("ddlcolor")) as HTMLSelectElement;
 e.style.background=nameval;
}
Select_val1(nameval:any)
{debugger;
  var valsave=nameval;
 this.empForm.controls['colorName'].setValue(valsave); 
}
private _filter(vale: string): sectorsfilter[] {
  const filterValue = vale?.toLowerCase(); 
  return this._symbolList.filter(_symbolList => _symbolList.sector?.toLowerCase().includes(filterValue));
}
closeDialog(){ 
  this._dialogRef.close();  
}
onFormSubmit() {   
  debugger; 
  if (this.empForm.valid) {   
      this.employeser.addsymboldata(this.empForm.value).subscribe({
        next: (val: any) => {        
          alert('Added successfully');
          this._dialogRef.close(true); 
        },
        error: (err: any) => {
          console.error(err);
        },
      });    
  } 
  else{  
     if(this.empForm.dirty)  
    alert('Added Not Added');
  }
} 
}