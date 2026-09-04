export interface GenerateQueryModel {
  tableName: string;
  fileName: string;
  excelFilePath: string;
  intcolumnname?: string;
  datecolumn?: string;
  symbolcolumn?: string;
  tradecolumn?: string;
  symbolcolumnname?: string;
  userid: number;
  index: number;
  sqlQuery?: string[];
  matchedColumns?: string[],
 // lstquery:QueryRequest[],
}
export interface QueryRequest {
  queries: string[];
}
export interface QueryResult {
  query: string;
  status: string;
  rowsAffected: number;
  errorMessage?: string;
}
