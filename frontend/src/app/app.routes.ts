import { Routes } from '@angular/router';
import { CurrenciesComponent } from './pages/currencies/currencies.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
// import { LayoutComponent } from './core/components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/dashboard/pages/profile/profile.component';
import { TransactionsComponent } from './pages/dashboard/pages/transactions/transactions.component';
import { FavouritesComponent } from './pages/dashboard/pages/favourites/favourites.component';
import { WalletComponent } from './pages/dashboard/pages/wallet/wallet.component';

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
        title: "Log in page"
    },
    {
        path: 'signup',
        component: SignupComponent,
        title: "Sign up page"
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: "Dashboard page",
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'wallet',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'transactions',
                component: TransactionsComponent
            },
            {
                path: 'favourites',
                component: FavouritesComponent
            },
            {
                path: 'wallet',
                component: WalletComponent
            }
        ]
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    }
    //     ]
    // },
];
