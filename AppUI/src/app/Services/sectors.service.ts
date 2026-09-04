import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Symbols} from 'src/app/Models/sectors.model'
import { Observable, catchError, of } from 'rxjs';
import {sectorsfilter} from 'src/app/Models/sectorsfilter.model '   
import { AddDivident } from '../Models/AddDivident.model';
import { tradebook } from '../Models/tradebook.model';
import { DPCharges } from '../Models/DPCharges.model';
import { GetBrok } from '../Models/GetBrokerage.Model';
import { TradeLotSize } from '../Models/TradeLots.model';
import { userdetails } from '../Models/Userdetails.model';
import {BuySellTrade} from 'src/app/Models/BuySellTradebook';
import {intrestcerificate} from 'src/app/Models/Intrestcerificate'; 
import { Funddetails } from '../Models/Funds.model';
import {FyReport} from 'src/app/Models/FyReport.model'
import {Amc} from 'src/app/Models/Amc.model'; 
import { LIC } from '../Models/LIC.Model';
import { MedicalRecord } from '../Models/MedicalRecord.model';
import {GenerateQueryModel,QueryRequest,QueryResult} from 'src/app/Models/GenerateQueryModel.model'; 
import {Columndetails} from 'src/app/Models/Columndetails.model'; 
@Injectable({
  providedIn: 'root'
})
export class SectorsService {
  
 pathval:  string= 'http://localhost:8080/api/trading/';
 brews :any; 
  constructor(private http: HttpClient)  { 
    const url = window.location.href;
    if (url.indexOf('4200') > -1) {
      this.pathval = 'https://localhost:44314/api/Trading/';
    } else if (url.indexOf('808') > -1) {
      this.pathval = 'http://localhost:8080/api/Trading/';
    } else {
      this.pathval = 'http://localhost:8080/api/Trading/';
    }
  }  
    getallsectornames():Observable<Symbols[]>{     
        var result=this.http.get<Symbols[]>(this.pathval+'GetSymbols');         
        return result;
     }  
    gettablename():Observable<string[]>{     
        var result=this.http.get<string[]>(this.pathval+'GetTableName');         
        return result;
     }
   gettablecolumn(params:any):Observable<Columndetails[]>{     
        var result=this.http.get<Columndetails[]>(this.pathval+'GetTableColumns?tableName='+params.get('tableName'));         
        return result;
     }
    getTradebook(params:any):Observable<tradebook[]>{  
        return  this.http.get<tradebook[]>(this.pathval+'GetTradeBook?usrid='+params.get('userid')+"&combineusers="+params.get('combineusers'));     
    }
    getDividents(divparams:HttpParams):Observable<AddDivident[]>{ 
      return  this.http.get<AddDivident[]>(this.pathval+'GetDivident?symb='+divparams.get('name')+"&userid="+divparams.get('usrid')+"&combinewith="+divparams.get('combineusers'));     
       }
       getPLFy(divparams:HttpParams):Observable<TradeLotSize[]>{
        return  this.http.get<TradeLotSize[]>(this.pathval+'GetFYPL?fyear='+divparams.get('fyear')+"&userid="+divparams.get('usrid'));     
         }
      getPLFyM(divparams:HttpParams):Observable<TradeLotSize[]>{
        return  this.http.get<TradeLotSize[]>(this.pathval+'GetFYPL?fyear='+divparams.get('fyear')+"&userid="+divparams.get('usrid')+"&ismonthly="+divparams.get('ismonthly'));     
         }
         getDividentsFy(divparams:HttpParams):Observable<TradeLotSize[]>{
          return  this.http.get<TradeLotSize[]>(this.pathval+'GetFYDivident?fyear='+divparams.get('fyear')+"&userid="+divparams.get('usrid'));     
           }
    getDpCharges(dpparams:HttpParams):Observable<DPCharges[]>{ 
      return  this.http.get<DPCharges[]>(this.pathval+'GetDPCharges?symb='+dpparams.get('name')+"&userid="+dpparams.get('usrid')+"&combinewith="+dpparams.get('combineusers'));         
      }
    getIC(userid:number):Observable<intrestcerificate[]>{ 
        return  this.http.get<intrestcerificate[]>(this.pathval+'GetIntrestCertificate?id='+userid);     
      }
      getMedicalRecords(params: HttpParams): Observable<MedicalRecord[]> {
        return this.http.get<MedicalRecord[]>(this.pathval + 'GetMedicalRecords', { params });
      }
      getgenerateQuery(model:GenerateQueryModel, headerOnly: boolean = true): Observable<any> {
      const params = new HttpParams().set('headeronly', headerOnly);
      return this.http.post(this.pathval+'GetGenerateQuery', model, { params });
    }
    getgeneratedQuery(model:GenerateQueryModel): Observable<any> { 
      return this.http.post(this.pathval+'GenerateQuery', model);
    }
    runQuery(request: QueryRequest): Observable<QueryResult[]> {
      return this.http.post<QueryResult[]>(this.pathval + 'RunDataQuery', request);
    }
      getLIC(userid:number):Observable<LIC[]>{ 
        return  this.http.get<LIC[]>(this.pathval+'GetLIC?userid='+userid);     
      } 
    getAMC(userid:number):Observable<Amc[]>{ 
        return  this.http.get<Amc[]>(this.pathval+'GetFundAmc?userid='+userid);     
      }    
    getbrokerageCharges(getparams:any):Observable<GetBrok[]>{ 
          return  this.http.get<GetBrok[]>(this.pathval+'GetBrokerage?symb='+getparams.get('name')+"&userid="+getparams.get('usrid')+"&combinewith="+getparams.get('combineusers'));     
      }
    updatebrokerage(params:any):Observable<GetBrok[]>{   
              return  this.http.post<GetBrok[]>(this.pathval+'UpdateBrok', null,{params: params}); 
      }
    updateDPC(params:any):Observable<DPCharges[]>{   
      return  this.http.post<DPCharges[]>(this.pathval+'UpdateDPC?amt='+params.get('amt')+"&id="+params.get('id'),null); 
    }
    getLotSize(lotparams:any):Observable<TradeLotSize[]>{ 
          return  this.http.get<TradeLotSize[]>(this.pathval+'GetLotsize?symb='+lotparams.get('name')+"&userid="+lotparams.get('usrid')+"&userids="+lotparams.get('userids'));          
      }
    GetSymbolsFilter():Observable<sectorsfilter[]>{
      return  this.http.get<sectorsfilter[]>(this.pathval+'GetSymbolsFilter');
      }
    GetSectorFilter():Observable<sectorsfilter[]>{
      return  this.http.get<sectorsfilter[]>(this.pathval+'GetSectorFilter');
      } 
  GetColorList():Observable<sectorsfilter[]>{
        return  this.http.get<sectorsfilter[]>(this.pathval+'GetColorList');
    }   
    addsymboldata(addsymbols:Symbols){
      return  this.http.post<Symbols[]>(this.pathval+'SaveSymbols',addsymbols);
    }
   
