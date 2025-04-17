import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular'
import { interval, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { selectCoins } from '../../core/store/coins/coins.selectors';
import { Coin } from '../../core/store/coins/coins.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FavouritesService } from '../../core/services/favourites.service';
import { selectFavourites } from '../../core/store/favourites/favourites.selector';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TradeModalService } from '../../core/services/trade-modal.service';

interface CoinData {
  prices: SingleData[]
}

type SingleData = [number, number]

@Component({
  selector: 'app-currency-details',
  imports: [HighchartsChartModule, ReactiveFormsModule, MatSelectModule, CommonModule, MatIconModule, ButtonComponent],
  templateUrl: './currency-details.component.html',
  styleUrl: './currency-details.component.scss'
})
export class CurrencyDetailsComponent {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)
  store = inject(Store)
  coins$ = this.store.select(selectCoins)
  favourites$ = this.store.select(selectFavourites)
  coinId = this.route.snapshot.paramMap.get('id') || ''
  coinPrices = signal<SingleData[]>([])
  filteredCoin$: Observable<Coin | undefined> = new Observable()
  private destroyRef = inject(DestroyRef)
  private daysValue = 1

  chartForm = new FormGroup({
    days: new FormControl(1)
  })

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options = {
    title: {
      text: `${this.coinId} price - last 24 hours`
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      }
    },
    yAxis: {
      title: {
        text: 'Price (EUR)'
      }
    },
    series: [{
      type: 'line',
      name: 'Coin Price',
      data: [],
      color: '#10b981'
    }],
    time: {
      timezoneOffset: new Date().getTimezoneOffset()
    }
  }

  constructor(private favouriteService: FavouritesService, private tradeModalService: TradeModalService) {
    this.chartForm.get('days')?.valueChanges.subscribe(value => {
      this.daysValue = value ?? 1
      this.fetchCoinData()
    })
  }

  ngOnInit() {
    this.fetchCoinData()
    interval(40_000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchCoinData())
    this.filteredCoin$ = this.coins$.pipe(map(coins => coins.find(coin => coin.id === this.coinId)))
  }

  fetchCoinData() {
    return this.http.get<CoinData>(`https://api.coingecko.com/api/v3/coins/${this.coinId}/market_chart?vs_currency=eur&days=${this.daysValue}&x_cg_demo_api_key=${environment.apiKey}`)
      .subscribe(
        data => {
          this.coinPrices.set(data.prices)
          this.chartOptions = {
            ...this.chartOptions,
            title: {
              text: `${this.coinId} price - last ${this.daysValue === 1 ? '24 hours' : this.daysValue === 30 ? '30 days' : '365 days'}`
            },
            series: [{
              type: 'line',
              name: 'Coin Price',
              data: this.coinPrices()
            }]
          }
        }
      )
  }

  toggleFavourite(currencyId: string) {
    this.favouriteService.toggleFavourite(currencyId);
  }

  openTradeModal(coin: Coin) {
    this.tradeModalService.openModal(coin)
  }
}
