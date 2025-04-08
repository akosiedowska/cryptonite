import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorProvider } from './core/interceptors/auth.interceptor';
import { provideEffects } from '@ngrx/effects';
import { CoinsEffects } from './core/store/coins/coins.effects';
import { provideStore } from '@ngrx/store';
import { coinsReducer } from './core/store/coins/coins.reducer';
import { userReducer } from './core/store/user/user.reducer';
import { FavouritesEffects } from './core/store/favourites/favourites.effects';
import { favouritesReducer } from './core/store/favourites/favourites.reducer';
import { favouriteCoinsReducer } from './core/store/favouriteCoins/favouriteCoins.reducer';
import { FavouriteCoinsEffect } from './core/store/favouriteCoins/favouriteCoins.effect';
import { walletReducer } from './core/store/wallet/wallet.reducer';
import { WalletEffects } from './core/store/wallet/wallet.effects';
import { transactionsReducer } from './core/store/transactions/transactions.reducer';
import { TransactionsEffects } from './core/store/transactions/transactions.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    AuthInterceptorProvider,
    provideStore({
      coins: coinsReducer,
      user: userReducer,
      favourites: favouritesReducer,
      favouriteCoins: favouriteCoinsReducer,
      wallet: walletReducer,
      transactions: transactionsReducer
    }),
    provideEffects(CoinsEffects, FavouritesEffects, FavouriteCoinsEffect, WalletEffects, TransactionsEffects),
  ]
}
