import { Component, inject, Input } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Coin } from '../../../core/store/coins/coins.model';
import { Store } from '@ngrx/store';
import { selectErrorMessage, selectOrder } from '../../../core/store/coins/coins.selectors';
import { selectCurrentUser } from '../../../core/store/user/user.selector';
import { selectFavourites } from '../../../core/store/favourites/favourites.selector';
import { formatNumber } from '../../../helpers';
import { CoinsService } from '../../../core/services/coins.service';
import { ErrorComponent } from '../error/error.component';
import { SortComponent } from './components/sort.component';
import { EmptyComponent } from '../empty/empty.component';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FavouritesService } from '../../../core/services/favourites.service';
import { CoinsParamsActions } from '../../../core/store/coins/coins.actions';
import { FavouriteCoinsParamsActions } from '../../../core/store/favouriteCoins/favouriteCoins.actions';
import { selectFavouriteCoinsOrder } from '../../../core/store/favouriteCoins/favouriteCoins.selectors';
import { ModalService } from '../../../core/services/modal.service';
import { Router } from '@angular/router';
import { TradeModalComponent } from '../trade-modal/trade-modal.component';

@Component({
  selector: 'app-coins-table',
  imports: [CommonModule, MatTableModule, ButtonComponent, MatIconModule, MatPaginatorModule, MatInputModule, FormsModule, LoaderComponent, EmptyComponent, SortComponent, ErrorComponent],
  templateUrl: './coins-table.component.html',
  styleUrl: './coins-table.component.scss'
})
export class CoinsTableComponent {
  @Input() dataSource: Coin[] = []
  @Input() showPagination = false
  @Input() isFavouritesTable: boolean = false
  @Input() page: number | null = 1
  @Input() perPage: number = 15
  @Input() totalResults: number | null = 0
  @Input() isLoading: boolean = false
  store = inject(Store)
  errorMessage$ = this.store.select(selectErrorMessage)
  user$ = this.store.select(selectCurrentUser)
  favourites$ = this.store.select(selectFavourites)
  coinsOrder$ = this.store.select(selectOrder)
  favouriteCoinsOrder$ = this.store.select(selectFavouriteCoinsOrder)
  displayedColumns = ['favourites', 'name', 'price', 'change', 'change-7d', 'total-volume', 'market-cap', 'actions']
  formatNumber = formatNumber
  subscription: Subscription = new Subscription()

  constructor(
    public coinService: CoinsService,
    private favouriteService: FavouritesService,
    private modalService: ModalService,
    private router: Router
  ) {
    this.user$.pipe(take(1)).subscribe(user => {
      if (!user) this.displayedColumns.shift()
    })
  }

  toggleFavourite(currencyId: string, event: MouseEvent) {
    event.stopPropagation()
    this.favouriteService.toggleFavourite(currencyId);
  }

  openTradeModal(coin: Coin, event: MouseEvent) {
    event.stopPropagation()
    this.modalService.openModal(TradeModalComponent, coin)
  }

  changePage(event: PageEvent) {
    const action = this.isFavouritesTable
      ? FavouriteCoinsParamsActions.setPage({ page: event.pageIndex + 1 })
      : CoinsParamsActions.setPage({ page: event.pageIndex + 1 })

    this.store.dispatch(action)
  }

  goToDetailsPage(coin: Coin) {
    this.router.navigate(['currencies', coin.id])
  }

}
