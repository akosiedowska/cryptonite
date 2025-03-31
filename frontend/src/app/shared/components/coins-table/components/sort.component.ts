import { Component, inject, Input } from '@angular/core';
import { CoinsService } from '../../../../core/services/coins.service';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectOrder } from '../../../../core/store/coins/coins.selectors';
import { Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CoinsParamsActions } from '../../../../core/store/coins/coins.actions';
import { FavouriteCoinsParamsActions } from '../../../../core/store/favouriteCoins/favouriteCoins.actions';
import { selectFavouriteCoinsOrder } from '../../../../core/store/favouriteCoins/favouriteCoins.selectors';

@Component({
  selector: 'app-sort',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent {
  @Input() order = ''
  @Input() isFavouriteTable: boolean = false
  store = inject(Store)
  currentOrder$: Observable<string> = new Observable()

  constructor(public coinService: CoinsService) {
  }

  ngOnInit() {
    this.currentOrder$ = this.store.select(this.isFavouriteTable ? selectFavouriteCoinsOrder : selectOrder)

  }

  toggleOrder(order: string) {
    this.currentOrder$.pipe(take(1)).subscribe(currentOrder => {
      if (currentOrder === order + '_desc') {
        this.store.dispatch((this.getStoreAction()).setOrder({ order: order + '_asc' }))
      } else {
        this.store.dispatch((this.getStoreAction()).setOrder({ order: order + '_desc' }))
      }

    })
  }

  getSortIcon(order: string): string {
    let icon = 'arrow_downward'
    this.currentOrder$.pipe(take(1)).subscribe(currentOrder => {
      if (currentOrder.startsWith(order)) {
        icon = currentOrder.endsWith('_asc') ? 'arrow_upward' : 'arrow_downward'
      }
    })
    return icon
  }

  private getStoreAction() {
    console.log('fav table', this.isFavouriteTable)
    return this.isFavouriteTable
      ? FavouriteCoinsParamsActions
      : CoinsParamsActions
  }

}
