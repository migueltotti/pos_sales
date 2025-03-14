import { Component } from '@angular/core';
import { BucketCardComponent } from "../../components/bucketCard/bucket-card/bucket-card.component";
import { Category } from '../../../entities/category';
import { OrderInput } from '../../../entities/orderInput';
import { Product } from '../../../entities/product';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [BucketCardComponent],
  providers: [ProductService],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent {
  title = 'posSales';
  products: Product[] = [];  
  categories: Category[] = [];
  order!: OrderInput;

  //productService = inject(ProductService);
  constructor(
    private productService: ProductService
  ) {}
  // ESSA BUCETA NAO FUNCIONA!!!!!!!!

}
