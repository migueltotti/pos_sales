import { Component, HostListener, OnInit } from '@angular/core';
import { OrderOutput } from '../../../entities/orderOutput';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Collapse from 'bootstrap/js/dist/collapse';
import { OrderCardComponent } from "../../components/orderCard/order-card/order-card.component";
import Toast from 'bootstrap/js/dist/toast';
import { OrderService } from '../../../services/order.service';
import { ModalComponent } from "../../components/modal/modal.component";
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { OrderReport } from '../../../entities/orderReport';
import { WorkDay } from '../../../entities/workDay';
import { WorkDayService } from '../../../services/work-day.service';
import { OrderUpdate } from '../../../entities/orderUpdate';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ReportService } from '../../../services/report.service';
import { ReportType } from '../../../entities/reportType';
import { AuthService } from '../../../services/auth.service';

const successCompleteToast = 'Pedido completo com sucesso!';
const failedCompleteToast = 'Erro ao completar pedido!';

const successExportToast = 'Relatório exportado com sucesso!';
const failedExportToast = 'Erro ao exportar relatório!';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    FormsModule,
    NgxMaskDirective,
    OrderCardComponent,
    ModalComponent,
    CommonModule
  ],
  providers: [provideNgxMask()],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit{
  collapses: { id: string; collapse: Collapse; isOpen: boolean }[] = [];
  isSmallScreen: boolean = window.innerWidth <= 500;
  reportTypeOptions = [
    { label: 'Excel', value: ReportType.Excel },
    { label: 'PDF', value: ReportType.PDF }
  ];

  ordersReport!: OrderReport | null;
  workDay!: WorkDay | null;

  isLoading = false;
  orderId = 0;

  date = ''; 
  todayDate = '';

  employee = '';
  estimatedRevenue = 0;
  orderAmount = 0;
  ordersCanceled = 0;
  exportType = 1;

  toastMessage = '';

  modalBody = '';
  modalTitle = '';

  constructor(
    private orderService: OrderService, 
    private workDayService: WorkDayService,
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.todayDate = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');
  }

  searchByDate(date: string){
    this.searchReportByDate(date);
    this.getWorkDayByDate(date);
  }

  searchReportByDate(date: string){
    this.isLoading = true;

    this.orderService.getOrdersReportByDate(date)
    .subscribe({
      next: (res) => {
        this.ordersReport = res.body;
        this.estimatedRevenue = this.ordersReport?.totalValue!;
        console.log(this.ordersReport)
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err)
        this.isLoading = false;
      }
    });
  }

  getWorkDayByDate(date: string){
    this.workDayService.getWorkDayByDate(date)
    .subscribe({
      next: (res) => {
        this.workDay = res.body;
        this.employee = res.body?.employeeName!;
        this.orderAmount = res.body?.numberOfOrders!;
        this.ordersCanceled = res.body?.numberOfCanceledOrders!;
      },
      error: (err) => console.error(err)
    });
  }

  exportReport(){
    this.reportService.sendReportTo(
      this.date,
      this.authService.getUserEmailFromStorage()!,
      this.exportType
    ).subscribe({
      next: (res) => {
        this.showSuccessToast(successExportToast);
      },
      error: (err) => {
        console.log(err);
        this.showFailToast(failedExportToast);
      }
    })
  }

  returnOrder(orderId: number){
    // update order status to "Sent : 2" and get report again
    var ord = this.ordersReport?.orders.find(o => o.orderId == orderId)!;

    var updateOrder = new OrderUpdate(
      ord.orderId, ord.totalValue, ord.orderDate, ord.orderStatus, ord.holder, ord.note, ord.lineItems
    )

    updateOrder.orderStatus = 2;

    this.isLoading = true;

    this.orderService.updateOrder(ord.orderId, updateOrder).pipe(
      switchMap((res) => {
          return forkJoin([
            this.orderService.getOrdersReportByDate(ord.orderDate),
            this.workDayService.getWorkDayByDate(ord.orderDate)
          ]);
      })
    ).subscribe({
      next: ([ordersReportRes, workDayRes]) => {
        this.showSuccessToast(successCompleteToast);

        // Atualiza os relatórios
        this.ordersReport = ordersReportRes.body;
        this.estimatedRevenue = this.ordersReport?.totalValue!;
  
        this.workDay = workDayRes.body;
        this.employee = workDayRes.body?.employeeName!;
        this.orderAmount = workDayRes.body?.numberOfOrders!;
        this.ordersCanceled = workDayRes.body?.numberOfCanceledOrders!;

        this.isLoading = false;
      },
      error: (err) => {
        this.showFailToast(failedCompleteToast);
        console.error(err);
        this.isLoading = false
      }
    });
  }

  selectProduct(ord: OrderOutput){
    this.orderId = this.orderId === ord.orderId ? 0 : ord.orderId;
  }

  returnDisableButtomValidation(){
    return this.orderId == 0 || 
            this.date !== this.todayDate || 
            (this.workDay?.finishDayTime !== null && this.workDay?.finishDayTime !== undefined)
  }

  triggerModal(){
    var ord = this.ordersReport?.orders.find(o => o.orderId == this.orderId)!;

    this.modalTitle = 'Retornar Produto';

    this.modalBody = ord.orderStatus != 1 ? 
        'Tem certeza que deseja retornar esse pedido?' :
        'Não é possivel retornar o pedido. Status do pedido: Preparando';
  }

  catchEvent(actionType: number){
    if(actionType == 1){
      this.returnOrder(this.orderId);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 620;
    //console.log(this.isSmallScreen);
  }

  showSuccessToast(text: string){
    this.toastMessage = text

    const toastElement = document.getElementById('successToast');
    if(toastElement){
        const toast = new Toast(toastElement);
        toast.show();
    }
  }

  showFailToast(text: string){
    this.toastMessage = text

    const toastElement = document.getElementById('failedToast');
    if(toastElement){
        const toast = new Toast(toastElement);
        toast.show();
    }
  }
}
