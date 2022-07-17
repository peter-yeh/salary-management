import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule as ToastsModule} from 'ngx-toastr';
import {ApiService} from 'src/model/api.service';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastsModule.forRoot(),
    MatTableModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule { }
