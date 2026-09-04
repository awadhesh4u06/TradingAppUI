import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { SectorsService } from '../Services/sectors.service';
import { GenerateQueryModel,QueryRequest, QueryResult} from 'src/app/Models/GenerateQueryModel.model'; 
import { Columndetails } from 'src/app/Models/Columndetails.model'; 


@Component({
  selector: 'app-generate-query',
  templateUrl: './generate-query.component.html',
  styleUrls: ['./generate-query.component.css']
})
export class GenerateQueryComponent implements OnInit {
  tableList: string[] = [];
  ColumnsList: Columndetails[] = [];
  MatchedColumnsList: string[] = [];
  SqlQueryList: string[] = [];
  queryResults: QueryResult[] = [];
  uploadedFilePath = '';
  uploadedFileName = '';
  usrid: any; 
  message: string = '';
  currentuser: any; 
  configForm!: FormGroup; 
  loading: boolean = false; // spinner flag
 @ViewChild('runQueryBtn') runQueryBtn!: ElementRef<HTMLButtonElement>;
 @ViewChild('messageAlert') messageAlert!: ElementRef<HTMLDivElement>;
  constructor(private fb: FormBuilder, private employeser: SectorsService) {}

  ngOnInit(): void {
    if (localStorage.getItem("UserId") != null) {
      this.usrid = localStorage.getItem("UserId");
      this.currentuser = localStorage.getItem("UserName");
    }

    this.configForm = this.fb.group({
      tableName: [''],
      excelFilePath: [''],
      FileName: [''],   // keep consistent casing
      intcolumnname: [''],
      datecolumn: [''],
      symbolcolumn: [''],
      tradecolumn: [''],
      symbolcolumnname: [''],
      userid: [0],
      index: [0],
      sqlQuery: [[]],
      matchedColumns: [[]],
      columnMappings: this.fb.array([])
    });
    this.loadtablename();
  }

  get columnMappings(): FormArray {    
    return this.configForm.get('columnMappings') as FormArray;
  }
get hasErrors(): boolean {
  return this.queryResults.some(r => r.status === 'error');
}

  loadtablename(): void {
    this.employeser.gettablename().subscribe({
      next: (_tableList: string[]) => {
        this.tableList = _tableList.sort();
        console.log(this.tableList)
      },
      error: (err) => console.error(err)
    });
  }

  onTableChange(event: any): void {
    const tableName = event.target.value;
    this.configForm.patchValue({ tableName });
    const params = new HttpParams().set('tableName', tableName);
    this.employeser.gettablecolumn(params).subscribe({
      next: (_columnList: Columndetails[]) => {
        this.ColumnsList = _columnList.sort((a,b) => a.columnName.localeCompare(b.columnName))
        this.buildColumnRows();
      },
      error: (err) => console.error(err)
    });
  }

  buildColumnRows(): void {
    const matchedColumns = this.MatchedColumnsList;
    this.columnMappings.clear();
    this.ColumnsList.forEach(col => {
      const columnName = col.columnName ?? "";
      const isMatched = matchedColumns.includes(columnName);
      const isIntColumn  = ["int", "decimal"].includes(col.dataType?.toLowerCase() || "");
      const isDateColumn = ["date", "datetime"].includes(col.dataType?.toLowerCase() || "");
      this.columnMappings.push(
        this.fb.group({
          columnName: [columnName],
          isMatched: [isMatched],
          isIntColumn: [isIntColumn],
          isDateColumn: [isDateColumn],
          isTradeColumn: [false],
          isSymbolId: [false],
          isSymboname: [false]
        })
      );
    });
  }

  onFileSelectedpath(event: any): void {
    const filepath = event.target.value;  
    this.uploadedFilePath = filepath;      
    this.configForm.patchValue({
      excelFilePath: filepath + "\\" + this.uploadedFileName        
    });     
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]; 
    if (file) {
      this.uploadedFileName = file.name; 
      this.configForm.patchValue({
        FileName: file.name   // corrected casing
      });

      if (this.uploadedFilePath?.trim()) {
        this.configForm.patchValue({
          excelFilePath: this.uploadedFilePath + "\\" + this.uploadedFileName        
        }); 
      }
    }
  }

  getmatchedcolumns(): void {
    const payload: GenerateQueryModel = this.configForm.value;
    this.employeser.getgenerateQuery(payload, false).subscribe({
      next: (response: string[]) => { 
        this.MatchedColumnsList = response;
        this.buildColumnRows();
      },
      error: (err) => console.error(err)
    });
  }

  runQuery(): void {
  if (this.SqlQueryList.length === 0) {
    this.message = 'No queries to run.';
    return;
  }
  this.loading = true;
  this.message = '';
  // Build the payload expected by API 
  const requestPayload: QueryRequest = { queries: this.SqlQueryList }; 
this.employeser.runQuery(requestPayload).subscribe({
  next: (response: QueryResult[]) => {
    this.loading = false;
    this.queryResults = response;   // store results for grid
    // check if any errors exist
    const hasErrors = response.some(r => r.status === 'error');
    if (hasErrors) {
      this.message = ''; // clear success message
      setTimeout(() => {
        const errorTable = document.getElementById('errorGrid'); // give your table an id="errorGrid"
        if (errorTable) {
          errorTable.focus();
        }
      }, 0);
    } else {
      this.message = '✅ Queries executed successfully!';
      setTimeout(() => {
        if (this.messageAlert) {
          this.messageAlert.nativeElement.focus();
        }
      }, 0);
    }

    console.log('API response:', response);
  },
  error: (err) => {
    this.loading = false;
    this.message = '❌ Failed to execute queries.';
    setTimeout(() => {
      if (this.messageAlert) {
        this.messageAlert.nativeElement.focus();
      }
    }, 0);
    console.error('API error:', err);
  }
});
}

  onSubmit(): void {
    const payload = this.configForm.value;

    payload.matchedColumns = this.columnMappings.controls
      .filter(x => x.get('isMatched')?.value)
      .map(x => x.get('columnName')?.value);

    payload.intcolumnname = this.columnMappings.controls
      .filter(x => x.get('isIntColumn')?.value)
      .map(x => x.get('columnName')?.value)
      .join(',');

    payload.datecolumn = this.columnMappings.controls
      .filter(x => x.get('isDateColumn')?.value)
      .map(x => x.get('columnName')?.value)
      .join(',');

    payload.symbolcolumn = this.columnMappings.controls
      .filter(x => x.get('isSymbolId')?.value)
      .map(x => x.get('columnName')?.value)
      .join(',');

    payload.tradecolumn = this.columnMappings.controls
      .filter(x => x.get('isTradeColumn')?.value)
      .map(x => x.get('columnName')?.value)
      .join(',');

    payload.symbolcolumnname = this.columnMappings.controls
      .filter(x => x.get('isSymboname')?.value)
      .map(x => x.get('columnName')?.value)
      .join(',');

    payload.userid = this.usrid;

    this.employeser.getgeneratedQuery(payload).subscribe({
      next: (response: string[]) => {
        this.SqlQueryList = response;  // response is string[]
        console.log(response);

        if (this.SqlQueryList.length > 0) {
          setTimeout(() => {
            this.runQueryBtn.nativeElement.focus();
          }, 0);
        }
      },
      error: (err) => console.error(err)
    });

  }
}
