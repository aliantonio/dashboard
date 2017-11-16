import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";

import { AppComponent } from './app.component';

import { WeatherService } from './weather.service';
import { DateService } from './date.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    Ng2CompleterModule
  ],
  providers: [WeatherService, DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
