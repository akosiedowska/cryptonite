import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { selectWallet } from '../../../../core/store/wallet/wallet.selectors';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, map, Observable, share, shareReplay, startWith, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


interface WalletData {
  wallet: {
    currency_id: string,
    currency_name: string,
    amount: number,
    total_spent: number,
    currentValue: number,
    change: number,
  }[],
  totalWalletValue: number,
  changePercentage: number
}

@Component({
  selector: 'app-wallet',
  imports: [MatIconModule, MatTableModule, CommonModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent {
  private store = inject(Store)
  wallet$ = this.store.select(selectWallet)
  displayedColumns = ['coin', 'amount', 'spent', 'curr_value', 'change']
  coinPrices: { [key: string]: { eur: number } } = {}
  walletData$: Observable<WalletData>

  constructor(private http: HttpClient) {
    this.walletData$ = interval(1000_000).pipe(
      startWith(0),
      switchMap(() => this.wallet$),
      switchMap(wallet => {
        const ids = wallet.map(coin => coin.currency_id).filter(coin => coin !== 'fake-euro').join(',')

        return this.http.get<{ [key: string]: { eur: number } }>(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur&x_cg_demo_api_key=${environment.apiKey}`
        ).pipe(
          map(prices => {
            this.coinPrices = prices
            let updatedWallet = wallet.map(coin => {
              const totalSpent = Number(coin.total_spent)
              const amount = Number(coin.amount)
              const currentValue = coin.currency_id === 'fake-euro' ? amount : (prices[coin.currency_id]?.eur || 0) * amount

              return {
                ...coin,
                currentValue: currentValue,
                change: (currentValue - totalSpent)
              }
            })

            updatedWallet = updatedWallet.sort((a, b) => {
              if (a.currency_id === 'fake-euro') return -1
              if (b.currency_id === 'fake-euro') return 1
              return 0
            })

            const totalWalletValue = updatedWallet.reduce((acc, curr) => acc + curr.currentValue, 0)
            const changePercentage = +((totalWalletValue - 10000) / 100).toFixed(2)
            return { wallet: updatedWallet, totalWalletValue, changePercentage }
          })
        )
      }),
      takeUntilDestroyed(),
      // shareReplay({ bufferSize: 1, refCount: true })
      share()
    )
  }

}
