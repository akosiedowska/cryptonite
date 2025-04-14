import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular'

interface CoinData {
  prices: SingleData[]
}

type SingleData = [number, number]

@Component({
  selector: 'app-currency-details',
  imports: [HighchartsChartModule],
  templateUrl: './currency-details.component.html',
  styleUrl: './currency-details.component.scss'
})
export class CurrencyDetailsComponent {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)
  coinId = signal('')
  coinPrices = signal<SingleData[]>([])

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options = {}

  // chartOptions2: Highcharts.Options = {
  //   series: [{
  //     data: [1, 2, 3],
  //     type: 'line'
  //   }]
  // };

  // chartOptions: Highcharts.Options = {
  //   title: {
  //     text: 'Coin Price Over Time'
  //   },
  //   xAxis: {
  //     type: 'datetime',
  //     title: {
  //       text: 'Time'
  //     }
  //   },
  //   yAxis: {
  //     title: {
  //       text: 'Price (EUR)'
  //     }
  //   },
  //   series: [{
  //     type: 'line',
  //     name: 'Coin Price',
  //     data: this.coinPrices()
  //   }]
  // }

  ngOnInit() {
    this.coinId.set(this.route.snapshot.paramMap.get('id') || '')
    this.fetchCoinData()
  }

  fetchCoinData() {
    return this.http.get<CoinData>(`https://api.coingecko.com/api/v3/coins/${this.coinId()}/market_chart?vs_currency=eur&days=1&x_cg_demo_api_key=${environment.apiKey}`)
      .subscribe(
        data => {
          console.log('data', data)
          this.coinPrices.set(data.prices)
          this.chartOptions = {
            title: {
              text: 'Coin Price Over Time'
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
              data: this.coinPrices()
            }]
          }
        }
      )

  }
}
