import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import Collapse from 'bootstrap/js/dist/collapse';
import { Category } from '../../../entities/category';
import { Product } from '../../../entities/product';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { catchError, of, switchMap } from 'rxjs';
import Toast from 'bootstrap/js/dist/toast';

const testCategories = [
  new Category(1, 'Bovinos', 'bovinos.jpg'),
  new Category(2, 'Suinos', 'bovinos.jpg'),
  new Category(3, 'Aves', 'bovinos.jpg'),
  new Category(4, 'Diversos', 'bovinos.jpg'),
]

const testProducts: Product[] = [
  // Carnes Bovinas (ID 1)
  new Product(1, "Picanha", "Picanha bovina premium", 89.99, 1, 20, "picanha.jpg", 1),
  new Product(2, "Alcatra", "Alcatra macia e suculenta", 59.99, 1, 15, "alcatra.jpg", 1),
  new Product(3, "Filé Mignon", "Filé mignon de alta qualidade", 119.99, 1, 10, "file_mignon.jpg", 1),
  new Product(4, "Costela", "Costela bovina para churrasco", 39.99, 1, 25, "costela.jpg", 1),
  new Product(5, "Maminha", "Maminha suculenta", 49.99, 1, 18, "maminha.jpg", 1),

  // Carnes Suínas (ID 2)
  new Product(6, "Pernil Suíno", "Pernil suculento", 29.99, 1, 30, "pernil.jpg", 2),
  new Product(7, "Costelinha Suína", "Costelinha para assados", 34.99, 1, 22, "costelinha.jpg", 2),
  new Product(8, "Lombo Suíno", "Lombo suíno tenro", 39.99, 1, 25, "lombo.jpg", 2),

  // Carnes de Aves (ID 3)
  new Product(9, "Peito de Frango", "Peito de frango sem osso", 22.99, 1, 50, "peito_frango.jpg", 3),
  new Product(10, "Coxa e Sobrecoxa", "Coxa e sobrecoxa de frango", 18.99, 1, 40, "coxa_sobrecoxa.jpg", 3),

  // Diversos (ID 4)
  new Product(11, "Linguiça Toscana", "Linguiça toscana artesanal", 24.99, 1, 35, "linguica.jpg", 4),
  new Product(12, "Hambúrguer Artesanal", "Hambúrguer de carne 100% bovina", 19.99, 1, 28, "hamburguer.jpg", 4),
  new Product(13, "Kafta", "Espetinho de carne temperada", 14.99, 1, 20, "kafta.jpg", 4)
];

const successCreateToast = 'Produto criado com sucesso';
const failedCreateToast = 'Erro ao criar produto!';

const successUpdateToast = 'Produto alterado com sucesso';
const faileUpdateToast = 'Erro ao alterar produto!';

const successDeleteToast = 'Produto removido com sucesso';
const failedDeleteToast = 'Erro ao remover produto!';

@Component({
  selector: 'app-daily-stock',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    NgxMaskDirective,
    ModalComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './daily-stock.component.html',
  styleUrl: './daily-stock.component.scss'
})
export class DailyStockComponent implements AfterViewInit, OnInit{
  collapses: { id: string; collapse: Collapse; isOpen: boolean }[] = [];

  isLoadind = false;
  savedProduct = false;

  categories: Category[] = [];
  products: Product[] = [];
  productsByCategory: Map<number, Product[]> = new Map()

  prod!: Product;
  prodId = 0;
  prodName = '';
  prodPrice!: number | undefined;
  prodAmount!: number | undefined;
  excludeProdId = 0;

  modalBody = '';
  modalTitle = '';

