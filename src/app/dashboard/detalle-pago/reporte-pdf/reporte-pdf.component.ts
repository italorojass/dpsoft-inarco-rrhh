import { Component, Input, TemplateRef } from '@angular/core';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-reporte-pdf',
  templateUrl: './reporte-pdf.component.html',
  styleUrls: ['./reporte-pdf.component.css']
})
export class ReportePdfComponent {

  @Input() docDefinition:any;
  createPDF(action = 'open') {



    if(action==='download'){
      pdfMake.createPdf(this.docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(this.docDefinition).print();
    }else{
      pdfMake.createPdf(this.docDefinition).open();
    }


  }

}
