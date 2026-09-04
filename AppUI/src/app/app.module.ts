import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SectorsymbollistComponent } from './sectorsymbollist/sectorsymbollist.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { MatDialogModule,MatDialog } from '@angular/material/dialog'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatIconModule } from '@angular/material/icon'; 
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'  
import { MatNativeDateModule } from '@angular/material/core'  
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { CommonModule ,LocationStrategy, HashLocationStrategy} from '@angular/common'; 
import { GetBrokerageComponent } from './get-brokerage/get-brokerage.component';
import { NgChartsModule } from 'ng2-charts'; 
import { GetUsersComponent } from './get-users/get-users.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { DivgraphComponent } from './divgraph/divgraph.component'; 
import { AuthInterceptor } from './Services/auth.interceptor';
import { GenerateQueryComponent } from './generate-query/generate-query.component'; 
 


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent ,GetUsersComponent, DivgraphComponent, GenerateQueryComponent  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HttpClientModule,
    SectorsymbollistComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    GetBrokerageComponent,
    NgChartsModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    DragDropModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
