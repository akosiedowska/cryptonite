import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CurrenciesComponent } from '../features/currencies/currencies.component';
import { AboutComponent } from '../features/about/about.component';
import { LoginComponent } from '../features/login/login.component';
import { LayoutComponent } from '../core/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        title: "Home page",
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
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
            }
        ]
    },
];
