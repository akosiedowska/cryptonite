import { Routes } from '@angular/router';
import { CurrenciesComponent } from '../pages/currencies/currencies.component';
import { AboutComponent } from '../pages/about/about.component';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../core/components/layout/layout.component';
import { HomeComponent } from '../pages/home/home.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { isLoggedGuard } from '../is-logged.guard';
import { UnauthorizedComponent } from '../pages/unauthorized/unauthorized.component';

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
        title: "Dashboard page",
        canActivate: [isLoggedGuard]
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    }
    //     ]
    // },
];
