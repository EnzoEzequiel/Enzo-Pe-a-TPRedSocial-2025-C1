import { Component, Input } from '@angular/core';
import { ChartOptions } from '../../dashboard-statistics.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  standalone: true,
  selector: 'app-generic-graphic',
  imports: [NgApexchartsModule],
  templateUrl: './generic-graphic.component.html',
  styleUrl: './generic-graphic.component.css'
})
export class GenericGraphicComponent {
  @Input() chartOptions!: ChartOptions;
}
