import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetUsersComponent } from './get-users/get-users.component' 
import { BuySellSharesComponent } from './buysell-shares/buysell-shares.component';
import {SectorsymbollistComponent} from './sectorsymbollist/sectorsymbollist.component' 
import { AddSymbolComponent } from './add-symbol/add-symbol.component';
import { IntrestCertificateComponent } from './intrest-certificate/intrest-certificate.component';
import { TradeBookComponent } from './trade-book/trade-book.component' ;
import { UpdateDividentComponent } from './update-divident/update-divident.component' 
import { LineChartComponent } from './line-chart/line-chart.component' 
import { GetFundsComponent } from './get-funds/get-funds.component' 
import { FYReportComponent } from './fy-report/fy-report.component'; 
import { AmcComponent } from './amc/amc.component'; 
import { SectorReportComponent } from './sector-report/sector-report.component'; 
import { LogoutComponent } from './logout/logout.component';
import {ICGraphComponent} from './icgraph/icgraph.component'
import {LICComponent} from './lic/lic.component'
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { GenerateQueryComponent } from './generate-query/generate-query.component';
import { AuthGuard } from './Services/auth.guard';
const routes: Routes = [
   { path: '', component: GetUsersComponent,pathMatch:'full' },
   { path: 'sectorsymbollist', component: SectorsymbollistComponent, canActivate: [AuthGuard] },
   {path:'update-divident',component:UpdateDividentComponent, canActivate: [AuthGuard]},
   { path: 'add-symbol', component: AddSymbolComponent, canActivate: [AuthGuard] },
   { path: 'trade-book', component: TradeBookComponent, canActivate: [AuthGuard] },
   { path: 'line-chart', component: LineChartComponent, canActivate: [AuthGuard] },
   { path: 'medical-record', component: MedicalRecordComponent, canActivate: [AuthGuard] },
   { path: 'buysell-shares', component: BuySellSharesComponent, canActivate: [AuthGuard] },
   { path: 'get-funds', component: GetFundsComponent, canActivate: [AuthGuard] },
   { path: 'intrest-certificate', component: IntrestCertificateComponent, canActivate: [AuthGuard] },
   { path: 'fy-report', component: FYReportComponent, canActivate: [AuthGuard] },
   { path: 'amc', component: AmcComponent, canActivate: [AuthGuard] },
   { path: 'sector-report', component: SectorReportComponent, canActivate: [AuthGuard] },
   { path: 'icgraph', component: ICGraphComponent, canActivate: [AuthGuard] },
   { path: 'lic', component: LICComponent, canActivate: [AuthGuard] },
   { path: 'generate-query', component: GenerateQueryComponent, canActivate: [AuthGuard] },
   { path: 'logout', component: LogoutComponent },
   { path: '**', redirectTo: '/' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule  {

}
