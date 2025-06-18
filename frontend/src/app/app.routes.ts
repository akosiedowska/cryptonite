import { Routes } from '@angular/router'
import { AboutComponent } from './pages/about/about.component'
// import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard'
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component'

export const routes: Routes = [
  // {
  //     path: '',
  //     component: LayoutComponent,
  //     title: "Home page",
  //     children: [
  {
    path: '',
    component: AboutComponent,
    // loadComponent: () =>
    //   import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Home page',
  },
  {
    path: 'currencies',
    // component: CurrenciesComponent,
    loadComponent: () =>
      import('./pages/currencies/currencies.component').then(
        m => m.CurrenciesComponent
      ),
    title: 'Currencies page',
  },
  {
    path: 'currencies/:id',
    // component: CurrencyDetailsComponent,
    loadComponent: () =>
      import('./pages/currency-details/currency-details.component').then(
        m => m.CurrencyDetailsComponent
      ),
    title: 'Currency details page',
  },
  // {
  //     path: 'about',
  //     component: AboutComponent,
  //     title: "About page"
  // },
  {
    path: 'login',
    // component: LoginComponent,
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Log in page',
  },
  {
    path: 'signup',
    // component: SignupComponent,
    loadComponent: () =>
      import('./pages/signup/signup.component').then(m => m.SignupComponent),
    title: 'Sign up page',
  },
  {
    path: 'dashboard',
    // component: DashboardComponent,
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    title: 'Dashboard page',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'wallet',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/dashboard/pages/profile/profile.component').then(
            m => m.ProfileComponent
          ),
        // component: ProfileComponent,
      },
      {
        path: 'transactions',
        // component: TransactionsComponent,
        loadComponent: () =>
          import(
            './pages/dashboard/pages/transactions/transactions.component'
          ).then(m => m.TransactionsComponent),
      },
      {
        path: 'favourites',
        // component: FavouritesComponent,
        loadComponent: () =>
          import(
            './pages/dashboard/pages/favourites/favourites.component'
          ).then(m => m.FavouritesComponent),
      },
      {
        path: 'wallet',
        // component: WalletComponent,
        loadComponent: () =>
          import('./pages/dashboard/pages/wallet/wallet.component').then(
            m => m.WalletComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/notifications/notifications.component'
          ).then(m => m.NotificationsComponent),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/dashboard/pages/alerts/alerts.component').then(
            m => m.AlertsComponent
          ),
      },
    ],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  //     ]
  // },
]
