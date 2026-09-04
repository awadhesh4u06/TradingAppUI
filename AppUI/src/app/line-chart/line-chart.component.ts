import { Component, OnInit } from '@angular/core';
import Chart  from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  public chart: any; 
  public charttp:any;
  ngOnInit(): void {
    this.createChart(); 
  }
  LoadchartData()
  { 
     this.createChart()
         //  Chart.register(ChartDataLabels);
  }
  createChart(){
    var ee = (document.getElementById("ddldir")) as HTMLSelectElement;
      var selc = ee.selectedIndex;
      var optn = ee.options[selc]; 
      var drs =optn.value; 
      var exists = Chart.getChart('MyChart');
      exists?.destroy();      
    Chart.register(ChartDataLabels);
      this.charttp=drs;
     plugin:[ChartDataLabels] 
    this.chart = new Chart("MyChart", {
     // type: 'line', //this denotes tha type of chart
      type: this.charttp ,
      data: {// values on X-Axis
        labels: ['19-02-2022', '14-05-2022', '12-06-2022','10-08-2022','23-11-2022',
								 '07-01-2023', '31-03-2023', '24-04-2023','07-06-2023',' 25-06-2023',' 23-09-2023',' 20-10-2023', 
                 '13-12-2023',  '19-02-2024','27-04-2024','21-06-2024','05-07-2024','28-09-2024','05-01-2025','27-04-2025','24-08-2025'], 
	       datasets: [
          
          {
            label: "SGOT",
            data: ['91', '122','138',  '110', '104', '68',
									 '87', '89', '56','56','60','60','78','76','56','94','82','44','56','59','110'],
            backgroundColor: 'red'
          
          ,pointRadius: 16,
          datalabels: {
            color: 'white', 
            font: {
              weight: 'bold',
              
            },
            formatter: Math.round
          }
          },{
            label: "SGPT",
            data: ['137','172', '226' ,'178', '165', '111',
								 '197', '93', '99','223','187','163','134','132','101','149','125','95.4','108','81','188'],
            backgroundColor: 'blue'//, tension: 0.1
            ,pointRadius: 16,
            datalabels: {
              color: 'white', 
              font: {
                weight: 'bold',
                
              },
              formatter: Math.round
            }               
          }  
        ]
      },
      options: {
        aspectRatio:3,
       responsive: true,
        plugins: {
          legend: {
            display: true,
          }
        }
  //  , scales: {
  //     x: {
  //       stacked: true,
  //     }
  //     ,
  //     y: {
  //       stacked: true
  //     }
  //   }
      }
      
    });
    
  }
}
