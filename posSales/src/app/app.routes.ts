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
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { UsersListComponent } from './pages/users-list/users-list.component';

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
        path: 'configUsuario',
        title: 'Configuração de Usuario',
        component: UserInfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'configUsuario/:id',
        title: 'Configuração de Usuario',
        component: UserInfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'criarUsuario',
        title: 'Criação de Usuário',
        component: CreateUserComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'listaUsuarios',
        title: 'Listagem de Usuarios',
        component: UsersListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        title: 'LogIn',
        component: LoginComponent
    }
];