import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {SectorsService} from '../Services/sectors.service';
import {FormBuilder, FormGroup,FormsModule,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import {BuySellTrade} from 'src/app/Models/BuySellTradebook';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import { DatePipe, DecimalPipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgIf,AsyncPipe,NgFor} from '@angular/common'; 
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Symbols} from 'src/app/Models/sectors.model'   
import {MatSelectModule} from '@angular/material/select'; 

@Component({
  selector: 'app-buy-sell-shares',
  templateUrl: './buysell-shares.component.html',
  styleUrls: ['./buysell-shares.component.css'],
  standalone: true,
  imports: [NgIf,ReactiveFormsModule,MatRadioModule,MatInputModule,MatFormFieldModule,
    MatAutocompleteModule,AsyncPipe,NgFor,MatSelectModule,FormsModule,DecimalPipe],
  providers: [DatePipe]
})
export class BuySellSharesComponent  implements OnInit{  
  public nameshare:  string='';
  public flagname:  string='';
  public symblid:  number=0;
  public myDate:any;
  public buytrue:boolean=false;
   public Notrue:boolean=true;
  public selltrue:boolean=false;
  public tradebookdate : Date = new Date();
  public printdate?:  string='';
  frmbst: FormGroup;  
  buyselldata:BuySellTrade;
  public  selectedStates:any;
  symbol = new  FormControl<string | Symbols>('');
  _symbolList: Symbols[] = [];      
  submitted: any;
  currentStringDate: string;
  constructor(private route: ActivatedRoute,private router: Router,private _fb: FormBuilder,
    private datePipe: DatePipe,private employeser: SectorsService) { 
      this.currentStringDate = new Date().toISOString().substring(0, 10);
      this.frmbst = this._fb.group({     
      symbol:new FormControl('', [Validators.required]), 
      isin:new FormControl(''), 
      tradedate:new FormControl(''),  
      exchange:new FormControl(''), 
      ttype :new FormControl('', [Validators.required]), 
      qty:new FormControl(0, [Validators.required]),
      price:new FormControl(0, [Validators.required]),
      tradeid :new FormControl(''), 
      userid: new FormControl(0, [Validators.required]),
      brokerage:new FormControl(0),
      broker:new FormControl('Zerodha', [Validators.required]),
      symbolid:new FormControl(0, [Validators.required]),
      isipo:new FormControl('0'),  
     });
     this.loadAllsymbols();  
  }  
  ngOnInit(): void {
    this.route.queryParams 
    .subscribe(params => { 
      console.log(params); 
      this.symblid=params['id']; 
      this.nameshare=params['Name'];
      this.flagname=params['flagnme'];  
           
    });    
     if (localStorage.getItem("UserId") != null) {
      this.frmbst.controls['userid'].setValue(localStorage.getItem("UserId"))
    }
    if(this.flagname=='buy')
    {
      this.buytrue=true;
      this.frmbst.controls['ttype'].setValue('buy'); 
    }
    else
    {
     // this.selltrue=true;
     // this.frmbst.controls['ttype'].setValue('sell'); 
    }       
    this.frmbst.controls['symbol'].setValue(this.nameshare); 
    this.printdate = this.datePipe.transform(this.tradebookdate, 'dd-MM-yyyy')||''; 
    this.frmbst.controls['tradedate'].setValue(this.printdate); 
    }
  loadAllsymbols() {   
    this.employeser.getallsectornames().subscribe({
      next:(_symbolList)=> { 
        this._symbolList= _symbolList.sort((a,b) => a.name.localeCompare(b.name)) ;  
      },
      error:(res)=>{console.log(res);}
    })
  }  
  processChange(event: Event)
  {  
    const filterValue = (event.target as HTMLInputElement).value;
    this.frmbst.controls['tradedate'].setValue(filterValue); 
  }

  get tradeValue(): number {
    const quantity = Number(this.frmbst.get('qty')?.value) || 0;
    const price = Number(this.frmbst.get('price')?.value) || 0;
    return quantity * price;
  }

  get totalTradeValue(): number {
    const brokerage = Number(this.frmbst.get('brokerage')?.value) || 0;
    const tradeType = this.frmbst.get('ttype')?.value?.toLowerCase();
    return tradeType === 'sell' ? this.tradeValue - brokerage : this.tradeValue + brokerage;
  }

  get brokerageOperation(): string {
    return this.frmbst.get('ttype')?.value?.toLowerCase() === 'sell' ? '-' : '+';
  }

  cleardata()
  {  
    this.frmbst.controls['isin'].setValue(''); 
    this.frmbst.controls['exchange'].setValue('');  
    this.frmbst.controls['ttype'].setValue(''); 
    this.frmbst.controls['qty'].setValue('0'); 
    this.frmbst.controls['price'].setValue('0'); 
    this.frmbst.controls['tradeid'].setValue(''); 
    this.frmbst.controls['brokerage'].setValue('0'); 
    this.frmbst.controls['broker'].setValue('Zerodha');
    this.frmbst.controls['symbolid'].setValue('0');      
    this.frmbst.controls['symbol'].setValue('0');
    this.frmbst.controls['isipo'].setValue('0');
  }
 onTradeTypeChange() {
    const tradeType = this.frmbst.get('ttype')?.value;
    if (tradeType === 'Buy') {
      this.flagname = 'buy'; 
    } else if (tradeType === 'Sell') {
      this.flagname = 'sell'; 
    }
  }
SaveDataVal() {   
  var etd = (document.getElementById("tradedate")) as HTMLInputElement;
  var rdoexc = (document.getElementById("exchange"));
  var e = (document.getElementById("ddlsymbol")) as HTMLSelectElement;
  var sel = e.selectedIndex;
  var opt = e.options[sel];
  var CurText = opt.text;
  var ddlval =opt.value; 
  this.frmbst.controls['symbol'].setValue(CurText); 
  this.frmbst.controls['symbolid'].setValue(ddlval); 
 
  if(etd.value!="")
    {
      etd.classList.remove('clserror'); // To ADD
    }
  this.frmbst.value;
  if (this.frmbst.valid) { 
  this.employeser.SaveTradebook(this.frmbst.value)
  .subscribe({
    next:(data) => { 
     alert('Added successfully');  
     this.cleardata();  
    this.loadAllsymbols();
    },
    error:(err) => {
      console.log(err);
      alert('Issue in data save');
    }
  })
  }
  else{ 
    if(etd.value=="")
      {
        etd.classList.add('clserror'); // To ADD
      }
      alert('Please fill the input');
  }
}
   
}
