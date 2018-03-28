import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { WeatherService } from './weather.service';
import { DateService } from './date.service';
import { SafeHtml, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import * as sky from 'Skycons';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

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
  allLinks: any;
  favorites: any;
  @ViewChild('searchInput') oElement;
  @ViewChild('siteSearch') siteSearch;
  oSearch: any;
  query: any;
  city: string;
  state: string;
  zipcode: number;
  hotkeyOpenNav: Hotkey | Hotkey[];
  hotkeyCloseNav: Hotkey | Hotkey[];
  isOpen: boolean = false;
  array: string[] = [];
  map = new Map<string, string>();

  constructor(private sanitizer:DomSanitizer, private http: Http, private weather: WeatherService, private date: DateService, private _hotkeysService: HotkeysService) {
  }

  ngOnInit() {
    this.subscribeFavorites();
    this.subscribeAllLinks();
    this.getWallpaper();
    this.getDate();
    this.getCoordinates();
    this.setHotKeys();
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.array.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  focus() {
    this.oElement.nativeElement.focus();
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        this.subscribeLocation(latitude, longitude);
        this.getWeather(latitude, longitude);
      }, error => { 
        console.log(error);
      });
    }
  }

  getDate() {
    Observable.timer(0,1000).subscribe(x => { // updates every second
      return this.dateObj = this.date.getDate();
    });
  }

  getLocation(latitude, longitude) {
    let key = 'AIzaSyCLXz6mxkE9ry00oFak6lJX-ufYlTV8MRI';
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key='+key)
    .timeout(10000)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError);
  }


  getLinks() {
    return this.http.get('../dashboard/assets/sites.json')
    .timeout(10000)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError);
  }

  getFavorites() {
    return this.http.get('../dashboard/assets/favorites.json')
    .timeout(10000)
    .do(this.logResponse)
    .map(this.extractData)
    .catch(this.catchError);
  }

  getWallpaper() {
    Observable.timer(0,3600000).subscribe(x => { // updates every 60 minutes
      let num = this.randomize();
      return this.background = this.sanitizer.bypassSecurityTrustStyle('url(../dashboard/assets/images/'+num+'.jpg)');
      //return this.background = this.sanitizer.bypassSecurityTrustStyle('url(https://asliantonio.com/dashboard/assets/images/'+num+'.jpg)');
    });
  }

  getWeather(latitude, longitude) {
    Observable.timer(0, 600000) // 10 minutes
    .subscribe(() => {
      this.weather.getWeather(latitude, longitude)
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

  goToCalendar() {
    window.open('https://calendar.google.com/calendar/r?tab=cc', '_blank');
  }

  goToGoogle() {
    window.open('https://www.google.com/', '_blank');
    this.siteSearch.nativeElement.focus();
  }

  goToWeather() {
    window.open('https://weather.com/weather/today/l/'+this.zipcode+':4:US', '_blank');
  }

  onEnter(value: string) {
    this.map.has(value) ? window.open(this.map.get(value)) : event.preventDefault();
  }

  setHotKeys() {
    this.hotkeyOpenNav = this._hotkeysService.add(new Hotkey('ctrl+`', (event: KeyboardEvent): boolean => {
      this.openNav();
      return false; // Prevent bubbling
    }));
    this.hotkeyCloseNav = this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
      this.closeNav();
      return false; // Prevent bubbling
    }));
    
  }

  subscribeAllLinks() {
    this.getLinks()
    .subscribe(
      data => {
        console.log(data);
        this.allLinks = data.links;
        for (let site of this.allLinks) {
          this.array.push(site.name);
          this.map.set(site.name, site.url);
        }
      },
      err => {
        console.error(err);
      }
    )
  }

  subscribeFavorites() {
    this.getFavorites()
    .subscribe(
      data => {
        console.log(data);
        this.favorites = data.links;
      },
      err => {
        console.error(err);
      }
    )
  }

  subscribeLocation(latitude, longitude) {
    this.getLocation(latitude, longitude)
    .subscribe(
      data => {
        console.log(data.results);
        this.city = data.results[0].address_components[2].long_name;
        this.state = data.results[0].address_components[5].short_name;
        this.zipcode = data.results[0].address_components[6].short_name;
      },
      err => {
        console.error(err);
      }
    )
  }

  toggleNav() {
    this.isOpen ? this.closeNav() : this.openNav();
  }

  private addIcon() {
    let skycons = new Skycons({"color": "white"});
    skycons.add("icon1", this.icon);
    skycons.play();
  }

  private openNav() {
    document.getElementById("sidenav").style.width = "215px";
    document.getElementById("page-wrapper").style.marginLeft = "215px";
    this.oElement.nativeElement.focus();
    this.isOpen = true;
  }

  closeNav() {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("page-wrapper").style.marginLeft = "0";
    this.isOpen = false;
    this.siteSearch.nativeElement.focus();
  }

  private randomize() {
    let num = Math.floor((Math.random() * 172) + 1);
    return num;
  }

  private logResponse(res: Response) {
    //console.log(res);
  }

  private extractData(res: Response) {
    return res.json();
  }
  
  private catchError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || "Server error.");
  }
  
}
