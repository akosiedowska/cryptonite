import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { CoinsService } from '../../core/services/coins.service'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { debounceTime, interval, Subject, Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import {
  selectCoins,
  selectPage,
  selectPerPage,
  selectTotalResults,
} from '../../core/store/coins/coins.selectors'
import {
  CoinsLoadActions,
  CoinsParamsActions,
} from '../../core/store/coins/coins.actions'
import { CoinsTableComponent } from '../../shared/components/coins-table/coins-table.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-currencies',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    CoinsTableComponent,
  ],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss',
})
export class CurrenciesComponent implements OnInit, OnDestroy {
  store = inject(Store)
  coins$ = this.store.select(selectCoins)
  page$ = this.store.select(selectPage)
  perPage$ = this.store.select(selectPerPage)
  totalResults$ = this.store.select(selectTotalResults)
  search = ''
  private searchSubject = new Subject<string>()
  private subscription: Subscription = new Subscription()

  constructor(public coinService: CoinsService) {
    this.searchSubject
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(value => {
        this.store.dispatch(CoinsParamsActions.setQuery({ query: value }))
        this.store.dispatch(CoinsParamsActions.setPage({ page: 1 }))
      })
  }

  ngOnInit() {
    this.store.dispatch(CoinsParamsActions.setPage({ page: 1 }))
    this.subscription = interval(10_000).subscribe(() =>
      this.store.dispatch(CoinsLoadActions.loadCoins())
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  onInputChange() {
    this.searchSubject.next(this.search)
  }

  clearSearch() {
    this.search = ''
    this.searchSubject.next(this.search)
    this.store.dispatch(CoinsParamsActions.setQuery({ query: '' }))
  }
}
