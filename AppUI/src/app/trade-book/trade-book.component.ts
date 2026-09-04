import {tradebook} from '../Models/tradebook.model';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSort,MatSortModule} from '@angular/material/sort';
import {SectorsService} from 'src/app/Services/sectors.service'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {GetDividentsComponent} from 'src/app/get-dividents/get-dividents.component'  
import {MatSelectModule,MatSelect } from '@angular/material/select'; 
import {NgFor,NgClass} from '@angular/common';
import {sectorsfilter} from '../Models/sectorsfilter.model ';
import {DPChargesComponent} from '../dpcharges/dpcharges.component';
import {GetBrokerageComponent } from '../get-brokerage/get-brokerage.component';
import {TradeLotComponent } from '../trade-lot/trade-lot.component';
import {environment} from 'src/environments/environment'
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {FormsModule, FormGroup, FormBuilder,FormArray } from '@angular/forms'
import {userdetails} from 'src/app/Models/Userdetails.model'
import { HttpParams } from '@angular/common/http';

@Component({ 
  templateUrl: './trade-book.component.html',
  styleUrls: ['./trade-book.component.css'],
  standalone: true,
  imports: [ MatTableModule,MatSortModule, MatPaginatorModule, MatFormFieldModule,MatInputModule,MatTooltipModule,
    MatSelectModule,NgFor,MatCheckboxModule,FormsModule,NgClass ],
})
export class TradeBookComponent implements AfterViewInit {
  checked = false;
  maxmin : number=25;
  maxall : number=150;
  addForm: FormGroup;
  itemForm: FormGroup;
   rows: FormArray<FormGroup>;
  displayedColumns: string[] = ['symbol','sector', 'qty','buyValue','sellValue', 'realPL','divident','real_Div', 
'openQty','openVal','dp','buy_Share','sell_Share','brokerage','op','oP_Div', 'profit_Share', 'profitPer','protWeight']; 
_symbolList: sectorsfilter[] = [];  
  dataSource=new MatTableDataSource<tradebook>
  _dataSource=new MatTableDataSource<tradebook>
  tradebookList: tradebook[] = []; 
  tradebook_List: tradebook[] = [];  
  tradebookLst: tradebook[] = []; 
  userlist: userdetails[] = []; 
 public printRL: Number=0;
 public printdiv: Number=0;
 public printdp: Number=0;
 public printbrok: Number=0;
 public printfinal: Number=0;
 public printfinal_div: Number=0;
 public printper: Number=0;
 public printamc: Number=0;
 public printfin_amc: Number=0;
 public printfin_tot: Number=0;
 public printfin_act: Number=0;
public openval: Number=0;
 public usrid:any=1;
 activeClass: boolean;  
 public combineuserd:any='';
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild('userSelect') userSelect!: MatSelect ;

