export interface intrestcerificate {    
    bank: string,    
    acType: string,
    acNo: string, 
    amt: number, 
    fy: string,
    username: string, 
    totamt: number, 
    finalAmt: number, 
    roi: number, 
    depositeamt: number, 
    acName:string,
    icdata:icdataa[],
    clsname:string,
    cls_name:string,
    tblid:string
    
 }
 export interface icfydata{
   amt: number,
   fy:string,
   acType: string,
   acNo: string
}
export interface icdataa{    
       
    acType: string
    acNo: string
    amt: number
    fy: string
    username: string
    totamt: number
    finalAmt: number 
    roi: number 
    depositeamt: number
    acName:string
    clsname:string    
    isExpand:boolean
    startDate: string
    endDate: string
    tat: string
 }