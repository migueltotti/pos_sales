import { NgIf } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import Collapse from 'bootstrap/js/dist/collapse';

@Component({
  selector: 'app-daily-stock',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './daily-stock.component.html',
  styleUrl: './daily-stock.component.scss'
})
export class DailyStockComponent implements AfterViewInit{
  collapses: Collapse[] = [];
  
  isLoadind = false;
  savedProduct = false;

  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.collapse');
    elements.forEach((element) => {
      this.collapses.push(new Collapse(element, { toggle: false }));
    });
  }

  toggleCollapse(id: string): void {
    const collapse = this.collapses.find(c => (c as unknown as { _element?: HTMLElement })._element?.id === id);
    if (collapse) {
      collapse.toggle();
    }
  }
}
