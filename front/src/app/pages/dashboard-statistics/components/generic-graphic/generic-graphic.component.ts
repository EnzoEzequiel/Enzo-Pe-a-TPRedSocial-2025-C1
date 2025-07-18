import { Component, Input } from '@angular/core';
import { ChartOptions } from '../../dashboard-statistics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-generic-graphic',
  imports: [NgApexchartsModule,CommonModule],
  templateUrl: './generic-graphic.component.html',
  styleUrl: './generic-graphic.component.css'
})
export class GenericGraphicComponent {
  @Input() chartOptions!: ChartOptions;
}
