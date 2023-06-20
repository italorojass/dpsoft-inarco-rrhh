import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-pinned-row-renderer',
  templateUrl: './custom-pinned-row-renderer.component.html',
  styleUrls: ['./custom-pinned-row-renderer.component.css']
})
export class CustomPinnedRowRendererComponent {
  public params: any;
  public style!: string;

  agInit(params: any): void {
    this.params = params;
    this.style = this.params.style;
  }

  refresh(): boolean {
    return false;
  }
}
