import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

    dayNames: string[] = [];
    monthNames: string[] = [];
    timeOfDay: string;
    hours: number;
    minutes: string;
    dayOfWeek: string;
    month: string;
    day: number;
    year: number;
    dateObj: any;

    constructor() { }
    
    getDate() {

        this.dayNames = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
        this.monthNames = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
        
        let dt = new Date();
        let y = dt.getFullYear();
        this.hours = dt.getHours();
        let minutes = dt.getMinutes()<10?'0':'';
        if (y < 1000) { y +=1900; }
        if(this.hours < 12) {
            this.timeOfDay = "morning";
        } else if(this.hours >= 12 && this.hours < 17) {
            this.timeOfDay = "afternoon";
        } else {
            this.timeOfDay = "evening";
        }
        if(this.hours > 12) {
            this.hours = this.hours - 12;
        }

        this.minutes = minutes + dt.getMinutes();
        this.dayOfWeek = this.dayNames[dt.getDay()];
        this.month = this.monthNames[dt.getMonth()];
        this.day = dt.getDate();
        this.year = y;
        
      return this.dateObj = {
          "timeOfDay": this.timeOfDay,
          "hours": this.hours,
          "minutes": this.minutes,
          "dayOfWeek": this.dayOfWeek,
          "month": this.month,
          "day": this.day,
          "year": this.year
      }
    
    }


}
