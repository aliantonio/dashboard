import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs";
import { WeatherService } from './weather.service';
import { DateService } from './date.service';
import { SafeHtml, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import * as sky from 'Skycons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  background: any;
  dateObj: any;
  temp: number;
  conditions: string;
  windspeed: number;
  icon: string;

  constructor(private sanitizer:DomSanitizer, private http: Http, private weather: WeatherService, private date: DateService) {
    this.getWallpaper();
    this.getDate();
    this.getWeather();
    
  }

  ngOnInit() {
  }

  getDate() {
    Observable.timer(0,1000).subscribe(x => { // updates every second
      return this.dateObj = this.date.getDate();
    });
  }

  getWallpaper() {
    Observable.timer(0,3600000).subscribe(x => { // updates every 60 minutes
      let num = this.randomize();
      //return this.background = this.sanitizer.bypassSecurityTrustStyle('url(../assets/images/'+num+'.jpg)');
      return this.background = this.sanitizer.bypassSecurityTrustStyle('url(http://asliantonio.com/dashboards/home/stylesheets/images/spotlight/'+num+'.jpg)');
    });
  }

  getWeather() {
    Observable.timer(0, 600000) // 10 minutes
    .subscribe(() => {
      this.weather.getWeather()
        .subscribe((data) => {
          console.log(this.dateObj.hours + ":" + this.dateObj.minutes, data);
          this.temp = Math.floor(data.currently.temperature);
          this.conditions = data.currently.summary;
          this.windspeed = Math.floor(data.currently.windSpeed);
          this.icon = data.currently.icon;
          this.addIcon();
        },
        err => {
          //this.ngOnDestroy(); // comment out for production
          console.error(err);
      });
    });
  }

  private addIcon() {
    let skycons = new Skycons({"color": "white"});
    skycons.add("icon1", this.icon);
    skycons.play();
  }

  private randomize() {
    let num = Math.floor((Math.random() * 172) + 1);
    return num;
  }
  
}
