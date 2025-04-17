import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular'
import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

interface CoinData {
  prices: SingleData[]
}

type SingleData = [number, number]

@Component({
  selector: 'app-currency-details',
  imports: [HighchartsChartModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './currency-details.component.html',
  styleUrl: './currency-details.component.scss'
})
export class CurrencyDetailsComponent {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)
  coinId = this.route.snapshot.paramMap.get('id') || ''
  coinPrices = signal<SingleData[]>([])
  private destroyRef = inject(DestroyRef)
  private daysValue = 1

  chartForm = new FormGroup({
    days: new FormControl(1)
  })

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options = {
    title: {
      text: `${this.coinId} price - last 24h`
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

  constructor() {
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
  }

  fetchCoinData() {
    return this.http.get<CoinData>(`https://api.coingecko.com/api/v3/coins/${this.coinId}/market_chart?vs_currency=eur&days=${this.daysValue}&x_cg_demo_api_key=${environment.apiKey}`)
      .subscribe(
        data => {
          console.log('data', data)
          this.coinPrices.set(data.prices)
          this.chartOptions = {
            ...this.chartOptions,
            series: [{
              type: 'line',
              name: 'Coin Price',
              data: this.coinPrices()
            }]
          }
        }
      )

  }
}
