import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { CurrentUserService } from './core/services/current-user.service';
import { Store } from '@ngrx/store';
import { CoinsLoadActions } from './core/store/coins/coins.actions';
import { selectCurrentUser } from './core/store/user/user.selector';
import { selectCoins } from './core/store/coins/coins.selectors';
import { FavouritesService } from './core/services/favourites.service';
import { loadWallet } from './core/store/wallet/wallet.actions';
import { loadTransactions } from './core/store/transactions/transactions.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cryptonite'
  private store = inject(Store)
  user$ = this.store.select(selectCurrentUser)
  destroyRef = inject(DestroyRef)

  constructor(private currentUserService: CurrentUserService, private favouritesService: FavouritesService) { }

  ngOnInit() {
    this.store.dispatch(CoinsLoadActions.loadCoins())
    this.currentUserService.initializeCurrentUser()
    this.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user && user.id) {
        this.favouritesService.initializeFavourites()
        this.store.dispatch(loadWallet({ userId: user.id }))
        this.store.dispatch(loadTransactions({ userId: user.id }))
      }
    })

    this.store.select(selectCoins).subscribe(coins => console.log('coins', coins))
    this.store.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(state => console.log('coins state', state))
  }

}
