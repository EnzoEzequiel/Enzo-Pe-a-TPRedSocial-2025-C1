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
      chart: { type: 'line' as ChartType, height: 350, toolbar: { show: false } },
      series: [{ name: this.title, data }],
      xaxis: {
        categories,
        title: { text: this.selectedTab === 3 ? 'Publicaciones' : 'Usuarios' }
      },
      title: { text: this.title },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: true },
      grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.2 } },
      tooltip: {},
    };
  }

  async getData(): Promise<void> {
    let labels: string[] = [];
    let counts: number[] = [];

    // Corrección en el manejo de fechas
    const now = new Date();
    let from: Date, to: Date;

    if (this.selected === 'day') {
      from = new Date(now.setHours(0, 0, 0, 0));
      to = new Date(now.setHours(23, 59, 59, 999));
    } else if (this.selected === 'week') {
      from = new Date(now);
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
    } else {
      from = new Date(now);
      from.setMonth(from.getMonth() - 1);
      from.setHours(0, 0, 0, 0);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
    }

    try {
      let data: any;
      if (this.selectedTab === 1) {
        data = await firstValueFrom(this.statisticsService.getPostsByUser(from.toISOString(), to.toISOString()));
        labels = data.map((item: any) => item._id || 'Sin usuario');
        counts = data.map((item: any) => item.count);
      } else if (this.selectedTab === 2) {
        data = await firstValueFrom(this.statisticsService.getCommentsByDate(from.toISOString(), to.toISOString()));

        counts = data.length > 0 ? [data[0].count] : [0];
        labels = ['Total Comentarios'];

        // Alternativa para gráfico temporal
        // counts = data.map((item: any) => item.count);
        // labels = data.map((item: any) => new Date(item._id).toLocaleDateString());
      } else if (this.selectedTab === 3) {
        data = await firstValueFrom(this.statisticsService.getCommentsByPost(from.toISOString(), to.toISOString()));
        labels = data.map((item: any) => item._id?.title?.substring(0, 15) + '...' || 'Sin título');
        counts = data.map((item: any) => item.count);
      }

      console.log('Datos recibidos:', { labels, counts }); // Debug

      if (counts.length > 0 && counts.some(count => count > 0)) {
        this.chartOptions = this.buildChartOptions(labels, counts);
      } else {
        this.setEmptyChart();
        console.warn('Datos recibidos pero todos los valores son cero');
      }
    } catch (error) {
      this.setEmptyChart();
      console.error('Error al obtener los datos:', error);
    }
  }
  constructor(private statisticsService: StatisticsService) { }
}
