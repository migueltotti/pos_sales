import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { color } from 'chart.js/helpers';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';

Chart.register(...registerables);
Chart.defaults.color = 'rgba(255, 255, 255, 1)'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  userName = '';
  todayDate!: string;

  ordersDataValues: number[] = [];
  productsBestSelling: Map<string, number> = new Map<string, number>();

  ordersChart: any;
  ordersData = {
    labels: this.getLast8Sundays().reverse(),
    datasets: [
      {
        label: 'Pedidos',
        data: this.ordersDataValues,
        backgroundColor: [
          'rgba(125, 0, 9, 0.7)'
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

  productsChart: any;
  prodsData = {
    labels: this.productsBestSelling.keys(),
    datasets: [
      {
        label: 'Produtos',
        data: this.productsBestSelling.values(),
        backgroundColor: [
          'rgba(125, 0, 9, 0.7)',
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
    this.getProducts();

    this.todayDate = (new Date()).toLocaleDateString('pt-BR');
    this.ordersChart = new Chart('OrdersChart', this.ordersChartConfig);
    this.productsChart = new Chart('ProductsChart', this.prodsChartConfig);

    this.userName = this.authService.getUserNameFromStorage()!;
    if(this.userName.includes('-')){
      var indexHifen = this.userName.indexOf('-')
      this.userName = this.userName.substring(0, indexHifen);
    }
  }

  getOrders(){
    this.orderService.getNumberOfOrdersFromTodayToLast8Weeks().
    subscribe({
      next: (res) => {
        res.body?.forEach(day => {
          this.ordersDataValues.push(day.numberOfOrders)
        });
      }
    })
  }

  getProducts(){
    this.productService.get5BestSellingProducts(2).
    subscribe({
      next: (res) => {
        res.body?.forEach(prod => {
          this.productsBestSelling.set(prod.prodName, prod.productCount)
        });
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
}
