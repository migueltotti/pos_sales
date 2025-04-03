import { Routes } from '@angular/router';
import { NavBarComponent } from './components/navBar/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateOrderComponent } from './pages/create-order/create-order.component';
import { DailyStockComponent } from './pages/daily-stock/daily-stock.component';
import { ReportComponent } from './pages/report/report.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '../services/auth.guard';
import { WorkDayGuard } from '../services/work-day.guard';

export const routes: Routes = [
    {
        path: 'cadastroPedidos',
        title: 'POS',
        component: CreateOrderComponent,
        canActivate: [AuthGuard, WorkDayGuard]
    },
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        title: 'Home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'pedidos',
        title: 'Pedidos',
        component: OrdersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'configEstoque',
        title: 'Configuração de Estoque',
        component: DailyStockComponent,
        canActivate: [AuthGuard, WorkDayGuard]
    },
    {
        path: 'relatorio',
        title: 'Relatório Diário',
        component: ReportComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        title: 'LogIn',
        component: LoginComponent
    }
];