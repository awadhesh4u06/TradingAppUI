export interface TradeLotSize{
selldate	:string,
lotsize	:string,
symbol	:string,
sector	:string,
buyAmt	: number,
sellAmt	: number,
pl	: number,
qty	: number,
buyAvg	: number,
sellAvg	: number,
finalBrok	: number,
dpc	: number,
final_lot:number,
final:number,
divident:number,
perct:number,
_data:dataa[],
lstdv:dividentList[],
userName:string,
clsName:string,
IntialName:string,
fYear:string,
monthName:string,
expanded: boolean // toggle state
}
export interface dataa{    
sector	:string
pl	: number
dpc	: number 
brok	: number
divident:number
final:number
per:number,
symbol:string,
selldate:string, 
 }
export interface dividentList{
    symbol?: string,
     amount?:number
  }
 export interface Sectordiv{
   divident?:number,
    sector	:string
  }