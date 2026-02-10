import { Component, ElementRef, NgZone, ViewChild, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'donut-chart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card p-3">
      <h5 *ngIf="customTitle">{{ customTitle }}</h5>
      <div #chartDiv class="chart-container" style="height: 350px;"></div>
      <div *ngIf="!dataFound" class="text-center text-muted mt-3">
        {{ noDataText || 'No data found' }}
      </div>
    </div>
  `,
  styles: [`.chart-container { width: 100%; height: 350px; }`]
})
export class DonutChartComponent implements OnDestroy, AfterViewInit {
  @ViewChild('chartDiv', { static: false }) chartDiv!: ElementRef;

  @Input() customTitle = '';
  @Input() clickable = false;
  @Input() keys: { x: string; y: string } = { x: 'name', y: 'value' };
  @Input() loading = false;
  @Input() noDataText?: string;

  @Output() onClickData = new EventEmitter<any>();

  private chart!: am4charts.PieChart3D;
  private _data: any[] = [];
  public dataFound = true;

  @Input() set donutChartInput(data: any[]) {
    this._data = data ? JSON.parse(JSON.stringify(data)) : [];
    this.dataFound = !!data?.length;
    this.createChartIfReady();
  }

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.createChartIfReady();
  }

  private createChartIfReady() {
    if (!this.chartDiv || !this._data.length) return;

    if (this.chart) this.chart.dispose();

    this.zone.runOutsideAngular(() => {
      const chart = am4core.create(this.chartDiv.nativeElement, am4charts.PieChart3D);
      chart.innerRadius = am4core.percent(40);
      chart.data = this._data;
      this.chart = chart;

      const series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.category = this.keys.x;
      series.dataFields.value = this.keys.y;
      series.slices.template.strokeOpacity = 0;
      series.labels.template.text = `{${this.keys.y}}`;
      series.slices.template.tooltipText = `{${this.keys.x}}: {${this.keys.y}}`;

      if (this.clickable) {
        series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        series.slices.template.events.on('hit', (ev: any) => {
          if (ev?.target?.dataItem?.dataContext) {
            this.onClickData.emit(ev.target.dataItem.dataContext);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => this.chart?.dispose());
  }
}
