import { Component, HostListener, Inject, OnInit, AfterViewInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ActivatedRoute } from '@angular/router';   
import {SectorsService} from 'src/app/Services/sectors.service'
import {TradeLotSize} from 'src/app/Models/TradeLots.model' 
import Chart, { ChartType }  from 'chart.js/auto';
import { HttpParams } from '@angular/common/http';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-divgraph',
  templateUrl: './divgraph.component.html',
  styleUrls: ['./divgraph.component.css']
})
export class DivgraphComponent implements OnInit, AfterViewInit {
  public usrid: any = 0;
  public chart: any;
  public charttp: any;
  public combineuserd: any = '';
  public currentuser: any;
  public nameshare: string = '';
  public FY: string = '';
  labels = [];
  values = [];
  ChartData: TradeLotSize[];
  _ChartData: TradeLotSize[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private activatedRoute: ActivatedRoute,
    private employeser: SectorsService,
    private _dialogRef: MatDialogRef<DivgraphComponent>,
    private _dailog: MatDialog
  ) { }
  ngAfterViewInit(): void {
    // No resize logic
  } 
   ngOnInit(): void { 
      if (localStorage.getItem("UserId") != null) {
      this.usrid=localStorage.getItem("UserId");
        this.currentuser=localStorage.getItem("UserName");
    } 
    this.nameshare=this.dialogData.Name;
    this.combineuserd=this.dialogData.combineusers;
    this.FY=this.dialogData.fyear;
        this.LoadData();   
     Chart.register(ChartDataLabels);
  } 
  LoadData() { 
    const divparams = new HttpParams()      
   .set('name', this.nameshare)
  .set('usrid', this.usrid) 
  .set('Fy', this.FY) 
   .set('combineusers', this.combineuserd);
    this.employeser.getDivGraphData(divparams).subscribe({ 
      next:(IC)=> {    
        this.ChartData=IC ;      
        this.createChart(IC);
      },
      error:(res)=>{console.log(res);}
    })
  }
  LoadchartData()
  {  
   this.LoadData();
  }
 
  createChart(dataS: TradeLotSize[]) {
    // var ee = (document.getElementById("ddldir")) as HTMLSelectElement;
    // var selc = ee.selectedIndex;
    // var optn = ee.options[selc];
    // var drs = optn.value;
    var exists = Chart.getChart('_icgraph');
    exists?.destroy();
    this.charttp = 'bar';
    var datashow = dataS.map(item => { return item.divident });
    this.chart = new Chart("_icgraph", {
      type: this.charttp,
      data: {
        // if(this.FY)
        // {

        // }
        labels: dataS.map(item => { return this.FY?item.symbol: item.fYear }),
        datasets: [
          {
            data: datashow,
            backgroundColor: [
              'orange',
              'DeepSkyBlue',
              'Chartreuse',
              'pink',
              'yellow', 'Tomato','Khaki','Moccasin','Burlywood','Violet'
            ],
            datalabels: {
              anchor: 'center',
              align: 'end',
            }
          },
        ]
      },
      options: {
        indexAxis: 'x',
         
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.charttp !== 'bar'
          },
          tooltip: {
            display: true,
          },
          datalabels: {
            color: 'black',
            font: {
              weight: 'normal',
            },
            formatter: Math.round
          },
        },
      },
    });
    // Ensure chart resizes to fit container
    setTimeout(() => {
      if (this.chart && typeof this.chart.resize === 'function') {
        this.chart.resize();
      }
    }, 100);
  }
   @HostListener('window:keyup.esc') onKeyUp() {
    this._dialogRef.close();
  }
  closepage() {
    this._dialogRef.close(true); 
    }
}
