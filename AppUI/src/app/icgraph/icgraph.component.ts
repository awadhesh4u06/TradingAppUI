import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'; 
import { SectorsService } from '../Services/sectors.service'; 
import {intrestcerificate} from 'src/app/Models/Intrestcerificate';
import Chart, { ChartType }  from 'chart.js/auto';
import { HttpParams } from '@angular/common/http';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-icgraph',
  templateUrl: './icgraph.component.html',
  styleUrls: ['./icgraph.component.css']
})
export class ICGraphComponent {
  public usrid:any=0;
  public chart: any; 
  public charttp:any;
  data: any;
  labels=[];
  values=[];
  ChartData:intrestcerificate[] ;
  _ChartData: intrestcerificate[] = [];  
  constructor(private employeser:SectorsService) {        
  } 
 
  ngOnInit(): void {  
    this.LoadData();   
     Chart.register(ChartDataLabels);
  } 
  LoadData(){   
    if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
    }
    const divparams = new HttpParams() 
    .set('usrid', this.usrid)
    .set('isgrph','true');
   
    this.employeser.getICGraph(divparams).subscribe({ 
      next:(IC)=> {    
        this.ChartData=IC ;      
        this.createChart(IC);
      },
      error:(res)=>{console.log(res);}
    })
  } 
  LoadchartData()
  { 
    const chk = (document.getElementById("chkppf"));     
   this.RemovePPF();
  }
 
RemovePPF()
{  
  this._ChartData=this.ChartData ;    
  const filterValue =  (<HTMLInputElement>document.getElementById('chkppf')).checked;
  // this.dataSource.data=this._dataSource.data; 
  if(filterValue)
    { 
      this._ChartData=this.ChartData ;    
   
    this._ChartData= this._ChartData.filter(_ChartData => _ChartData.acType!='PPF');   
    console.log(this._ChartData);
    this.createChart(this._ChartData);
  }
  else
  {
    this.createChart(this.ChartData);
  }
}
  createChart(dataS: intrestcerificate[]){
    var ee = (document.getElementById("ddldir")) as HTMLSelectElement;
    var selc = ee.selectedIndex;
    var optn = ee.options[selc]; 
    var drs =optn.value; 
    var exists = Chart.getChart('_icgraph');
    exists?.destroy();
    this.charttp=drs;
    var datashow=dataS.map(item => { return item.amt });
    plugin:[ChartDataLabels] 
     this.chart = new Chart("_icgraph", {    
      type: this.charttp ,     
      data: { 
        labels:  dataS.map(item => { return item.acType }), 
	       datasets: [
          {                                
            data: datashow,
            backgroundColor: [            
              'orange',         
              'DeepSkyBlue',
              'Chartreuse',
              'pink',
              'yellow',
          ],   
          datalabels: {
            anchor: 'center',
              align: 'end',
            // anchor: 'start'
          }                        
          },            
        ]
      },
      options: {
        
        indexAxis: 'x',
        aspectRatio:3,
        responsive:true, 
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: 'Intrest'
          },  
          datalabels: {
            color: 'white',
            // display: function(context:any) {
            //   return context.dataset.data[context.dataIndex] > 15;
            // },
            font: {
              weight: 'bold',
              
            },
            formatter: Math.round
          },
                
        }, 
        // scales: {
        //   x: {
        //     stacked: true
        //   },
        //   y: {
        //     stacked: true
        //   }
        // }
      }, 
    });
    
  }
}
