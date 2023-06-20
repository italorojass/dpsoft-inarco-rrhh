import { Injectable } from '@angular/core';
import ChileanRutify from 'chilean-rutify';

@Injectable({
  providedIn: 'root'
})
export class BuildMonthService {

  constructor() { }
  formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month].join('-');
  }


  getDaysInMonth(init: any,final : any) {
    //console.log('llega al buildMont', init,final);
    let dayPeriodInit = Number(init.split('-')[2]);
    let dayPeriodFinal = Number(final.split('-')[2]);
    let dateInit = new Date(init);
    let dateFinal = new Date (final);
    //console.log('date format date', dateInit.toISOString())

    let periodoInicial = this.get_all_dates(dateInit.getFullYear(),dateInit.getMonth());
    let periodoFinal = this.get_all_dates(dateFinal.getFullYear(),dateFinal.getMonth());
    //console.log('arraydays', periodoInicial, periodoFinal);
    let primeros15: any = [];

    periodoInicial.forEach(element => {
      if(element.dia >= dayPeriodInit){
        primeros15.push(element);
      }
    });

    periodoFinal.forEach(element => {
      if(element.dia <= dayPeriodFinal){
        primeros15.push(element);
      }
    });

    return primeros15;
  }

  get_all_dates(year, month, locale = 'es-ES') {
    let date = new Date(year, month, 1);
    let dates = [];
    while (date.getMonth() === month) {
      dates.push({dia : date.getDate(), nombre : date.toLocaleDateString(locale, { weekday: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString(locale, { weekday: 'long' }).slice(1)})
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  weekDay(date: Date) {

    // var date = new Date,
    let days = ['Domingo', 'Lunes', 'Martes', 'Miércoles',
      'Jueves', 'Viernes', 'Sábado'],
      prefixes = ['Primer', 'Segunda', 'Tercera', 'Cuarta', 'Quinta'];
    let semana = 0 | date.getDate() / 7;
    console.log('nombre semana', semana)

    return prefixes[0 | date.getDate() / 7] + ' ' + days[date.getDay()];

  }

  getWeeksInMonth(year, month) {
    const weeks = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate();

    let dayOfWeekCounter = firstDate.getDay();

    for (let date = 1; date <= numDays; date++) {
      if (dayOfWeekCounter === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(date);
      dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }

    return weeks
      .filter((w) => !!w.length)
      .map((w) => ({
        start: w[0],
        end: w[w.length - 1],
        dates: w,
      }));
  }

  formatRut(rut,dig){

    return ChileanRutify.formatRut(`${rut}-${dig}`);
  }

}
