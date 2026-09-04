import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service'
import {DPCharges} from 'src/app/Models/DPCharges.model'
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort';  
import {HttpParams } from '@angular/common/http';
import {ConfirmdailogComponent } from '../confirmdailog/confirmdailog.component';
import {FormBuilder, FormGroup,ReactiveFormsModule} from '@angular/forms';
import {getInitials} from 'src/app/Sharedutils';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-dpcharges',
  templateUrl: './dpcharges.component.html',
  styleUrls: ['./dpcharges.component.css'],  
  standalone: true,
  imports: [MatIconModule,MatTableModule,MatSortModule, MatPaginatorModule,ReactiveFormsModule,ReactiveFormsModule,MatTooltipModule, CdkDrag, CdkDragHandle],
})
export class DPChargesComponent implements OnInit  {

  public updted:boolean=false;
  public nameshare:  string='';
  public printtot:  number=0;
  public currentuser:any;
  public combineuserd:any='';
   dataSource=new MatTableDataSource<DPCharges>
   frmDPC: FormGroup;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 displayedColumns: string[] = ['srno','posting_Date','debit', 'remarks','actions','uname'
]; 
 adddivlist: DPCharges[] = []; 
  result: any;
  usrid: any ; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private activatedRoute:ActivatedRoute,
    private employeser: SectorsService,  private _dialogRef: MatDialogRef<DPChargesComponent>
    ,public dialog: MatDialog,  private _fb: FormBuilder) {  
       this.frmDPC = this._fb.group({     

        });
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
    this.loadDPCharges();    
  }
  calculation(dataS: DPCharges[]) {
    let tot: number = 0;
     const distinctUsernames = Array.from(
    new Set(dataS.map(user => user.uname))); 
    if (dataS)
    for (let row of dataS) { 
      tot += row.debit; 
      if(this.currentuser==row.uname)
    {
      row.clsname='name-circle user';
    }
    else 
    {
    const index = distinctUsernames.findIndex(user => user === row.uname);
    const position = index !== -1 ? index + 1 : 0;
        row.clsname='name-circle user'+ position+'';
    }
    row.initialname=getInitials(row.uname);
    }

    this.printtot= Number(tot.toFixed(2)); 
   }
   @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }  
  editdata(_t124: any,idd: any,flag: string) {
  
 var lbl = document.getElementById(_t124+'_debitlbl') as HTMLInputElement;        
      var txt= document.getElementById(_t124+'_debitamt') as HTMLInputElement;  
      var edit = document.getElementById(_t124+'_edit') as HTMLInputElement; 
      var upd = document.getElementById(_t124+'_update') as HTMLInputElement; 
      var desc = document.getElementById(_t124+'_disc') as HTMLInputElement; 
      
        if(flag=='edit')
        {
        lbl.style.display='none';
        txt.style.display='';
        upd.style.display='';
        desc.style.display='';  
        edit.style.display='none';
        }
        if(flag=='cancel')
        {
          lbl.style.display='';
          txt.style.display='none';
          upd.style.display='none';
          desc.style.display='none';  
          edit.style.display='';
        }
        if(flag=='update')
          { 
            this.OpenPopconfirm(_t124,idd);
          }
  }
  OpenPopconfirm(t124: any,brokerageid: any) {
    const dialogConfig = new MatDialogConfig();  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const messagetxt = `Are you sure you want to do this?`;    
    dialogConfig.data={title: 'Update DP Charges',message: messagetxt}; 
     const dialogRef = this.dialog.open(ConfirmdailogComponent, {     
      data: dialogConfig.data
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult; 
      if(this.result)
      {
        this.updateDPC(t124,brokerageid);
      }
      else
      {
       this.editdata(t124,brokerageid,'cancel')
      }
     
    });
  }
  updateDPC(_t124: any,brokerageid: any){      
   var txt= document.getElementById(_t124+'_debitamt') as HTMLInputElement; 
  
   var brokamt=txt.value;
   const params = new HttpParams()
   .set('amt', brokamt)
   .set('id', brokerageid);
   this.employeser.updateDPC(params)
   .subscribe({
     next:(data) => {
      alert('Update successfully');
      this.loadDPCharges();            
      this.updted=true;
      this.redirectTo(); 
     },
     error:(err) => {
       console.log(err);
       alert( err.error);
     }
   })
     }
     redirectTo(){   
      if(this.updted)   {
        window.location.reload(); 
      }           
    }
  closepage() {
    this._dialogRef.close(true); 
    }  
    loadDPCharges() { 
      const dpparams = new HttpParams()
      .set('name', this.nameshare)
      .set('usrid', this.usrid)
      .set('combineusers', this.combineuserd);
      this.employeser.getDpCharges(dpparams).subscribe({
        next:(adddivlist)=> { 
          
        this.dataSource.data= adddivlist; 
        console.log(adddivlist);
        this.calculation(adddivlist);
        },
        error:(res)=>{console.log(res);}
      }) 
      this._dialogRef.backdropClick().subscribe(() => {
        // Close the dialog
        this._dialogRef.close();
      })
    } 
}
