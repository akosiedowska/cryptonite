import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { CurrentUserService } from './core/services/current-user.service';
import { Store } from '@ngrx/store';
import { CoinsLoadActions } from './core/store/coins/coins.actions';
import { loadFavourites, setFavourites } from './core/store/favourites/favourites.actions';
import { selectCurrentUser } from './core/store/user/user.selector';
import { selectCoins } from './core/store/coins/coins.selectors';
import { selectFavouriteCoins } from './core/store/favouriteCoins/favouriteCoins.selectors';
import { FavouritesService } from './core/services/favourites.service';

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

  constructor(private currentUserService: CurrentUserService, private favouritesService: FavouritesService) { }

  ngOnInit() {
    this.store.dispatch(CoinsLoadActions.loadCoins())
    this.currentUserService.initializeCurrentUser()
    this.favouritesService.initializeFavourites()

    this.store.select(selectCoins).subscribe(coins => console.log('coins', coins))
    this.store.subscribe(state => console.log('coins state', state))
  }

}