    SaveDividennt(divident:AddDivident){
      return  this.http.post<AddDivident[]>(this.pathval+'SaveDivident',divident);
    }
    SaveTradebook(tradeentry:BuySellTrade){debugger;
      return  this.http.post<BuySellTrade[]>(this.pathval+'BuySellTradeEntry',tradeentry);
    }
    getusers():Observable<userdetails[]>{    
      var result=this.http.get<userdetails[]>(this.pathval+'GetUsers');         
      return result;
    }
    GetFunddetails(userid:number):Observable<Funddetails[]>{ 
    return  this.http.get<Funddetails[]>(this.pathval+'GetFundDetail?id='+userid);     
      }
   GetFYFunddetails(userid:number):Observable<Funddetails[]>{ 
        return  this.http.get<Funddetails[]>(this.pathval+'GetFundDetail?id='+userid+'&isfy=true');     
          }
    AddFunds(params:any):Observable<Funddetails[]>{   
      return  this.http.post<Funddetails[]>(this.pathval+'AddFunds', null,{params: params}); 
      }  
    GetFTReport(userid:number):Observable<FyReport[]>{ 
        return  this.http.get<FyReport[]>(this.pathval+'GetFyPlConsolidate?id='+userid);     
    }
    SaveAmc(amcdata:Amc){
      return  this.http.post<Amc[]>(this.pathval+'SaveAMC',amcdata);
    }
    SaveLIC(amcdata:LIC){
      return  this.http.post<LIC[]>(this.pathval+'SaveLIC',amcdata);
    }
    getLICDetails(divparams:HttpParams):Observable<LIC[]>{
      return  this.http.get<LIC[]>(this.pathval+'GetLICdetailbyId?licid='+divparams.get('licid'));     
       }
  getICGraph(paramval:any):Observable<intrestcerificate[]>{ 
    return  this.http.get<intrestcerificate[]>(this.pathval+'GetIntrestCertificate?id='+paramval.get('usrid')+"&isgrph="+paramval.get('isgrph'));     
  }
  getICacno(paramval:any):Observable<intrestcerificate[]>{ 
    return  this.http.get<intrestcerificate[]>(this.pathval+'GetIntrestCertificate?id='+paramval.get('usrid')+"&isgrph=false&accno="+paramval.get('accno'));     
  }
  getsectorconsolidated(paramval:any):Observable<tradebook[]>{ 
    return  this.http.get<tradebook[]>(this.pathval+'GetSectorConsolidatedData?usrid='+paramval.get('usrid')+"&sortcolumn="+paramval.get('colname')+"&dir="+paramval.get('dir'));      
  }
    getDivGraphData(paramval:any):Observable<TradeLotSize[]>{ 
    return  this.http.get<TradeLotSize[]>(this.pathval+'GetDividentfybySymbol?userid='+paramval.get('usrid')+"&symb="+paramval.get('name')+"&combinewith="+paramval.get('combineusers')+"&Fy="+paramval.get('Fy'));     
  }
}

