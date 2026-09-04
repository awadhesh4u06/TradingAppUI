import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'; 
import { SectorsService } from '../Services/sectors.service'; 
import {tradebook} from '../Models/tradebook.model';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input'; 
import {MatSort, MatSortModule} from '@angular/material/sort'; 
import Chart  from 'chart.js/auto';
import { HttpParams } from '@angular/common/http';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-sector-report',
  templateUrl: './sector-report.component.html',
  styleUrls: ['./sector-report.component.css'],
  standalone: true,
  imports: [MatTableModule,MatSortModule, MatPaginatorModule,MatInputModule],
})
export class SectorReportComponent implements AfterViewInit{
  _dataSource=new MatTableDataSource<tradebook>
  dataSource=new MatTableDataSource<tradebook>
  public usrid:any=0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sector','realPL','divident','real_Div','op','oP_Div','profitPer','proPer_Div']; 
  public chart: any; 
  data: any;
  labels=[];
  values=[];
  lineChartData:tradebook[] 
  constructor(private employeser:SectorsService) {   
     
  } 
  ngAfterViewInit() {    
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
    Chart.register(ChartDataLabels);
    }

  ngOnInit(): void {  
    this.LoadData();    
  } 
   
  LoadSortData(){    
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
     
  var e = (document.getElementById("ddlsortcolm")) as HTMLSelectElement;
  var sel = e.selectedIndex;
  var opt = e.options[sel]; 
  var ddlval =opt.value; 
  var ee = (document.getElementById("ddldir")) as HTMLSelectElement;
  var selc = ee.selectedIndex;
  var optn = ee.options[selc]; 
  var drs =optn.value; 
    
    const divparams = new HttpParams()
    .set('colname', ddlval)
    .set('usrid', this.usrid)
    .set('dir',drs);
    this.employeser.getsectorconsolidated(divparams).subscribe({ 
      next:(IC)=> {    
           
        this.createChart(IC,ddlval);
      },
      error:(res)=>{console.log(res);}
    })
  } 
  LoadData(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    const divparams = new HttpParams()
    .set('colname', 'sector')
    .set('usrid', this.usrid)
    .set('dir','Asc');
    this.employeser.getsectorconsolidated(divparams).subscribe({ 
      next:(IC)=> {         
        this.dataSource.data= IC; 
        this._dataSource.data= IC;  
        this.createChart(IC);
      },
      error:(res)=>{console.log(res);}
    })
  } 
  createChart(dataS: tradebook[],colname:any='sector'){
    var exists = Chart.getChart('_MyChart');
    exists?.destroy();
    var charttype='bar';
    var showlg=false;
    var datashow=dataS.map(item => { return item.oP_Div });
    plugin:[ChartDataLabels] 
    if(colname=='RealPL')
    {
      datashow=dataS.map(item => { return item.realPL });
    }
    else if(colname=='divident')
    {
        datashow=dataS.map(item => { return item.divident });
    }
    else if(colname=='Real_Div')
      {
          datashow=dataS.map(item => { return item.real_Div });
      }
    else if(colname=='OP')
        {
            datashow=dataS.map(item => { return item.op });
        }
    else if(colname=='ProfitPer')
      {
         datashow=dataS.map(item => { return item.profitPer });
      }
      else if(colname=='ProPer_Div')
        {
           datashow=dataS.map(item => { return item.proPer_Div });
        }
        if(dataS.length<=12)
        {
          showlg=true;
        }
     this.chart = new Chart("_MyChart", {    
      // type: dataS.length>12?'bar':'doughnut',    
      type: 'bar',     
      data: { 
        labels:  dataS.map(item => { return item.sector }), 
	       datasets: [
          {   
            //minBarLength: 2,                   
            data: datashow,
            backgroundColor:dataS.map(item => { return item.bclr }),   
            datalabels: {
                //anchor: 'end',
                align: 'end',
               anchor: 'center'
            }                           
          },            
        ]
      },
      options: {
        
        indexAxis: 'y',
        aspectRatio:3,
        responsive:true, 
        plugins: {
          legend: {
              
            display: false,
          },
          title: {
            display: true,
            text: 'Sector Wise PL'
          },  
          datalabels: {
            color: 'black',
            // display: function(context:any) {
            //   return context.dataset.data[context.dataIndex] > 15;
            // },
           
          }
                  
        }, 
      //  aspectRatio: 5 / 3,
      
      
      }, 
    });
    
  }
}
