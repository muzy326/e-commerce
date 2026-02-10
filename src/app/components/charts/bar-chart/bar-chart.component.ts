import { Component, ElementRef, NgZone, ViewChild, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'bar-chart',
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
export class BarChartComponent implements OnDestroy, AfterViewInit {
  @ViewChild('chartDiv', { static: false }) chartDiv!: ElementRef;

  @Input() customTitle = '';
  @Input() clickable = false;
  @Input() keys: { x: string; y: string } = { x: 'name', y: 'value' };
  @Input() loading = false;
  @Input() noDataText?: string;

  @Output() onClickData = new EventEmitter<any>();

  private chart!: am4charts.XYChart;
  private _data: any[] = [];
  private titleX = '';
  private titleY = '';
  public dataFound = true;

  @Input() set barChartInput(data: any) {
    this._data = data?.data ? JSON.parse(JSON.stringify(data.data)) : [];
    this.titleX = data?.xAxis || this.keys.x;
    this.titleY = data?.yAxis || this.keys.y;
    this.dataFound = !!this._data.length;
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
      const chart = am4core.create(this.chartDiv.nativeElement, am4charts.XYChart);
      this.chart = chart;
      chart.data = this._data;

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = this.keys.x;
      categoryAxis.title.text = this.titleX;
      categoryAxis.renderer.labels.template.truncate = true;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = this.titleY;

      const series = chart.series.push(new am4charts.ColumnSeries3D());
      series.dataFields.categoryX = this.keys.x;
      series.dataFields.valueY = this.keys.y;
      series.columns.template.tooltipText = `{categoryX}: {valueY}`;
      series.columns.template.strokeOpacity = 0;
      series.columns.template.width = am4core.percent(40);

      if (this.clickable) {
        series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        series.columns.template.events.on('hit', (ev: any) => {
          if (ev?.target?.dataItem?.dataContext) {
            this.onClickData.emit(ev.target.dataItem.dataContext);
          }
        });
      }

      if (this.customTitle) {
        const title = chart.titles.create();
        title.text = this.customTitle;
        title.marginBottom = 15;
      }
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => this.chart?.dispose());
  }
}
