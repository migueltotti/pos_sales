import { Component, OnInit } from '@angular/core';
import { OrderOutput } from '../../../entities/orderOutput';
import { OrderService } from '../../../services/order.service';
import { NgClass, NgIf } from '@angular/common';
import { OrderCardComponent } from "../../components/orderCard/order-card/order-card.component";
import { LineItemOutput } from '../../../entities/lineItemOutput';
import { Product } from '../../../entities/product';
import { switchMap } from 'rxjs';
import { Toast } from 'bootstrap';

const testOrders: OrderOutput[] = [
  new OrderOutput(
      1,
      150.00,
      "2024-03-17T10:30:00Z",
      1,
      "Miguel Totti",
      "Entrega urgente",
      101,
      [
          new LineItemOutput(
              1,
              1,
              201,
              2,
              50.00,
              new Product(201, "Mouse Gamer", "Mouse óptico RGB", 50.00, 1, 10, "mouse.jpg", 1)
          ),
          new LineItemOutput(
              2,
              1,
              202,
              1,
              50.00,
              new Product(202, "Teclado Mecânico", "Teclado mecânico RGB", 50.00, 1, 5, "teclado.jpg", 1)
          )
      ]
  ),
  new OrderOutput(
      2,
      300.00,
      "2024-03-16T15:45:00Z",
      2,
      "Ana Souza",
      "Presente de aniversário",
      102,
      [
          new LineItemOutput(
              3,
              2,
              203,
              1,
              300.00,
              new Product(203, "Monitor 27'", "Monitor 144Hz Full HD", 300.00, 1, 3, "monitor.jpg", 2)
          )
      ]
  ),
  new OrderOutput(
      3,
      90.00,
      "2024-03-15T12:00:00Z",
      3,
      "Carlos Lima",
      "Retirar na loja",
      103,
      [
          new LineItemOutput(
              4,
              3,
              204,
              3,
              30.00,
              new Product(204, "Cabo HDMI", "Cabo HDMI 2 metros", 30.00, 1, 20, "cabo_hdmi.jpg", 3)
          )
      ]
  ),
  new OrderOutput(
      4,
      500.00,
      "2024-03-14T09:15:00Z",
      1,
      "Mariana Ferreira",
      "Entrega programada para sexta-feira",
      104,
      [
          new LineItemOutput(
              5,
              4,
              205,
              1,
              500.00,
              new Product(205, "Placa de Vídeo", "RTX 3060 12GB", 500.00, 1, 2, "placa_video.jpg", 4)
          )
      ]
  ),
  new OrderOutput(
      5,
      200.00,
      "2024-03-13T18:20:00Z",
      2,
      "Lucas Almeida",
      "Pagamento via boleto",
      105,
      [
          new LineItemOutput(
              6,
              5,
              206,
              4,
              50.00,
              new Product(206, "Fonte 600W", "Fonte 80 Plus Bronze", 50.00, 1, 8, "fonte.jpg", 5)
          )
      ]
  ),
  new OrderOutput(
    1,
    150.00,
    "2024-03-17T10:30:00Z",
    1,
    "Miguel Totti",
    "Entrega urgente",
    101,
    [
        new LineItemOutput(
            1,
            1,
            201,
            2,
            50.00,
            new Product(201, "Mouse Gamer", "Mouse óptico RGB", 50.00, 1, 10, "mouse.jpg", 1)
        ),
        new LineItemOutput(
            2,
            1,
            202,
            1,
            50.00,
            new Product(202, "Teclado Mecânico", "Teclado mecânico RGB", 50.00, 1, 5, "teclado.jpg", 1)
        )
    ]
),
new OrderOutput(
    2,
    300.00,
    "2024-03-16T15:45:00Z",
    2,
    "Ana Souza",
    "Presente de aniversário",
    102,
    [
        new LineItemOutput(
            3,
            2,
            203,
            1,
            300.00,
            new Product(203, "Monitor 27'", "Monitor 144Hz Full HD", 300.00, 1, 3, "monitor.jpg", 2)
        )
    ]
),
new OrderOutput(
    3,
    90.00,
    "2024-03-15T12:00:00Z",
    3,
    "Carlos Lima",
    "Retirar na loja",
    103,
    [
        new LineItemOutput(
            4,
            3,
            204,
            3,
            30.00,
            new Product(204, "Cabo HDMI", "Cabo HDMI 2 metros", 30.00, 1, 20, "cabo_hdmi.jpg", 3)
        )
    ]
),
new OrderOutput(
    4,
    500.00,
    "2024-03-14T09:15:00Z",
    1,
    "Mariana Ferreira",
    "Entrega programada para sexta-feira",
    104,
    [
        new LineItemOutput(
            5,
            4,
            205,
            1,
            500.00,
            new Product(205, "Placa de Vídeo", "RTX 3060 12GB", 500.00, 1, 2, "placa_video.jpg", 4)
        )
    ]
),
new OrderOutput(
    5,
    200.00,
    "2024-03-13T18:20:00Z",
    2,
    "Lucas Almeida",
    "Pagamento via boleto",
    105,
    [
        new LineItemOutput(
            6,
            5,
            206,
            4,
            50.00,
            new Product(206, "Fonte 600W", "Fonte 80 Plus Bronze", 50.00, 1, 8, "fonte.jpg", 5)
        )
    ]
)
];

const successToast = 'Pedido completo com sucesso!';
const failedToast = 'Erro ao completar pedido!';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    NgIf,
    OrderCardComponent
],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  isLoading = false;
  orders!: OrderOutput[];

  orderId = 0;

  toastMessage = ''

  constructor(private orderService: OrderService){}

  ngOnInit(): void {
    //this.isLoading = true;
    this.orders = testOrders;

    //this.getTodayOrders();
  }

  getTodayOrders(){
    this.isLoading = true;

    this.orderService.getAllOrdersByDateTimeNow(50, 'Preparing')
    .subscribe({
      next: (data) => {
        this.orders = data.body || [];
        this.isLoading = false;
      }
    })
  }

  completOrder(){
    if(this.orderId == 0)
        return;

    this.showToast(successToast);
    /*this.orderService.completeOrder(this.orderId)
    .pipe(
        switchMap((res) => {
            return this.orderService.getAllOrdersByDateTimeNow(50, 'Preparing')
        })
    ).subscribe({
        next: (data) => this.orders = data
    });*/
  }

  selectProduct(ord: OrderOutput){
    this.orderId = this.orderId === ord.orderId ? 0 : ord.orderId;
    console.log(ord.orderId);
  }

  showToast(text: string){
    this.toastMessage = text

    const toastElement = document.getElementById('toast');
    console.log(toastElement);
    if(toastElement){
        const toast = new Toast(toastElement);
        toast.show();
    }
  }
}
