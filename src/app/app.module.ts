import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { HotkeyModule } from 'angular2-hotkeys';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { WeatherService } from './weather.service';
import { DateService } from './date.service';
import { FilterPipe } from './filter.pipe';
import { SortPipe } from './sort.pipe';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    SortPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    HotkeyModule.forRoot()
  ],
  providers: [WeatherService, DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
