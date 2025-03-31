import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoinsTableComponent } from '../../../../shared/components/coins-table/coins-table.component';
import { FavouriteCoinsLoadActions, FavouriteCoinsParamsActions } from '../../../../core/store/favouriteCoins/favouriteCoins.actions';
import { selectFavouriteCoins, selectFavouriteCoinsPage, selectFavouritesErrorMessage, selectFavouritesIsLoading, selectFavouritesTotalResults } from '../../../../core/store/favouriteCoins/favouriteCoins.selectors';

@Component({
  selector: 'app-favourites',
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, CoinsTableComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent {
  private store = inject(Store)
  favouriteCoins$ = this.store.select(selectFavouriteCoins)
  page$ = this.store.select(selectFavouriteCoinsPage)
  totalResults$ = this.store.select(selectFavouritesTotalResults)
  isLoading$ = this.store.select(selectFavouritesIsLoading)
  errorMessage$ = this.store.select(selectFavouritesErrorMessage)
  private subscription: Subscription = new Subscription()

  ngOnInit() {
    this.store.dispatch(FavouriteCoinsLoadActions.loadFavouriteCoins())
    this.store.dispatch(FavouriteCoinsParamsActions.setPage({ page: 1 }))
    this.subscription = interval(1000000)
      .subscribe(() => this.store.dispatch(FavouriteCoinsLoadActions.loadFavouriteCoins()))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
