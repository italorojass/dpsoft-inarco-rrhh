import { Component, Input } from '@angular/core';
import { GuiColumn, GuiColumnMenu, GuiInfoPanel, GuiLocalization, GuiPaging, GuiPagingDisplay, GuiSearching, GuiSorting, GuiSummaries, GuiTitlePanel } from '@generic-ui/ngx-grid';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent {

  @Input() datos : any;
  @Input() columnas : any=[];
  @Input() placeHolder : any;

  summaries: GuiSummaries = {
    enabled: true
};
trainingSummaries = {
  enabled: true,
  summariesTypes: [
    'sum'
  ]
};
  constructor(){

  }
   searching: GuiSearching = {
		enabled: true,
		placeholder: 'Buscar en detalle pagos'
	};
  sorting: GuiSorting = {
    enabled: true,
    multiSorting: true
};


edit(item){

}

dictFicha : any = {
  F1 : 'badge-outline-primary',
  F2 : 'badge-outline-info2',
  F3 : 'badge-outline-warning2',
  F4 :  'badge-outline-info',
  F5 :  'badge-outline-danger2'
}

validFicha(value){
  if(this.dictFicha[value]){
    return this.dictFicha[value]
  }else{
    value
  }
}
getBadgeFicha(ficha:any){
  return this.dictFicha[ficha];
}

  loading = false;
  paging: GuiPaging = {
		enabled: true,
		page: 1,
		pageSize: 10,
		pageSizes: [10, 25, 50,100],
		pagerTop: true,
		pagerBottom: true,
		display: GuiPagingDisplay.ADVANCED
	};
  columnMenu: GuiColumnMenu = {
		enabled: true,
		sort: true,
		columnsManager: true
	};

  infoPanel: GuiInfoPanel = {
		enabled:true,
		infoDialog:false,
		columnsManager:true,
	 };

  localization: GuiLocalization = {
    'translation': {
        'pagingItemsPerPage': 'Ítems por página',
        'pagingOf': 'de',
        'pagingPrevPage': 'Anterior',
        'pagingNextPage': 'Siguiente',
        "pagingNoItems": "No hay mas registros",
        "headerMenuColumnsTab": "Columnas",
        "headerMenuMainTabColumnSort": "Ordenar",
        "headerMenuMainTab": "Menú",
        "headerMenuMainTabColumnSortAscending": "Ascendente",
        "headerMenuMainTabColumnSortDescending": "Descendente",
        "headerMenuMainTabColumnSortNone": "Ninguna",
        "headerMenuFilterTab": "Filtro",
        "summariesCountTooltip": "Número de items por tabla",
        "infoPanelThemeMangerTooltipText": "Opciones de tema",
        "infoPanelColumnManagerTooltipText": "Opciones de columna",
        "columnManagerModalTitle": "Ver columnas",
        "themeManagerModalRowColoring": "Color de la celda:",
        "infoPanelInfoTooltipText": "Información",
        "sourceEmpty": "Sin datos para mostrar",
        "themeManagerModalVerticalGrid": "Vista vertical",
        "themeManagerModalHorizontalGrid": "Vista horizontal",
        "headerMenuMainTabMoveLeft": "Mover a la izquiera",
        "headerMenuMainTabMoveRight": "Mover a la derecha",
        "headerMenuMainTabHideColumn": "Ocultar columna",
        "headerMenuMainTabHighlightColumn": "Remarcar",
        "infoPanelShowing": "Estás viendo",
        "infoPanelItems": "registros",
        "infoPanelOutOf": "out of",
        "themeManagerModalTitle": "Opciones del tema",
        "themeManagerModalTheme": "Tema:"
    }
};
}
