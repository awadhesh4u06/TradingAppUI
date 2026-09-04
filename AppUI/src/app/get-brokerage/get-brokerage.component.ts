import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, HostListener, Inject ,OnInit, ViewChild} from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ActivatedRoute ,Router} from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service'
import {GetBrok} from 'src/app/Models/GetBrokerage.Model'
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort,  MatSortModule} from '@angular/material/sort';   
import {FormBuilder, FormGroup,FormControl,ReactiveFormsModule} from '@angular/forms';
import {getInitials} from 'src/app/Sharedutils';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { ConfirmdailogComponent } from '../confirmdailog/confirmdailog.component';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-get-brokerage',
  templateUrl: './get-brokerage.component.html',
  styleUrls: ['./get-brokerage.component.css'],
  standalone: true,
  imports: [MatIconModule, MatTableModule,MatSortModule, MatPaginatorModule,
    ReactiveFormsModule,ReactiveFormsModule,MatTooltipModule, CdkDrag, CdkDragHandle],
})
export class GetBrokerageComponent implements OnInit{
  public currentuser:any;
  public combineuserd:any='';
  public nameshare:  string='';
  public printtot:  number=0;
  public updted:boolean=false;
   dataSource=new MatTableDataSource<GetBrok>
   frmBrok: FormGroup;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

 displayedColumns: string[] = ['date','tradeType', 'qty','rate','finalPrice' ,'brok','actions','uName']; 
 brokeragelist: GetBrok[] = []; 
  result: any;
  usrid: any=1;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private activatedRoute:ActivatedRoute,private router: Router,
    private employeser: SectorsService,  
    private _dialogRef: MatDialogRef<GetBrokerageComponent>, 
    private _fb: FormBuilder,public dialog: MatDialog) {
   
      this.frmBrok = this._fb.group({     
        brokid:new FormControl(0), 
        brokamt:new FormControl(0),  
        userid: new FormControl(0),
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
   this.LoadData();    
  } 
  calculation(dataS: GetBrok[]) {
    const distinctUsernames = Array.from(
    new Set(dataS.map(user => user.uName))); 
    let tot: number = 0;
    if (dataS)
    for (let row of dataS) {  
      tot += row.brok; 
      row._brokg=  Number(row.brok.toFixed(2)); 
       if(this.currentuser==row.uName)
    {
      row.clsname='name-circle user';
    }
    else 
    {
    const index = distinctUsernames.findIndex(user => user === row.uName);
    const position = index !== -1 ? index + 1 : 0;
        row.clsname='name-circle user'+ position+'';    }
    row.initialname=getInitials(row.uName);
    }
    this.printtot= Number(tot.toFixed(2));  
     
   }
   @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();   
  }
  closepage() {
   this._dialogRef.close(true);   
    }
    LoadData() { 
      const getparams = new HttpParams()
      .set('name', this.nameshare)
      .set('usrid', this.usrid)
      .set('combineusers', this.combineuserd);
      this.employeser.getbrokerageCharges(getparams).subscribe({
        next:(brokeragelist)=> {           
        this.dataSource.data= brokeragelist; 
        
        this.calculation(brokeragelist);
        },
        error:(res)=>{console.log(res);}
      }) 
      this._dialogRef.backdropClick().subscribe(() => { 
        this._dialogRef.close();
      })
    }  
    redirectTo(){   
      if(this.updted)   {
        window.location.reload(); 
      }           
    }
    OpenPopconfirm(t124: any,brokerageid: any) {
      const dialogConfig = new MatDialogConfig();  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const messagetxt = `Are you sure you want to do this?`;
      
      dialogConfig.data={title: 'Update Brokerage',message: messagetxt}; 
    const dialogRef = this.dialog.open(ConfirmdailogComponent, {
       
        data: dialogConfig.data
      }); 
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult; 
        if(this.result)
        {
          this.updatebrok(t124,brokerageid);
        }
        else
        {
         this.editdata(t124,brokerageid,'cancel')
        }
       
      });
    }
     updatebrok(_t124: any,brokerageid: any){      
      var txt= document.getElementById(_t124+'_brkamt') as HTMLInputElement; 
     
      var brokamt=txt.value;
      const params = new HttpParams()
      .set('amt', brokamt)
      .set('id', brokerageid);
      this.employeser.updatebrokerage(params)
      .subscribe({
        next:(data) => {
         alert('Update successfully');
         this.LoadData();            
         this.updted=true;
         this.redirectTo(); 
        },
        error:(err) => {
          console.log(err);
          alert( err.error);
        }
      })
        }
    editdata(_t124: any,brokerageid: any,flag:string) {   
      var lbl = document.getElementById(_t124+'_brkamtlbl') as HTMLInputElement;        
      var txt= document.getElementById(_t124+'_brkamt') as HTMLInputElement;  
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
          this.OpenPopconfirm(_t124,brokerageid);
        }
      }
}
