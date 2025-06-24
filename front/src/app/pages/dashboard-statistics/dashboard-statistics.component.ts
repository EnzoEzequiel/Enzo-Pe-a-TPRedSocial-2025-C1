import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GenericGraphicComponent } from './components/generic-graphic/generic-graphic.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { ChartFilterComponent } from './components/chart-filter/chart-filter.component';
import { StatisticsService } from '../../services/statistics/statistics.service';
import { firstValueFrom } from 'rxjs';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ChartType,
  ApexTooltip,
  ApexStroke,
  ApexDataLabels,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard-statistics',
  standalone: true,
  templateUrl: './dashboard-statistics.component.html',
  imports: [
    CommonModule,
    NgApexchartsModule,
    GenericGraphicComponent,
    RouterLink,
    ChartFilterComponent,
  ],
  providers: [StatisticsService]
})
export class DashboardStatisticsComponent {
  title = 'Publicaciones por usuario';
  selectedTab: number = 1;
  selected: string = 'day';
  chartOptions: any = null;

  ngOnInit(): void {
    this.getData();
  }

  changeTab(tab: number) {
    this.selectedTab = tab;
    this.selectTitle(tab);
    this.getData();
  }

  selectTitle(tab: number) {
    switch (tab) {
      case 1:
        this.title = 'Publicaciones por usuario';
        break;
      case 2:
        this.title = 'Cantidad de comentarios totales';
        break;
      case 3:
        this.title = 'Comentarios por publicación';
        break;
      default:
        this.title = 'Publicaciones por usuario';
        break;
    }
  }

  OnChangeRange(range: string) {
    this.selected = range;
    this.getData();
  }

  private setEmptyChart() {
    this.chartOptions = this.buildChartOptions([], []);
  }

  private buildChartOptions(categories: string[], data: number[]): ChartOptions {
    return {
      chart: { type: 'bar' as ChartType },
      series: [{ name: this.title, data }],
      xaxis: {
        categories,
        title: { text: this.selectedTab === 3 ? 'Publicaciones' : 'Usuarios' }
      },
      title: { text: this.title },
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: true },
      grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.2 } },
      tooltip: {},
    };
  }

  async getData(): Promise<void> {
    let labels: string[] = [];
    let counts: number[] = [];

    try {
      const data = await firstValueFrom(
        this.statisticsService.getStatistics(this.selectedTab, this.selected)
      );

      if (!data) {
        this.setEmptyChart();
        return;
      }

      if (this.selectedTab === 2) {
        const stats = Array.isArray(data) ? data[0] : data;
        counts = [stats.totalComments || 0];
        labels = ['Total Comentarios'];
      } else if (Array.isArray(data) && data.length > 0) {
        counts = data.map((item: any) => item.count);
        switch (this.selectedTab) {
          case 1:
            labels = data.map((item: any) => item.username || item.firstName || 'Sin usuario');
            break;
          case 3:
            labels = data.map((item: any) => item.content || 'Sin contenido');
            break;
          default:
            labels = data.map((item: any) => item.username || item.firstName || 'Sin usuario');
            break;
        }
      } else {
        this.chartOptions = null;
        return;
      }

      this.chartOptions = {
        chart: { type: 'bar' as ChartType },
        series: [{ name: this.title, data: counts }],
        xaxis: {
          categories: labels,
          title: {
            text:
              this.selectedTab === 1
                ? 'Usuarios'
                : this.selectedTab === 2
                  ? 'Comentarios'
                  : 'Publicaciones'
          }
        },
        title: { text: this.title },
        stroke: { curve: 'smooth' },
        dataLabels: { enabled: true },
        fill: { colors: ['#f3f3f3', '#f3f3f3'] },
        grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.2 } },
      };

    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }
  constructor(private statisticsService: StatisticsService) { }
}
