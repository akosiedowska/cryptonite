import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { CoinsService } from '../../core/services/coins.service';
import { formatNumber } from './helpers';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EmptyComponent } from '../../shared/components/empty/empty.component';
import { SortComponent } from './components/sort/sort.component';
import { ErrorComponent } from '../../shared/components/error/error.component';

@Component({
  selector: 'app-currencies',
  imports: [CommonModule, MatTableModule, ButtonComponent, MatIconModule, MatPaginatorModule, MatInputModule, FormsModule, LoaderComponent, EmptyComponent, SortComponent, ErrorComponent],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent {
  coins = computed(() => this.coinService.getCoins())
  pagination = computed(() => this.coinService.getPagination())
  displayedColumns = ['name', 'price', 'change', 'change-7d', 'total-volume', 'market-cap', 'actions']
  formatNumber = formatNumber
  search = ''
  private searchSubject = new Subject<string>()

  constructor(public coinService: CoinsService) {
    this.searchSubject.pipe(debounceTime(500)).subscribe(value => {
      if (value.length > 1) {
        this.coinService.setQuery(value)
        this.coinService.fetchCoins()
      }
    })
  }

  onInputChange() {
    this.searchSubject.next(this.search)
  }

  changePage(event: PageEvent) {
    this.coinService.setPage(event.pageIndex + 1)
  }

  changeOrder(order: string) {
    this.coinService.setOrder(order)
  }

  clearSearch() {
    this.search = '';
    this.searchSubject.next(this.search)
    this.coinService.setQuery('')
    this.coinService.fetchCoins()
  }
}
