import { HttpClient } from '@angular/common/http'
import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { environment } from '../../../environments/environment'
import * as Highcharts from 'highcharts'
import { HighchartsChartModule } from 'highcharts-angular'
import { interval, map, Observable, startWith } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { Store } from '@ngrx/store'
import { Coin } from '../../core/store/coins/coins.model'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { FavouritesService } from '../../core/services/favourites.service'
import { selectFavourites } from '../../core/store/favourites/favourites.selector'
import { ButtonComponent } from '../../shared/components/button/button.component'
import { ModalService } from '../../core/services/modal.service'
import { formatNumber } from '../../helpers'
import { Currency, CURRENCY_SYMBOLS } from '../../constants'
import { selectCurrentUser } from '../../core/store/user/user.selector'
import { TradeModalComponent } from '../../shared/components/trade-modal/trade-modal.component'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ChartComponent } from './components/chart/chart.component'

interface CoinData {
  prices: SingleData[]
}

type SingleData = [number, number]

@Component({
  selector: 'app-currency-details',
  imports: [
    HighchartsChartModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatIconModule,
    ButtonComponent,
    MatCheckboxModule,
    MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ChartComponent,
  ],
  templateUrl: './currency-details.component.html',
  styleUrl: './currency-details.component.scss',
})
export class CurrencyDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)
  store = inject(Store)
  favourites$ = this.store.select(selectFavourites)
  user$ = this.store.select(selectCurrentUser)
  coinId = this.route.snapshot.paramMap.get('id') || ''
  coinPrices = signal<SingleData[]>([])
  coinData = signal<Coin | null>(null)
  private destroyRef = inject(DestroyRef)
  currency = Currency.EUR
  daysValue = 1
  formatNumber = formatNumber
  CURRENCY_SYMBOLS = CURRENCY_SYMBOLS
  filteredOptions = new Observable<string[]>()
  options: string[] = ['bitcoin', 'dogecoin', 'ethereum']

  myControl = new FormControl<string>('')

  chartForm = new FormGroup({
    days: new FormControl(1),
  })
  currencyForm = new FormGroup({
    currency: new FormControl(Currency.EUR),
  })
  compareCheckbox = new FormControl(false)
  compareCoin = new FormControl('')

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options = {
    title: {
      text: `${this.coinId} price - last 24 hours`,
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time',
      },
    },
    yAxis: {
      title: {
        text: 'Price (EUR)',
      },
    },
    series: [
      {
        type: 'line',
        name: 'Coin Price',
        data: [],
        color: '#10b981',
      },
    ],
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  }

  constructor(
    private favouriteService: FavouritesService,
    private modalService: ModalService
  ) {
    this.chartForm.get('days')?.valueChanges.subscribe(value => {
      this.daysValue = value ?? 1
      this.fetchCoinPrices()
    })
    this.currencyForm.get('currency')?.valueChanges.subscribe(value => {
      this.currency = value ?? Currency.EUR
      this.fetchCoinPrices()
      this.fetchCoinData()
    })
  }

  ngOnInit() {
    this.fetchCoinPrices()
    this.fetchCoinData()
    interval(40_0000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchCoinPrices())
    interval(10_0000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchCoinData())

    this.filteredOptions = this.compareCoin.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    )
  }

  fetchCoinPrices() {
    return this.http
      .get<CoinData>(
        `https://api.coingecko.com/api/v3/coins/${this.coinId}/market_chart?vs_currency=${this.currency}&days=${this.daysValue}&x_cg_demo_api_key=${environment.apiKey}`
      )
      .subscribe(data => {
        this.coinPrices.set(data.prices)
        this.chartOptions = {
          ...this.chartOptions,
          title: {
            text: `${this.coinId} price - last ${this.daysValue === 1 ? '24 hours' : this.daysValue === 30 ? '30 days' : '365 days'}`,
          },
          series: [
            {
              type: 'line',
              name: 'Coin Price',
              data: this.coinPrices(),
            },
          ],
        }
      })
  }

  fetchCoinData() {
    return this.http
      .get<
        Coin[]
      >(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.currency}&ids=${this.coinId}&x_cg_demo_api_key=${environment.apiKey}`)
      .subscribe(data => {
        this.coinData.set(data[0])
      })
  }

  toggleFavourite(currencyId: string) {
    this.favouriteService.toggleFavourite(currencyId)
  }

  openTradeModal() {
    const coin = this.coinData()
    if (coin) this.modalService.openModal(TradeModalComponent, coin)
  }
}
