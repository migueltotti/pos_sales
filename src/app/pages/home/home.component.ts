import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { color } from 'chart.js/helpers';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { WorkDayService } from '../../../services/work-day.service';
import Toast from 'bootstrap/js/dist/toast';
import { CommonModule } from '@angular/common';
import { WorkDay } from '../../../entities/workDay';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NumberOfOrderByDate } from '../../../entities/numberOfOrderByDate';

Chart.register(...registerables);
Chart.defaults.color = 'rgba(255, 255, 255, 1)'

const successStartWorkDayToast = 'Dia de trabalho iniciado com sucesso';
const failedStartWorkDayToast = 'Erro ao iniciar dia de trabalho!';

const successFinishWorkDayToast = 'Dia de trabalho finalizado com sucesso';
const failedFinishWorkDayToast = 'Erro ao finalizar dia de trabalho!';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  isStartingLoading = false;
  isFinishingLoading = false;
  isWorkDayDone = false;
  userName = '';
  userId = 0;
  todayDate!: string;
  toastMessage = '';

  workDay!: WorkDay | null;

  ordersDataValues: number[] = [];
  firstOrdersDataValues: number[] = [];
  secondOrdersDataValues: number[] = [];

  products: string[] = [];
  values: number[] = [];

  ordersChart: any;
  ordersData = {
    labels: this.getLast8Sundays().reverse(),
    datasets: [
      {
        label: 'Pedidos',
        data: this.ordersDataValues,
        backgroundColor: [
          'rgba(125, 0, 9, 0.5)'
        ],
        borderColor: [
          'rgb(125, 0, 9, 1)'
        ],
        borderWidth: 3
      }
    ]
  };
  ordersChartConfig: any = {
    type: 'bar',
    data: this.ordersData,
    options: {
      y: {
        beginAtZero: true
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Numero de Pedidos por Domingo'
        }
      }
    },
  };

  firtsOrdersChart: any;
  firstordersData = {
    labels: this.getLast8Sundays().reverse().slice(0, 4),
    datasets: [
      {
        label: 'Pedidos',
        data: this.ordersDataValues.slice(0, 4),
        backgroundColor: [
          'rgba(125, 0, 9, 0.5)'
        ],
        borderColor: [
          'rgb(125, 0, 9, 1)'
        ],
        borderWidth: 3
      }
    ]
  };
  firstordersChartConfig: any = {
    type: 'bar',
    data: this.firstordersData,
    options: {
      y: {
        beginAtZero: true
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Numero de Pedidos por Domingo'
        }
      }
    },
  };

  secondOrdersChart: any;
  secondOrdersData = {
    labels: this.getLast8Sundays().reverse().slice(4, 8),
    datasets: [
      {
        label: 'Pedidos',
        data: this.secondOrdersDataValues,
        backgroundColor: [
          'rgba(125, 0, 9, 0.5)'
        ],
        borderColor: [
          'rgb(125, 0, 9, 1)'
        ],
        borderWidth: 3
      }
    ]
  };
  secondOrdersChartConfig: any = {
    type: 'bar',
    data: this.secondOrdersData,
    options: {
      y: {
        beginAtZero: true
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  };

  productsChart: any;
  prodsData = {
    labels: this.products,
    datasets: [
      {
        label: 'Produtos',
        data: this.values,
        backgroundColor: [
          'rgba(125, 0, 9, 0.5)',
          'rgba(253, 203, 88, 0.7)',
          'rgba(217, 217, 217, 0.7)',
          'rgba(255, 246, 167, 0.7)',
          'rgba(61, 61, 61, 0.7)'
        ],
        borderColor: [
          'rgba(125, 0, 9, 1)',
          'rgba(253, 203, 88, 1)',
          'rgba(217, 217, 217, 1)',
          'rgba(255, 246, 167, 1)',
          'rgba(61, 61, 61, 1)'
        ],
        borderWidth: 3
      }
    ]
  };
  prodsChartConfig: any = {
    type: 'pie',
    data: this.prodsData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Produtos mais vendidos nos ultimos 2 meses'
        }
      }
    },
  };
  
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
    private workDayService: WorkDayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.getProducts();
    this.getTodayWorkDay();

    this.todayDate = (new Date()).toLocaleDateString('pt-BR');
    //this.ordersChart = new Chart('OrdersChart', this.ordersChartConfig);
    //this.productsChart = new Chart('ProductsChart', this.prodsChartConfig);

    this.userName = this.authService.getUserNameFromStorage()!;
    this.userId = this.authService.getUserIdFromStorage()!;
    if(this.userName.includes('-')){
      var indexHifen = this.userName.indexOf('-')
      this.userName = this.userName.substring(0, indexHifen);
    }
  }

  getOrders(){
    let numberOfOrdersByDate: NumberOfOrderByDate[] = [];

    const last8Sundays = (this.getLast8Sundays()).reverse();
    var numberOfOrders = new Map<string, number>()
    last8Sundays.forEach(s => {
      var date = s.split('/');
      numberOfOrders.set(date[2]+'-'+date[1]+'-'+date[0], 0)
    })

    this.orderService.getNumberOfOrdersFromTodayToLast8Weeks().
    subscribe({
      next: (res) => {
        numberOfOrdersByDate = res.body || [];

        numberOfOrdersByDate.forEach(no => numberOfOrders.set(no.date, no.numberOfOrders));

        var numberOfOrderList = Array.from(numberOfOrders.values());

        // Data Principal Chart
        for(let i = 0; i < 8; i++){
          this.ordersDataValues.push(numberOfOrderList[i]);
        }

        // Data First Chart
        for (let i = 0; i < 4; i++) {
          this.firstOrdersDataValues.push(this.ordersDataValues[i]);
        }
        // Data Second Chart
        for (let i = 4; i < 8; i++) {
          this.secondOrdersDataValues.push(this.ordersDataValues[i]);
        }

        this.ordersChart = new Chart('OrdersChart', this.ordersChartConfig);
        this.firtsOrdersChart = new Chart('FirstOrdersChart', this.firstordersChartConfig);
        this.secondOrdersChart = new Chart('SecondOrdersChart', this.secondOrdersChartConfig);
      }
    })
  }

  getProducts(){
    this.productService.get5BestSellingProducts(2).
    subscribe({
      next: (res) => {
        res.body?.forEach(prod => {
          this.products.push(prod.prodName);
          this.values.push(prod.productCount);
        });

        this.productsChart = new Chart('ProductsChart', this.prodsChartConfig);
      }
    })
  }

  getLast8Sundays(): string[] {
    const sundays: string[] = [];
    const today = new Date();
    
    // Encontrar o último domingo (ou hoje, se já for domingo)
    const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - dayOfWeek); // Retrocede até o último domingo
    
    // Gerar os últimos 8 domingos
    for (let i = 0; i < 8; i++) {
      const sunday = new Date(lastSunday);
      sunday.setDate(lastSunday.getDate() - i * 7); // Subtrai semanas
  
      // Formatar a data como "dd/MM/yyyy"
      const formattedDate = sunday.toLocaleDateString('pt-BR');
      sundays.push(formattedDate);
    }
  
    return sundays;
  }

  getTodayWorkDay(){
    const todayDate = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');

    this.workDayService.getWorkDayByDate(todayDate)
    .subscribe({
      next: (res) => {
        this.workDay = res.body
        this.workDayService.isWorkDayInProgressSubject.next(true);

        if(res.body?.startDayTime != null && res.body?.finishDayTime != null){
          this.isWorkDayDone = true;
          this.workDayService.isWorkDayInProgressSubject.next(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.workDayService.isWorkDayInProgressSubject.next(false);
      }
    })
  }

  startWorkDay(){
    if(this.userId == 0)
      return;

    console.log(this.userId);

    this.isStartingLoading = true;

    this.workDayService.startWokDay(this.userId)
    .subscribe({
      next: (res) => {
        this.isStartingLoading = false;
        this.workDay = res.body;
        this.workDayService.isWorkDayInProgressSubject.next(true);
        this.showSuccessToast(successStartWorkDayToast);
        this.router.navigate(['/estoque/config']);
      },
      error: (err) => {
        this.isStartingLoading = false;
        console.log(err);
        this.showFailToast(failedStartWorkDayToast);
      }
    })
  }

  finishWorkDay(){
    if(this.userId == 0)
      return;

    this.isFinishingLoading = true;

    const workDayId = this.workDayService.getWorkDayIdFromStorage();

    this.workDayService.finishWokDay(workDayId)
    .subscribe({
      next: (res) => {
        this.isFinishingLoading = false;
        this.workDay = res.body;
        this.isWorkDayDone = true;
        this.workDayService.isWorkDayInProgressSubject.next(false);
        this.showSuccessToast(successFinishWorkDayToast);
        this.router.navigate(['/relatorio']);
      },
      error: (err) => {
        this.isFinishingLoading = false;
        console.log(err);
        this.showFailToast(failedFinishWorkDayToast);
      }
    })
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
