import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-horas-extra',
  templateUrl: './horas-extra.component.html',
  styleUrls: ['./horas-extra.component.css']
})
export class HorasExtraComponent implements OnInit {

  constructor() { }
  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth() + 1; // 👈️ months are 0-based
  day = 1;
  // Get first day of the next month
  firstDayOfMonth = new Date(this.year, this.month, this.day);
  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  ngOnInit(): void {

    let day = this.weekday[this.date.getDay()];
    console.log(day);

    let first = (this.date.getDate() - this.date.getDay()) + 1;
    var last = first + 6;
    var firstday = new Date(this.date.setDate(first));
    var lastday = new Date(this.date.setDate(last));

    let dayString = this.weekday[firstday.getDay()]
    let lastDayString = this.weekday[lastday.getDay()]
    console.log(firstday, dayString, lastday, lastDayString);


  }


}
