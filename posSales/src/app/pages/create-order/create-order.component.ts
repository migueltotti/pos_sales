import { Component } from '@angular/core';
import { BucketCardComponent } from "../../components/bucketCard/bucket-card/bucket-card.component";
import { Category } from '../../../entities/category';
import { OrderInput } from '../../../entities/orderInput';
import { Product } from '../../../entities/product';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [BucketCardComponent],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent {
  title = 'posSales';
  products: Product[] = [];  
  categories: Category[] = [];
  order!: OrderInput;

  //productService = inject(ProductService);
  //constructor(private service: OrderService) {}
  // ESSA BUCETA NAO FUNCIONA!!!!!!!!

}
