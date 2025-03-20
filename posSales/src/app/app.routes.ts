import { Routes } from '@angular/router';
import { NavBarComponent } from './components/navBar/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateOrderComponent } from './pages/create-order/create-order.component';
import { DailyStockComponent } from './pages/daily-stock/daily-stock.component';

export const routes: Routes = [
    {
        path: 'pos',
        title: 'POS',
        component: CreateOrderComponent
    },
    {
        path: '',
        title: 'POS',
        component: CreateOrderComponent
    },
    {
        path: 'orders',
        title: 'Orders',
        component: OrdersComponent
    },
    {
        path: 'dailyStock',
        title: 'DailyStock',
        component: DailyStockComponent
    },
    {
        path: 'login',
        title: 'LogIn',
        component: LoginComponent
    }
];
