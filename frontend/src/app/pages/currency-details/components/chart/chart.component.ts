import {
  Component,
  DestroyRef,
  inject,
  Input,
  signal,
  OnInit,
  OnChanges,
} from '@angular/core'
import { Currency } from '../../../../constants'
import * as Highcharts from 'highcharts'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { interval } from 'rxjs'
import { HighchartsChartModule } from 'highcharts-angular'
import 'highcharts/modules/accessibility'

interface CoinData {
  prices: SingleData[]
}

type SingleData = [number, number]

@Component({
  selector: 'app-chart-component',
  imports: [HighchartsChartModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit, OnChanges {
  private http = inject(HttpClient)
  private destroyRef = inject(DestroyRef)
  @Input() coinId = ''
  @Input() coinName? = ''
  @Input() days = 1
  @Input() currency: Currency = Currency.EUR
  @Input() color = ''
  coinPrices = signal<SingleData[]>([])

  Highcharts: typeof Highcharts = Highcharts
  chart?: Highcharts.Chart

  chartOptions: Highcharts.Options = {
    chart: {
      // marginLeft: 120,
    },
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
        text: `Price (${this.currency})`,
      },
    },
    tooltip: {
      valueDecimals: 6,
    },
    series: [
      {
        type: 'line',
        name: 'Coin Price',
        data: [],
      },
    ],
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
  }

  ngOnInit() {
    this.fetchCoinPrices()
    interval(40_0000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchCoinPrices())
  }

  ngOnChanges() {
    this.fetchCoinPrices()
  }

  fetchCoinPrices() {
    return this.http
      .get<CoinData>(
        `https://api.coingecko.com/api/v3/coins/${this.coinId}/market_chart?vs_currency=${this.currency}&days=${this.days}&x_cg_demo_api_key=${environment.apiKey}`
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.coinPrices.set(data.prices)
        this.chartOptions = {
          ...this.chartOptions,
          title: {
            text: `${this.coinName || ''} price - last ${this.days === 1 ? '24 hours' : this.days === 30 ? '30 days' : '365 days'}`,
          },
          yAxis: {
            title: {
              text: `Price (${this.currency.toUpperCase()})`,
            },
          },
          xAxis: {
            crosshair: true,
            events: {
              setExtremes: function (e) {
                const thisChart = this.chart

                if (e.trigger !== 'syncExtremes') {
                  Highcharts.charts.forEach(chart => {
                    if (chart !== thisChart) {
                      if (chart?.xAxis[0].setExtremes) {
                        chart?.xAxis[0].setExtremes(
                          e.min,
                          e.max,
                          undefined,
                          false,
                          {
                            trigger: 'syncExtremes',
                          }
                        )
                      }
                    }
                  })
                }
              },
            },
          },
          series: [
            {
              type: 'line',
              name: 'Coin Price',
              data: this.coinPrices(),
              color: `${this.color}` || '#10b981',
            },
          ],
        }
      })
  }
}
