import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart, { ChartType } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { HttpParams } from '@angular/common/http';
import { SectorsService } from '../Services/sectors.service';
import { MedicalRecord } from '../Models/MedicalRecord.model';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MedicalRecordComponent implements OnInit {
  public records: MedicalRecord[] = [];
  public fullRecords: MedicalRecord[] = [];
  public displayedRecords: MedicalRecord[] = [];
  public chartRecords: MedicalRecord[] = [];
  public selectedParam = 'all';
  public selectedTop = 0;
  public isLoading = false;
  public error = '';
  public chart: any;
  public sortColumn: keyof MedicalRecord | 'processDate' = 'processDate';
  public sortDirection: 'asc' | 'desc' = 'desc';
  public parameterOptions = [
    { key: 'all', label: 'SGPT + SGOT' },
    { key: 'sgpt', label: 'SGPT' },
    { key: 'sgot', label: 'SGOT' },
    { key: 'creat', label: 'Creatinine' },
    { key: 'bun', label: 'BUN' },
    { key: 'ggt', label: 'GGT' }
  ];
  public chartTypeOptions: { key: ChartType; label: string }[] = [
    { key: 'line', label: 'Line' },
    { key: 'bar', label: 'Bar' }
  ];
  public selectedChartType: ChartType = 'line';
  public topOptions = [0, 10, 20, 50];
  public totalRecords = 0;
  public yearCounts: { year: string; count: number }[] = [];

  constructor(private sectorsService: SectorsService) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  public onSelectionChange(): void {
    this.updateChart();
  }

  public loadMedicalRecords(): void {
    this.isLoading = true;
    this.error = '';
    const params = new HttpParams()
      .set('userid', '1')
      .set('query', 'all');

    this.sectorsService.getMedicalRecords(params).subscribe({
      next: (medicalRecords) => {
        const sorted = this.sortRecords(
          [...medicalRecords],
          'processDate',
          'desc'
        );
        this.records = sorted;
        this.fullRecords = sorted;
        this.displayedRecords = [...sorted];
        this.updateSummary();
        this.updateChart();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Unable to load medical records.';
        this.isLoading = false;
      }
    });
  }

  public sortGrid(column: keyof MedicalRecord | 'processDate'): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = column === 'processDate' ? 'desc' : 'asc';
    }

    this.displayedRecords = this.sortRecords(
      [...this.fullRecords],
      this.sortColumn,
      this.sortDirection
    );
  }

  public getSortIcon(column: keyof MedicalRecord | 'processDate'): string {
    if (this.sortColumn !== column) {
      return '';
    }
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  private sortRecords(records: MedicalRecord[], column: keyof MedicalRecord | 'processDate', direction: 'asc' | 'desc'): MedicalRecord[] {
    return records.sort((a, b) => {
      let left: any = a[column as keyof MedicalRecord];
      let right: any = b[column as keyof MedicalRecord];

      if (column === 'processDate') {
        left = new Date(a.processDate).getTime();
        right = new Date(b.processDate).getTime();
      }

      if (typeof left === 'string' && typeof right === 'string') {
        return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
      }

      return direction === 'asc' ? left - right : right - left;
    });
  }

  public get recordSummary(): string {
    if (this.totalRecords === 0) {
      return 'No records loaded';
    }
    const yearSummary = this.yearCounts
      .map((item) => `${item.year}: ${item.count}`)
      .join(', ');
    return `Total Records: ${this.totalRecords} | ${yearSummary}`;
  }

  private updateSummary(): void {
    const yearMap = this.fullRecords.reduce((acc, record) => {
      const year = new Date(record.processDate).getFullYear().toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.totalRecords = this.fullRecords.length;
    this.yearCounts = Object.entries(yearMap)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, count]) => ({ year, count }));
  }

  private updateChart(): void {
    const sourceRecords = this.fullRecords.filter((record) => {
      if (this.selectedParam === 'all') {
        return record.sgpt !== 0 || record.sgot !== 0;
      }
      return record[this.selectedParam as keyof MedicalRecord] !== 0;
    });

    const filtered = this.selectedTop > 0 ? sourceRecords.slice(0, this.selectedTop) : sourceRecords;
    this.chartRecords = [...filtered].sort(
      (a, b) => new Date(a.processDate).getTime() - new Date(b.processDate).getTime()
    );
    this.renderChart();
  }

  private renderChart(): void {
    const existing = Chart.getChart('MedicalChart');
    existing?.destroy();
    Chart.register(ChartDataLabels);

    const records = this.chartRecords;
    const labels = records.map((record) =>
      new Date(record.processDate).toLocaleDateString('en-GB')
    );

    const datasets = [] as any[];

    if (this.selectedParam === 'all') {
      datasets.push(
        {
          label: 'SGPT',
          data: records.map((record) => record.sgpt),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.2,
          pointRadius: 4,
          barPercentage: 0.8,
          categoryPercentage: 0.9
        },
        {
          label: 'SGOT',
          data: records.map((record) => record.sgot),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.2,
          pointRadius: 4,
          barPercentage: 0.8,
          categoryPercentage: 0.9
        }
      );
    } else {
      const label = this.parameterOptions.find((item) => item.key === this.selectedParam)?.label || this.selectedParam;
      datasets.push({
        label,
        data: records.map((record) => record[this.selectedParam as keyof MedicalRecord] as number),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.2,
        pointRadius: 4,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      });
    }

    this.chart = new Chart('MedicalChart', {
      type: this.selectedChartType,
      data: {
        labels,
        datasets
      },
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        aspectRatio: 2.5,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 32,
            left: 24,
            top: 24,
            bottom: 24
          }
        },
        scales: {
          x: {
            type: 'category',
            stacked: false,
            ticks: {
              display: true,
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              align: 'start',
              padding: 8,
              callback: function(this: any, value: any, index: number) {
                if (Array.isArray(labels) && labels[index] !== undefined) {
                  return labels[index];
                }
                return String(value);
              }
            },
            grid: {
              display: true
            }
          },
          y: {
            stacked: false,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 16,
              boxWidth: 12,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          datalabels: {
            display: true,
            color: '#000000',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 4,
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value: any) => {
              if (value === null || value === undefined || value === 0) {
                return '';
              }
              return String(value);
            },
            anchor: 'end',
            align: 'top',
            offset: 4,
            clip: false
          },
          tooltip: {
            enabled: true,
            position: 'nearest',
            intersect: false,
            mode: 'index',
            padding: 10,
            displayColors: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 12,
              weight: 'bold'
            },
            bodyFont: {
              size: 11
            },
            callbacks: {
              label: (context: any) => {
                return context.dataset.label + ': ' + context.raw;
              }
            }
          }
        }
      }
    });
  }
}