  toastMessage = ''

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ){}

  ngOnInit(): void {
    //this.categories = testCategories;
    //this.products = testProducts;

    this.getCategoryAndProducts();
  }

  getCategoryAndProducts(){
    this.categoryService.getCategories()
    .pipe(
      switchMap((catData) => {
        this.categories = catData.body || []
        return this.productService.getProducts();
      })
    ).subscribe({
      next: (ProdData) => {
        this.products = ProdData.body || []
        this.filterProducts();
        this.setCollapses();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  selectProduct(prod: Product){
    this.prod = prod;
    this.prodName = this.prodName == prod.name ? '' : prod.name;
    this.prodPrice = this.prodPrice == prod.value ? undefined : prod.value;
    this.prodAmount = this.prodAmount == prod.stockQuantity ? undefined : prod.stockQuantity;
    this.prodId = this.prodId == prod.productId ? 0 : prod.productId;
  }

  addProduct(catId: number){
    //var copyProducts = this.products;
    //var lastId = copyProducts.sort().splice(this.products.length - 1, 1).shift()?.productId;

    //if(lastId != undefined){
    var newProd = new Product(0, 'Novo Produto', '', 0.00, 2, 0, '', catId);
    this.productsByCategory.get(catId)?.push(newProd);
    this.products.push(newProd);

    this.prodName = '';
    this.prodPrice = undefined;
    this.prodAmount = undefined;
    this.prodId = 0;

    //this.createProduct(this.prod)
    //}
  }

  updateProdValues(){
    if(this.prodName == '' || this.prodPrice == undefined || this.prodAmount == undefined)
      return;

    this.prod.name = this.prodName;
    this.prod.description = this.prodName + this.prodPrice;
    this.prod.imageUrl = this.prodName + '.jpg';
    this.prod.stockQuantity = this.prodAmount;
    this.prod.value = this.prodPrice;

    if(this.prod.productId == 0){
      this.createProduct(this.prod);
    }
    else{
      this.saveProduct(this.prodId, this.prod);
    }
  }

  excludeProduct(prodId: number){
    var prod = this.products.find(p => p.productId == prodId)!;

    //this.products = this.products.filter(p => p.productId != prod?.productId);
    //this.productsByCategory.set(prod?.categoryId!, this.productsByCategory.get(prod?.categoryId!)?.filter(p => p.productId != prod?.productId)!);
  
    this.removeProduct(prodId);

    // depois clicar no botao de salvar alteraçoes no estoque

    // ouuuu eu excluo diretamente do back e busco novamente os produtos -> vou implementar
  }

  filterProducts(){
    if(this.productsByCategory.size == 0){
      this.categories.forEach(c => {
        this.productsByCategory.set(c.categoryId, []);
      })
    }
    else{
      this.productsByCategory.forEach((v, k) => 
        this.productsByCategory.set(k, []))
    }
    
    this.products.forEach(p => {
      this.productsByCategory.get(p.categoryId)?.push(p)
    });
  }

  createProduct(prod: Product){
    var success = false;
    this.isLoadind = true;
    this.productService.createProduct(prod)
    .pipe(
      catchError((err) => {
        this.isLoadind = false;
        console.log(err);
        // Continua a stream para ainda buscar os produtos
        return of({ ok: false });
      }),
      switchMap((data) => {
        // Se falhou na criação, ainda assim busca os produtos
        return this.productService.getProducts();
      })
    )
    .subscribe({
      next: (data) => {
        if(data.ok){
          this.products = data.body || [];
          this.isLoadind = false;
          this.filterProducts();
          success = true;
        }
      },
      error: (err) => {
        this.isLoadind = false;
        this.showFailToast(failedCreateToast);
        console.log(err);
      }
    });

    if(success){
      this.showSuccessToast(successCreateToast);
    }
    else{
      this.showFailToast(failedCreateToast);
    }
  }

  saveProduct(prodId: number, product: Product){
    var success = false;
    this.isLoadind = true;
    this.productService.updateProduct(prodId, product)
    .pipe(
      catchError((err) => {
        this.isLoadind = false;
        console.log(err);
        // Continua a stream para ainda buscar os produtos
        return of({ ok: false });
      }),
      switchMap((data) => {
        // Se falhou na criação, ainda assim busca os produtos
        return this.productService.getProducts();
      })
    )
    .subscribe({
      next: (data) => {
        if(data.ok){
          this.products = data.body || [];
          this.isLoadind = false;
          this.filterProducts();
          success = true;
        }
      },
      error: (err) => {
        this.isLoadind = false;
        this.showFailToast(faileUpdateToast);
        console.log(err);
      }
    });

    if(success){
      this.showSuccessToast(successCreateToast);
    }
    else{
      this.showFailToast(failedCreateToast);
    }
  }

  removeProduct(prodId: number){
    this.isLoadind = true;
    this.productService.deleteProduct(prodId)
    .pipe(
      switchMap((data) => {
        return this.productService.getProducts();
      })
    )
    .subscribe({
      next: (data) => {
        if(data.ok){
          this.products = data.body || [];
          this.isLoadind = false;
          this.filterProducts();
          this.showSuccessToast(successDeleteToast);
        }
      },
      error: (err) => {
        this.isLoadind = false;
        this.showFailToast(failedDeleteToast);
        console.log(err);
      }
    });
  }

  triggerModal(prodId: number){
    this.modalTitle = 'Excluir Produto';
    this.modalBody = 'Tem certeza que quer excluir esse produto?';
    this.excludeProdId = prodId;
  }

  catchEvent(actionType: number){
    if(actionType == 1){
      this.excludeProduct(this.excludeProdId);
    }
  }

  ngAfterViewInit(): void {
    this.setCollapses();
  }

  setCollapses(){
    const elements = document.querySelectorAll('.collapse');
    elements.forEach((element) => {
      const id = element.id;
      this.collapses.push({ id, collapse: new Collapse(element, { toggle: false }), isOpen: false });
    });
  }

  toggleCollapse(id: string): void {
    const collapseItem = this.collapses.find(c => c.id === id);
    if (collapseItem) {
      collapseItem.isOpen = !collapseItem.isOpen;
      collapseItem.collapse.toggle();
    }
  }

  isCollapseOpen(id: string): boolean {
    return this.collapses.find(c => c.id === id)?.isOpen ?? false;
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
