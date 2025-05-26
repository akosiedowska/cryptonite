import { Component, inject, Input, Signal } from '@angular/core'
import { CoinsService } from '../../../../core/services/coins.service'
import { MatIconModule } from '@angular/material/icon'
import { Store } from '@ngrx/store'
import { selectOrder } from '../../../../core/store/coins/coins.selectors'
import { CommonModule } from '@angular/common'
import { CoinsParamsActions } from '../../../../core/store/coins/coins.actions'
import { FavouriteCoinsParamsActions } from '../../../../core/store/favouriteCoins/favouriteCoins.actions'
import { selectFavouriteCoinsOrder } from '../../../../core/store/favouriteCoins/favouriteCoins.selectors'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-sort',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss',
})
export class SortComponent {
  @Input() order = ''
  @Input() isFavouriteTable = false
  store = inject(Store)
  currentOrder!: Signal<string>

  constructor(public coinService: CoinsService) {
    const orderSelector = this.isFavouriteTable
      ? selectFavouriteCoinsOrder
      : selectOrder
    this.currentOrder = toSignal(this.store.select(orderSelector), {
      initialValue: '',
    })
  }

  toggleOrder(order: string) {
    const newOrder =
      this.currentOrder() === `${order}_desc` ? `${order}_asc` : `${order}_desc`

    this.store.dispatch(this.getStoreAction().setOrder({ order: newOrder }))
  }

  getSortIcon(order: string): string {
    if (this.currentOrder().startsWith(order)) {
      return this.currentOrder().endsWith('_asc')
        ? 'arrow_upward'
        : 'arrow_downward'
    }

    return 'arrow_downward'
  }

  private getStoreAction() {
    return this.isFavouriteTable
      ? FavouriteCoinsParamsActions
      : CoinsParamsActions
  }
}
