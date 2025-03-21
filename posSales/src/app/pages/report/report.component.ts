import { AfterViewInit, Component, NgModule } from '@angular/core';
import { Product } from '../../../entities/product';
import { OrderInput } from '../../../entities/orderInput';
import { OrderOutput } from '../../../entities/orderOutput';
import { FormsModule, NgModel } from '@angular/forms';
import { NgClass } from '@angular/common';
import Collapse from 'bootstrap/js/dist/collapse';
import { OrderCardComponent } from "../../components/orderCard/order-card/order-card.component";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    OrderCardComponent
],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements AfterViewInit{
  collapses: { id: string; collapse: Collapse; isOpen: boolean }[] = [];

  isLoading = false;
  orderId = 0;

  date!: string
  employee!: string
  estimatedRevenue!: number
  orderAmount!: number
  ordersCanceled!: number
  exportType!: string;

  orders: OrderOutput[] = [];


  searchReportByDate(){
    // get orders report by date
  }

  exportReport(){
    // export report
  }

  returnOrder(){
    // update order status to "Preparing" and get report again
  }

  selectProduct(ord: OrderOutput){
    this.orderId = this.orderId === ord.orderId ? 0 : ord.orderId;
    console.log(ord.orderId);
  }

  ngAfterViewInit(): void {
      const elements = document.querySelectorAll('.collapse');
      elements.forEach((element) => {
        const id = element.id;
        this.collapses.push({ id, collapse: new Collapse(element, { toggle: false }), isOpen: false });
      });
    }
  
    toggleCollapse(id: string): void {
      const collapseItem = this.collapses.find(c => c.id === id);
      if (collapseItem) {
        collapseItem.isOpen = !collapseItem.isOpen;
        collapseItem.collapse.toggle();
      }
    }
  
    isCollapseOpen(id: string): boolean {
      return this.collapses.find(c => c.id === id)?.isOpen ?? false;
    }
}
