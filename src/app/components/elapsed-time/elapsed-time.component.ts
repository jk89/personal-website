import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-elapsed-time',
  templateUrl: './elapsed-time.component.html',
  styleUrls: ['./elapsed-time.component.scss'],
})
export class ElapsedTimeComponent implements OnInit {

  @Input("day") day: string = null;
  @Input("month") month: string = null;
  @Input("year") year: string = null;
  @Input("hour") hour: string = "00";
  @Input("minute") minute: string = "00";
  @Input("second") second: string = "00";
  // @Input("timezone") timezone: string = "GMT";

  @Input("show_years_since") show_years_since: boolean = true;
  @Input("show_months_since") show_months_since: boolean = true;
  @Input("show_days_since") show_days_since: boolean = true;
  @Input("show_hours_since") show_hours_since: boolean = true;
  @Input("show_minutes_since") show_minutes_since: boolean = true;
  @Input("show_seconds_since") show_seconds_since: boolean = true;

  constructor() { }

  datetime_unix = null;
  datetime = null;
  now_unix = Date.now();
  now = new Date(this.now_unix);

  countdownString = "";

  updateElapsedTime() {
    // update now
    this.now_unix = Date.now();
    this.now = new Date(this.now_unix);

    const datetime = new Date(this.datetime_unix);

    let years = this.now.getFullYear() - datetime.getFullYear();
    let months = this.now.getMonth() - datetime.getMonth();
    let days = this.now.getDate() - datetime.getDate();
    
    if (days < 0) {
        months--;
        days += new Date(this.now.getFullYear(), this.now.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const hours = this.now.getHours() - datetime.getHours();
    const minutes = this.now.getMinutes() - datetime.getMinutes();
    const seconds = this.now.getSeconds() - datetime.getSeconds();
    
    let output = [];

    if (this.show_years_since == true && years) {
      if (years !== 1) {
        output.push(`${years} years`);
      }
      else {
        output.push(`${years} year`);
      }
    }
    if (this.show_months_since == true && months) {

      if (months !== 1) {
        output.push(`${months} months`);
      }
      else {
        output.push(`${months} month`);
      }
    }
    if (this.show_days_since == true && days) {
      if (days !== 1) {
        output.push(`${days} days`);
      }
      else {
        output.push(`${days} day`);
      }
    }
    if (this.show_hours_since == true && hours) {
      if (hours !== 1) {
        output.push(`${hours} hours`);
      }
      else {
        output.push(`${hours} hour`);
      }
    }
    if (this.show_minutes_since == true && minutes) {
      if (minutes !== 1) {
        output.push(`${minutes} minutes`);
      }
      else {
        output.push(`${minutes} minute`);
      }
    }
    if (this.show_seconds_since == true && seconds) {
      if (seconds !== 1) {
        output.push(`${seconds} seconds`);
      }
      else {
        output.push(`${seconds} second`);
      }
    }

    if (output.length > 1) {
      const everythingButLast = output.slice(0, -1);
      const lastItem = output[output.length - 1];
      const everythingButLastJoined = [everythingButLast.join(", ")];
      this.countdownString = [everythingButLastJoined, lastItem].join(" and ");
    }
    else {
      this.countdownString = output[0];
    }
  }

  ngOnInit() {
    const datetimeString = `${this.day} ${this.month} ${this.year} ${this.hour}:${this.minute}:${this.second}`; // ${this.timezone}
    this.datetime_unix = Date.parse(datetimeString);
    this.datetime = new Date(this.datetime_unix);
    this.updateElapsedTime();
    setInterval(()=>this.updateElapsedTime(),1000);
  }

}
