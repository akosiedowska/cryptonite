import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { CoinsService } from '../../core/services/coins.service';
import { formatNumber } from './helpers';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { debounceTime, interval, Subject, Subscription } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EmptyComponent } from '../../shared/components/empty/empty.component';
import { SortComponent } from './components/sort/sort.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { Store } from '@ngrx/store';
import { selectCoins, selectErrorMessage, selectIsLoading } from '../../core/store/coins/coins.selectors';
import { CoinsLoadActions, CoinsParamsActions } from '../../core/store/coins/coins.actions';

@Component({
  selector: 'app-currencies',
  imports: [CommonModule, MatTableModule, ButtonComponent, MatIconModule, MatPaginatorModule, MatInputModule, FormsModule, LoaderComponent, EmptyComponent, SortComponent, ErrorComponent],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent {
  store = inject(Store)
  coins$ = this.store.select(selectCoins)
  isLoading$ = this.store.select(selectIsLoading)
  errorMessage$ = this.store.select(selectErrorMessage)
  pagination = computed(() => this.coinService.getPagination())
  displayedColumns = ['name', 'price', 'change', 'change-7d', 'total-volume', 'market-cap', 'actions']
  formatNumber = formatNumber
  search = ''
  private searchSubject = new Subject<string>()
  private subscription: Subscription = new Subscription()

  constructor(public coinService: CoinsService) {
    this.searchSubject.pipe(debounceTime(500)).subscribe(value => {
      this.store.dispatch(CoinsParamsActions.setQuery({ query: value }))
      this.store.dispatch(CoinsParamsActions.setPage({ page: 1 }))
    })
  }

  ngOnInit() {
    // refreshing currencies data - table, change if needed to 10 000
    this.subscription = interval(1000000)
      .subscribe(() => this.store.dispatch(CoinsLoadActions.loadCoins()))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  onInputChange() {
    this.searchSubject.next(this.search)
  }

  changePage(event: PageEvent) {
    this.store.dispatch(CoinsParamsActions.setPage({ page: event.pageIndex + 1 }))
  }

  changeOrder(order: string) {
    this.store.dispatch(CoinsParamsActions.setOrder({ order }))
  }

  clearSearch() {
    this.search = '';
    this.searchSubject.next(this.search)
    this.store.dispatch(CoinsParamsActions.setQuery({ query: '' }))
  }
}
