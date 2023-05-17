import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  nombreDias = ['Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo'];

  constructor(private fb : FormBuilder) { }
  formDate = this.fb.group({
    date : [''],
    quincena : [],
    finmes : []
  })
  daysTable:any=[];
  ngOnInit(): void {

    console.log('dias ',this.daysTable);
    let today = new Date();
    this.formDate.controls['date'].patchValue(this.formatDate(today));
    let month =today.getMonth();
    let year = today.getFullYear();
    console.log('INIT',year,month);
    this.daysTable = this.getDaysInMonth(year,month);

    //this.daysTable = this.getDaysInMonth(this.month,this.year);

    this.formDate.controls['date'].valueChanges.subscribe(valor=>{

      let y = valor?.split('-')[0];
      let m = Number(valor?.split('-')[1]);
      console.log(valor,y,m);

     this.daysTable = this.getDaysInMonth(y,m);

    })

  }


  private formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month].join('-');
  }


/*   date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth() + 1;  */// 👈️ months are 0-based

  getDaysInMonth(year:any,month:any,locale='es-ES') {
    let date = new Date(year, month, 1);
    let days:any = [];
    let primeros15 = [];
    while (date.getMonth() === month) {
      //console.log(date,date.toLocaleDateString(locale, { weekday: 'long' }));

      days.push(new Date(date).getDate());
      for(let i=15;i<=days.length;i++){
        if(new Date(date).getDate() == i){
         // console.log(date,date.toLocaleDateString(locale, { weekday: 'long' }));
          primeros15.push({ dia : i, nombre : date.toLocaleDateString(locale, { weekday: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString(locale, { weekday: 'long' }).slice(1)});

        }
      }
      date.setDate(date.getDate() + 1);
    }
    //siguientes 15 dias
   /*  let next15 :any=[];

    while (date.getMonth()+1 === month+2) {
      next15.push(new Date(date).getDate());
      for(let i=1;i<=next15.length;i++){

        if(new Date(date).getDate() == i && i <=16){

           //primeros15.push({ dia : i, nombre : date.toLocaleDateString(locale, { weekday: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString(locale, { weekday: 'long' }).slice(1) });

         }


      }
      date.setDate(date.getDate() + 1);
    } */
    let dateNExt = new Date(year, month+1, 1);
    console.log(this.fullNext15(dateNExt,month+1));
    //primeros15.push(this.fullNext15)


    return primeros15;
  }


fullNext15(date : Date,month:any,locale='es-ES'){
  let next15 :any=[];
  let ultimos15 :any=[]
    console.log('fecha llega',date);
    console.log('mes llega',month);
    while (date.getMonth() === month) {
      //console.log(date,date.toLocaleDateString(locale, { weekday: 'long' }));

      next15.push(new Date(date).getDate());
      for(let i=1;i<=next15.length;i++){
       // console.log(date,date.toLocaleDateString(locale, { weekday: 'long' }));
        if(new Date(date).getDate() == i && i <=16){
          // console.log(date,date.toLocaleDateString(locale, { weekday: 'long' }));
          ultimos15.push({ dia : i, nombre : date.toLocaleDateString(locale, { weekday: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString(locale, { weekday: 'long' }).slice(1) });

         }

          //primeros15.push({ dia : i, nombre : date.toLocaleDateString(locale, { weekday: 'long' }) });
      }
      date.setDate(date.getDate() + 1);
    }
    return ultimos15;
}

}

