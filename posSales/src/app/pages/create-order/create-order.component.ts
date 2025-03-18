import { Component, OnInit, ViewChild } from '@angular/core';
import { BucketCardComponent } from "../../components/bucketCard/bucket-card/bucket-card.component";
import { Category } from '../../../entities/category';
import { OrderInput } from '../../../entities/orderInput';
import { Product } from '../../../entities/product';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { LineItemInput } from '../../../entities/lineItemInput';
import { OrderProducts } from '../../../entities/orderProductsDto';
import { ModalComponent } from "../../components/modal/modal.component";
import { HolderModalComponent } from '../../components/holder-modal/holder-modal.component';
import { NgClass, NgIf } from '@angular/common';

const testProducts: Product[] = [
  new Product(1, "Arroz Integral", "Pacote de 5kg de arroz integral", 25, 1, 100, "arroz.jpg", 10),
  new Product(2, "Feijão Preto", "Pacote de 1kg de feijão preto", 8, 2, 80, "feijao.jpg", 10),
  new Product(3, "Leite Desnatado", "Caixa de leite desnatado 1L", 6, 1, 50, "leite.jpg", 11),
  new Product(4, "Chocolate Meio Amargo", "Barra de chocolate 70% cacau", 12, 1, 40, "chocolate.jpg", 12),
  new Product(5, "Cereal Matinal", "Cereal matinal rico em fibras 300g", 15, 1, 60, "cereal.jpg", 13)
];

const testCategories: Category[] = [
  new Category(1, 'Bovinos', 'bovinos.jpg'),
  new Category(2, 'Suinos', 'suinos.jpg'),
  new Category(3, 'Aves', 'bovinos.jpg'),
  new Category(4, 'Diversos', 'bovinos.jpg')
];

const confirmModalTitle = "Confirmar Pedido";
const confirmModalBody = "Tem certeza que quer confirmar e lançar o pedido ?";

const cancelModalTitle = "Cancelar Pedido";
const cancelModalBody = "Tem certeza que quer cancelar e limpar o pedido ?";


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    BucketCardComponent,
    ModalComponent,
    HolderModalComponent,
    NgClass,
    NgIf
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent implements OnInit{
  @ViewChild('textModal') textModal!: HolderModalComponent;
  isLoading = false;

  title = 'posSales';
  products: Product[] = [];  
  product!: Product;
  categories: Category[] = [];
  order: OrderInput = new OrderInput(0, '', 1, '', '', []);
  lineItem!: LineItemInput;
  orderProducts: OrderProducts[] = [];

  orderNumber = 1;
  orderHolder = "";
  orderPhone = "";

  prodId = 0;
  prodAmount = 1;
  prodName = '';
  prodType = 1;

  modalTitle!: string;
  modalBody!: string;
  modalType: number = 0;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    //this.isLoading = true;
    this.products = testProducts;
    this.categories = testCategories;

    this.orderHolder = "Miguel Totti";
    this.orderPhone = "(18) 99787-2005"

    //this.getAllProducts();
    //this.getAllCategories();
  }

  increaseAmount(){
    if(this.prodType == 1)
      this.prodAmount++;
    else
    this.prodAmount = Math.round((this.prodAmount + 0.1) * 10) / 10;
  }

  decreaseAmount(){
    if(this.prodType == 1){
      if(this.prodAmount > 1)
        this.prodAmount--;
    }
    else{
      if(this.prodAmount > 0.1)
        this.prodAmount = Math.round((this.prodAmount - 0.1) * 10) / 10;
    }
  }

  selectProduct(prod: Product){
    this.prodId = this.prodId === prod.productId ? 0 : prod.productId;
    this.prodType = prod.typeValue;
    console.log(prod.productId);
  }

  addItem(){
    if(this.prodId == 0)
      return;

    if(this.orderHolder == ''){
      this.openHolderModel();
      return;
    }
      
    this.product = this.findProduct(this.prodId);

    this.lineItem = new LineItemInput(
      this.prodId,
      this.prodAmount,
      this.product.value
    );

    this.order.products.push(this.lineItem);
    this.order.products.forEach(p => this.order.totalValue += p.amount * p.price);
    this.orderProducts.push(
      new OrderProducts(this.findProduct(this.prodId), this.lineItem)
    )

    console.log(this.lineItem);
    console.log(this.findProduct(this.prodId));

    this.prodAmount = 1;
    this.prodId = 0
  }

  getAllProducts(){
    this.isLoading = true;
    
    this.productService.getProducts()
    .subscribe({
      next: (data) => {
        this.products = data
        this.isLoading = false;
      }
    });
  }

  getProductsByCategory(cat: Category){
    this.isLoading = true;
    
    this.categoryService.getProductsByCategoryId(cat.categoryId)
    .subscribe({
      next: (data) => {
        this.products = data
        this.isLoading = false;
      }
    });
  }

  getAllProductsByName(){
    this.isLoading = true;
    
    this.productService.getProductsByName(this.prodName)
    .subscribe({
      next: (data) => {
        this.products = data
        this.isLoading = false;
      }
    });
  }

  getAllCategories(){
    this.isLoading = true;
    
    this.categoryService.getCategories()
    .subscribe({
      next: (data) => {
        this.categories = data
        this.isLoading = false;
      }
    });
  }

  createOrder(){
    if(this.order.products.length == 0)
      return;

    this.order.orderDate = (new Date()).toISOString();
    this.order.orderStatus = 1;
    this.order.holder = this.orderHolder;
    this.order.note = this.orderPhone;

    //this.orderService.postOrder(this.order);
    //this.getAllProducts();

    console.log(`Order ${this.orderNumber} posted!`);
    console.log(this.order);

    this.orderNumber++;
    this.prodAmount = 1;
    this.prodId = 0
    this.orderHolder = "";
    this.orderPhone = "";
    this.orderProducts = [];
  }

  cancelOrder(){
    this.order = new OrderInput(0, '', 1, '', '', []);

    this.prodAmount = 1;
    this.prodId = 0
    this.orderHolder = "";
    this.orderPhone = "";
    this.orderProducts = [];
  }

  findProduct(prodId: number) : Product{
    return this.products.find(p => p.productId == prodId)!
  }

  triggerModal(type: number){
    if(type == 1){
      this.modalTitle = confirmModalTitle;
      this.modalBody = confirmModalBody;
      this.modalType = 1;
    }
    else{
      this.modalTitle = cancelModalTitle;
      this.modalBody = cancelModalBody;
      this.modalType = 0;
    }
  }

  catchEvent(actionType: number){
    if(actionType == 1){
      if(this.modalType == 1)
        this.createOrder();
      else
        this.cancelOrder();
    }
  }

  openHolderModel(){
    this.textModal.openModal();
  }

  setHolder(name: string){
    this.orderHolder = name;
  }
}
