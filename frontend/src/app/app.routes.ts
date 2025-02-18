import { Routes } from '@angular/router';
import { CurrenciesComponent } from '../features/currencies/currencies.component';
import { AboutComponent } from '../features/about/about.component';
import { LoginComponent } from '../features/login/login.component';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { HomeComponent } from '../features/home/home.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: LayoutComponent,
    //     title: "Home page",
    //     children: [
    {
        path: '',
        component: HomeComponent,
        title: "Home page"
    },
    {
        path: 'currencies',
        component: CurrenciesComponent,
        title: "Currencies page"
    },
    {
        path: 'about',
        component: AboutComponent,
        title: "About page"
    },
    {
        path: 'login',
        component: LoginComponent,
        title: "Login page"
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: "Dashboard page"
    }
    //     ]
    // },
];
