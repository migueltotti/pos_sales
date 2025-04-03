import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import Toast from 'bootstrap/js/dist/toast';
import { NoteModalComponent } from '../../components/note-modal/note-modal.component';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { FormsModule, NgModel } from '@angular/forms';
import { WorkDayService } from '../../../services/work-day.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

const testProducts: Product[] = [
  new Product(1, "Arroz Integral", "Pacote de 5kg de arroz integral", 25, 2, 100, "arroz.jpg", 10),
  new Product(2, "Feijão Preto", "Pacote de 1kg de feijão preto", 8, 1, 80, "feijao.jpg", 10),
  new Product(3, "Leite Desnatado", "Caixa de leite desnatado 1L", 6, 2, 50, "leite.jpg", 11),
  new Product(4, "Chocolate Meio Amargo", "Barra de chocolate 70% cacau", 12, 2, 40, "chocolate.jpg", 12),
  new Product(5, "Cereal Matinal", "Cereal matinal rico em fibras 300g", 15, 2, 60, "cereal.jpg", 13),
  new Product(1, "Arroz Integral", "Pacote de 5kg de arroz integral", 25, 2, 100, "arroz.jpg", 10),
  new Product(2, "Feijão Preto", "Pacote de 1kg de feijão preto", 8, 1, 80, "feijao.jpg", 10),
  new Product(3, "Leite Desnatado", "Caixa de leite desnatado 1L", 6, 2, 50, "leite.jpg", 11),
  new Product(4, "Chocolate Meio Amargo", "Barra de chocolate 70% cacau", 12, 2, 40, "chocolate.jpg", 12),
  new Product(5, "Cereal Matinal", "Cereal matinal rico em fibras 300g", 15, 2, 60, "cereal.jpg", 13)
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

const successToast = 'Pedido criado com sucesso!';
const failedToast = 'Erro ao criar pedido!';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    BucketCardComponent,
    ModalComponent,
    HolderModalComponent,
    NgClass,
    NgxMaskDirective,
    FormsModule,
    NgIf,
    NoteModalComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent implements OnInit{
  @ViewChild('textModal') textModal!: HolderModalComponent;
  @ViewChild('noteModal') noteModal!: NoteModalComponent;
  isSmallScreen: boolean = window.innerWidth <= 1020;
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
  orderNote = "";

  prodId = 0;
  prodAmount = 1;
  prodName = '';
  prodType = 1;

  modalTitle!: string;
  modalBody!: string;
  modalType: number = 0;

  toastMessage = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private workDayService: WorkDayService
  ) {}

  ngOnInit(): void {
    //this.products = testProducts;
    //this.categories = testCategories;

    this.orderHolder = "";
    this.orderPhone = "";

    this.getAllProducts();
    this.getAllCategories();
    this.getTodayWorkDay();
  }

  increaseAmount(){
    if(this.prodType == 1)
      this.prodAmount = Math.round((this.prodAmount + 0.1) * 10) / 10;
    else
      this.prodAmount++;
  }

  decreaseAmount(){
    if(this.prodType == 1){
      if(this.prodAmount > 1)
        this.prodAmount = Math.round((this.prodAmount - 0.1) * 10) / 10;
    }
    else{
      if(this.prodAmount > 0.1)
        this.prodAmount--;
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
    //this.order.products.forEach(p => this.order.totalValue += p.amount * p.price);
    this.order.totalValue += this.lineItem.amount * this.lineItem.price;
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
        this.products = data.body || []
        this.isLoading = false;
      }
    });
  }

  getProductsByCategory(cat: Category){
    this.isLoading = true;
    
    this.categoryService.getProductsByCategoryId(cat.categoryId)
    .subscribe({
      next: (data) => {
        this.products = data.body || []
        this.isLoading = false;
      }
    });
  }

  getAllProductsByName(){
    this.isLoading = true;
    
    this.productService.getProductsByName(this.prodName)
    .subscribe({
      next: (data) => {
        this.products = data.body || []
        this.isLoading = false;
      }
    });
  }

  getAllCategories(){
    this.isLoading = true;
    
    this.categoryService.getCategories()
    .subscribe({
      next: (data) => {
        this.categories = data.body || []
        console.log(this.categories);
        this.isLoading = false;
      }
    });
  }

  createOrder(){
    if(this.order.products.length == 0)
      return;

    const localDate = new Date();
    const localISOString = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();

    this.order.orderDate = localISOString;
    this.order.orderStatus = 1;
    this.order.holder = this.orderHolder;
    this.order.note = this.orderPhone + ' : ' + this.orderNote;

    this.orderService.postOrder(this.order)
    .pipe(
      switchMap(() => {
        return this.productService.getProducts()
      })
    ).subscribe({
      next: (data) => {
        this.products = data.body || [];
        this.showToast(successToast);
      },
      error: (err) => {
        console.log(err);
        this.showToast(failedToast);
      }
    });

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

  getTodayWorkDay(){
    const todayDate = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');

    this.workDayService.getWorkDayByDate(todayDate)
    .subscribe({
      next: (res) => {
        this.orderNumber = res.body?.numberOfCanceledOrders! + res.body?.numberOfOrders!
      },
      error: (err) => {
        console.log(err);
      }
    })
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 1020;
    //console.log(this.isSmallScreen);
  }

  catchEvent(actionType: number){
    if(actionType == 1){
      if(this.modalType == 1){
        this.openNoteModel();
        // after anwser note modal the order is created
        // note modal event is catched by 'catchNoteDescripitonEvent()' method and 
        // 'createOrder()' method is called
      }
      else
        this.cancelOrder();
    }
  }

  catchNoteDescripitonEvent(note: string){
    this.setNote(note);
    this.createOrder();
  }

  openHolderModel(){
    this.textModal.openModal();
  }

  openNoteModel(){
    this.noteModal.orderNote = '';
    this.noteModal.openModal();
  }

  setHolder(name: string){
    this.orderHolder = name;
  }

  setNote(note: string){
    this.orderNote = note;
  }

  showToast(text: string){
    this.toastMessage = text

    const toastElement = document.getElementById('toast');
    if(toastElement){
        const toast = new Toast(toastElement);
        toast.show();
    }
  }
}
