import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  constructor() { }

  daysTable:any=[];
  ngOnInit(): void {
    this.daysTable = this.getDaysInMonth(this.month,this.year);

  }

  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth() + 1; // 👈️ months are 0-based
  day = 1;
  // Get first day of the next month
  firstDayOfMonth = new Date(this.year, this.month, this.day);

  getDaysInMonth(month:any, year:any) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }

    let primeros15 = [];
   for(let i=16;i<=days.length;i++){
    primeros15.push(i);
   }
   //siguientes 15 dias
   for(let i= 1;i<=15;i++){
    primeros15.push(i);
   }
    return primeros15;
  }
}