  ddlval: any;
   ngAfterViewInit() {    
   this.dataSource.sort = this.sort; 
   this.dataSource.paginator = this.paginator;
   }
   constructor(private employeser:SectorsService,private _dailog:MatDialog,private fb: FormBuilder) {
    this.loadTradeBook(); 
    this.loadsectors();
     this.loadusers();  
    environment.production=true;
  } 
  loadTradeBook() {    
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
       const params = new HttpParams()
       .set('userid', this.usrid)
       .set('combineusers', this.combineuserd);
    this.employeser.getTradebook(params).subscribe({
      next:(tradebookList)=> {         
      this.dataSource.data= tradebookList; 
      this._dataSource.data= tradebookList; 
      this.calculation(tradebookList);
      },
      error:(res)=>{console.log(res);}
    })
  }  
  loadsectors()
  {
    this.employeser.GetSectorFilter().subscribe({
      next:(_symbolList)=> { 
        this._symbolList= _symbolList; 
      },
      error:(res)=>{console.log(res);}
    })
  }
loadusers()
{
  this.employeser.getusers().subscribe({
    next:(userlist)=> {   
       this.userlist= userlist.filter(userlist => userlist.userid!=this.usrid);      
    },
    error:(res)=>{console.log(res);}
  })
}
  calculation(dataS: tradebook[]) {
    let RL: number = 0;
    let DV: number = 0;
    let Dpc: number = 0;
    let pbr: number = 0;
    let fin: number = 0;
    let findv: number = 0;
    let buyval: number = 0;
    let per: number = 0;
    let tot: number = 0;
    let active: number = 0;
    let ov:number=0;
    if (dataS)
      for (let row of dataS) { 
        RL += row.realPL;
        DV+=row.divident;
        Dpc+=row.dp;
        pbr+=row.brokerage;
        buyval+=row.buyValue;
        ov+=row.openVal;
        if(row.openQty!=0)
        {
          active+=1;
        }
        tot+=1;
        if(row.sector.trim().length>13)
        {
          row.secaka=row.sector.trim().substring(0,13)+'...'
        }
        else
        {
          row.secaka=row.sector.trim();
        }
        row._brokg=  Number(row.brokerage.toFixed(2)); 
      }
      fin =(RL-(Dpc+pbr));
      findv=fin+DV; 
      if(buyval>0)
      {
        per=((fin*100)/buyval);
      }
     else{
      per=((fin));
     }
      this.printRL= Number(RL.toFixed(2)); 
      this.printdiv= Number(DV.toFixed(2)); 
      this.printdp= Number(Dpc.toFixed(2)); 
      this.printbrok= Number(pbr.toFixed(2)); 
      this.printfinal= Number(fin.toFixed(2)); 
      this.printper= Number(per.toFixed(2)); 
      this.printfinal_div= Number(findv.toFixed(2)); 
      this.printfin_tot= Number(tot.toFixed(2)); 
      this.printfin_act= Number(active.toFixed(2)); 
      this.openval=Number(ov.toFixed(2)); 
  }
  applyFilter(event: Event) {   
    const filterValue = (event.target as HTMLInputElement).value;  
    var ddlvale=document.getElementById('ddlsect')?.innerText as string; 
    if( ddlvale!=undefined && ddlvale!='None' && ddlvale!='none' && ddlvale!='' && ddlvale!='IPO' && ddlvale!='ipo' )
    {    
     this.ddlval=ddlvale;
     this.tradebook_List=  this._dataSource.data;         
     this.tradebook_List=this.tradebook_List.filter(tradebook_List => tradebook_List.sector?.toLowerCase().includes(ddlvale.trim().toLowerCase()));
     this.tradebook_List= this.tradebook_List.filter(tradebook_List => tradebook_List.symbol?.toLowerCase().includes(filterValue.trim().toLowerCase()));
     this.dataSource.data =  this.tradebook_List ; 
    }
    else if(ddlvale.toLocaleLowerCase()=='ipo')
    {    
     this.ddlval=ddlvale;
     this.tradebook_List=  this._dataSource.data;         
     this.tradebook_List=this.tradebook_List.filter(tradebook_List => tradebook_List.ipo!=0);    
     this.tradebook_List= this.tradebook_List.filter(tradebook_List => tradebook_List.symbol?.toLowerCase().includes(filterValue.trim().toLowerCase()));
     this.dataSource.data =  this.tradebook_List ; 
    //  this.dataSource.filteredData=  this.tradebook_List ; 
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
Select_val(event: any) { 
  const Val = event; 
  this.combineuserd=Val;
   // Close the dropdown after selection
    this.userSelect.close();
    this.loadTradeBook() 
}
Selectval(event: any) { 
  const filterValue = event; 
  this.dataSource.data=this._dataSource.data; 
  (document.getElementById('filter') as HTMLInputElement).value='';
  if(event==undefined|| event=='none')
  {
    this.dataSource.filter= '';
  }
  else if(event.toLocaleLowerCase()=='ipo')
  {
    this.tradebook_List=  this._dataSource.data; 
    this.tradebook_List= this.tradebook_List.filter(tradebook_List => tradebook_List.ipo!=0);   
    console.log(this.tradebook_List);
    this.dataSource.data =  this.tradebook_List ;   
    this.dataSource.filter= '';
  }
  else{
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  if (this.dataSource.paginator) { 
    this.dataSource.paginator.firstPage(); 
    this.calculation(this.dataSource.filteredData);
  } 
} 
SelectActive(event: any)
{  
  const filterValue = event;
  this.dataSource.data=this._dataSource.data; 
  if(filterValue)
    {    
    this.tradebook_List=  this._dataSource.data; 
    this.tradebook_List= this.tradebook_List.filter(tradebook_List => tradebook_List.openQty!=0);   
    console.log(this.tradebook_List);
    this.dataSource.data =  this.tradebook_List ; 
  }
  if (this.dataSource.paginator) { 
    this.dataSource.paginator.firstPage(); 
    this.calculation(this.dataSource.filteredData);
  } 
}
  ShowDivDetails(symbName:string,val :string) {
    if(Number(val)>0)
    { 
     this.OpenPopUpdivident(symbName)
    } 
  }

  ShowDPDetails(symbName:string,val :string) {     
    if(Number(val)>0)
    {     
     this.OpenPopUpDPC(symbName)
    } 
  }
  ShowBrokerage(symbName:string,val :string) {
      if(Number(val)>0)
      {     
      this.OpenPopUpbrok(symbName)
      } 
    }
    ShowTradeLot(symbName:string) {
      const dialogConfig = new MatDialogConfig();  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data={Name: symbName,combineusers:this.combineuserd};       
      this._dailog.open(TradeLotComponent, dialogConfig);
  }
      
OpenPopUpdivident(smbName: string) {
  const dialogConfig = new MatDialogConfig();  
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = { Name: smbName, combineusers: this.combineuserd }; 
  dialogConfig.panelClass = 'draggable-dialog';
  dialogConfig.position = { left: '2vh', top: '10vh' }; // Open on the left side
  this._dailog.open(GetDividentsComponent, dialogConfig);
}
 
  OpenPopUpDPC(smbName: string) {
    const dialogConfig = new MatDialogConfig();  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data={Name: smbName,combineusers:this.combineuserd}; 
    this._dailog.open(DPChargesComponent, dialogConfig);
  }
  opendata()
    {      
      this.activeClass = !this.activeClass    
    }
    closepop()
    {
      this.activeClass = !this.activeClass  
    }
  OpenPopUpbrok(smbName: string) {
    const dialogConfig = new MatDialogConfig();  
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data={Name: smbName,combineusers:this.combineuserd}; 
    this._dailog.open(GetBrokerageComponent, dialogConfig);
  }  
}
