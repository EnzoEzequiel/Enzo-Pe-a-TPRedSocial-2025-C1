import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  imports: [CommonModule]
})
export class ChartFilterComponent {
  selected: string = 'day';
  @Output() rangeChange = new EventEmitter<string>();

  selectRange(option: string) {
    this.selected = option;
    this.rangeChange.emit(option);
  }
}
