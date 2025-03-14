import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/navBar/nav-bar/nav-bar.component";
import { BucketCardComponent } from './components/bucketCard/bucket-card/bucket-card.component';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../entities/product';
import { Category } from '../entities/category';
import { OrderInput } from '../entities/orderInput';

var testProducts = [
  new Product(1, 'Frango Assado', '', 46.90, 1, 18, 'frangoAssado.png', 2),
  new Product(2, 'Frango Assado Desossado Recheado com Bacon', '', 62.90, 1, 1, 'frangoAssado.png', 2),
  new Product(3, 'Frango Assado Desossado Recheado com Batata, Queijo e Bacon', '', 69.90, 1, 1, 'frangoAssado.png', 2),
]

var testCategories = [
  new Category(1, 'Bovinos', 'bovinos.jpg'),
  new Category(2, 'Suinos', 'suinos.jpg'),
  new Category(3, 'Aves', 'aves.jpg'),
  new Category(4, 'Diversos', 'diversos.jpg')
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BucketCardComponent, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'posSales';
  products: Product[] = [];  
  categories: Category[] = [];
  order!: OrderInput;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService
  ){ }


  ngOnInit(): void {
    //this.getAllCategories();
    //this.getAllProducts();

    this.products = testProducts;
    this.categories = testCategories;
  }

  getAllProducts(){
    this.productService.getProducts()
    .subscribe({
      next: (res) => {
        this.products = res || [];
        // check all products button
      },
      error: (err) => console.log("An error ocurred trying to get all products."),
      complete: () => console.log("All products received successfully.")
    })
  }

  getProductsByCategory(categoryId: number){
    this.categoryService.getProductsByCategoryId(categoryId)
    .subscribe({
      next: (res) => {
        this.products = res || [];
        // check category button
      },
      error: (err) => console.log("An error ocurred trying to get products of category."),
      complete: () => console.log("Products of category received successfully.")
    })
  }

  getProductByName(prodName: string){
    this.productService.getProductsByName(prodName)
    .subscribe({
      next: (res) => {
        this.products = res || [];
        // check all products button
      },
      error: (err) => console.log("An error ocurred trying to get all products that match prodName."),
      complete: () => console.log("All products by name received successfully.")
    })
  }

  getAllCategories(){
    this.categoryService.getCategories()
    .subscribe({
      next: (res) => this.categories = res || [],
      error: (err) => console.log("An error ocurred trying to get all categories."),
      complete: () => console.log("All categories received successfully.")
    })
  }
}
