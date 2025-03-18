import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderProducts } from '../../../../entities/orderProductsDto';

@Component({
  selector: 'app-bucket-card',
  standalone: true,
  imports: [],
  templateUrl: './bucket-card.component.html',
  styleUrl: './bucket-card.component.scss'
})
export class BucketCardComponent {
  @Input() orderProducts: OrderProducts[] = [];
  @Input() orderHolder: string = "";
  @Output() setNameEvent = new EventEmitter<void>();

  totalValue() : number{
    var totalValueOfOrder = 0;

    this.orderProducts.forEach(p => {
      totalValueOfOrder += p.lineItem.amount * p.lineItem.price;
    })

    return totalValueOfOrder;
  }

  throwSetNameEvent(){
    this.setNameEvent.emit();
  }
}
