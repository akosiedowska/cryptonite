import { Component, effect, input } from '@angular/core'
import { WalletData } from '../../wallet.component'
import { HighchartsChartModule } from 'highcharts-angular'
import * as Highcharts from 'highcharts'
import 'highcharts/modules/accessibility'

@Component({
  selector: 'app-wallet-chart',
  imports: [HighchartsChartModule],
  templateUrl: './wallet-chart.component.html',
  styleUrl: './wallet-chart.component.scss',
})
export class WalletChartComponent {
  walletData = input<WalletData | null>()

  constructor() {
    effect(() => {
      const dataWallet = this.walletData()
      if (!dataWallet) return
      const data = dataWallet.wallet.map(coin => ({
        name: coin.currency_name,
        y: coin.currentValue / dataWallet.totalWalletValue,
      }))
      this.chartOptions = {
        ...this.chartOptions,
        series: [
          {
            type: 'pie',
            name: 'Percentage',
            data: data,
          },
        ],
      }
    })
  }

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Wallet Composition',
    },
    tooltip: {
      valueSuffix: '%',
      pointFormat: '{point.name}: {point.percentage:.4f}%',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.2f}%',
          // crop: false,
          // overflow: 'allow',
          distance: 15,
          padding: 0,
          style: {
            fontSize: '11px',
          },
        },
        showInLegend: true,
      },
    },
    accessibility: {
      description: 'Pie chart showing wallet distribution by currency',
      announceNewData: {
        enabled: true,
      },
      point: {
        valueSuffix: '%',
      },
      series: {
        describeSingleSeries: true,
        descriptionFormatter: function (series) {
          return (
            `This pie chart shows ${series.name}, with ` +
            `${series.points.length} currencies represented.`
          )
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Percentage',
        data: [],
      },
    ],
    // responsive: {
    //   rules: [
    //     {
    //       condition: {
    //         maxWidth: 500,
    //       },
    //       chartOptions: {
    //         plotOptions: {
    //           pie: {
    //             dataLabels: {
    //               distance: '15%',
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ],
    // },
  }
}
