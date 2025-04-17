import { Component, inject, signal, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { buyCoin, sellCoin } from '../../../core/store/wallet/wallet.actions';
import { selectCurrentUser } from '../../../core/store/user/user.selector';
import { addTransaction } from '../../../core/store/transactions/transactions.actions';
import { map, take } from 'rxjs';
import { selectWallet } from '../../../core/store/wallet/wallet.selectors';
import { selectCoins } from '../../../core/store/coins/coins.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-trade-modal',
  imports: [ButtonComponent, ReactiveFormsModule, MatInputModule, CommonModule],
  templateUrl: './trade-modal.component.html',
  styleUrl: './trade-modal.component.scss'
})
export class TradeModalComponent {
  data = inject(MAT_DIALOG_DATA)
  transactionType = signal<'buy' | 'sell'>('buy')
  readonly dialogRef = inject(MatDialogRef)
  store = inject(Store)
  user$ = this.store.select(selectCurrentUser)
  wallet$ = this.store.select(selectWallet)
  coins$ = this.store.select(selectCoins)
  currentBalance: number = 0
  coinBalance: number = 0
  errorMessage: string = ''
  price$ = this.coins$.pipe(
    map(coins => coins.find(c => c.id === this.data.id)?.current_price || 0)
  )

  tradeForm = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required]),
    value: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  })

  constructor() {
    this.tradeForm.get('value')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.price$.pipe(take(1)).subscribe(price => {
          if (value && price) {
            const calculatedAmount = Number((value / price).toFixed(5))
            this.tradeForm.get('amount')?.setValue(calculatedAmount, { emitEvent: false })
          }
        })
      })

    this.tradeForm.get('amount')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((amount) => {
        this.price$.pipe(take(1)).subscribe(price => {
          if (amount && price) {
            const calculatedValue = amount * price
            this.tradeForm.get('value')?.setValue(calculatedValue, { emitEvent: false })
          }
        })
      })

    this.wallet$.pipe(takeUntilDestroyed()).subscribe(wallet => {
      this.currentBalance = Number(wallet.filter(coin => coin.currency_id === "fake-euro")[0].amount)
      this.coinBalance = Number(wallet.filter(coin => coin.currency_id === this.data.id)[0]?.amount) || 0
    })

    this.tradeForm.valueChanges.subscribe(() => {
      this.errorMessage = ''
    })

    this.price$.pipe(takeUntilDestroyed()).subscribe(price => {
      const value = Number(this.tradeForm.get('value')?.value)
      if (value) {
        const calculatedAmount = Number((value / price).toFixed(5))
        this.tradeForm.get('amount')?.setValue(calculatedAmount, { emitEvent: false })
      }
    })
  }

  checkBalance() {
    const amount = Number(this.tradeForm.get('amount')?.value)
    const value = Number(this.tradeForm.get('value')?.value)

    switch (this.transactionType()) {
      case 'buy':
        if (this.currentBalance >= value) {
          this.errorMessage = ''
          this.handleTrade()
        } else this.errorMessage = "Not enough euro to complete the purchase"
        break

      case 'sell':
        if (this.coinBalance >= amount) {
          this.errorMessage = ''
          this.handleTrade()
        } else this.errorMessage = `Not enough ${this.data.name} to complete the purchase`
        break

      default: this.errorMessage = ''
    }
  }

  handleTrade() {
    this.user$.pipe(take(1)).subscribe(user => {
      if (user && user.id) {
        const newWalletCoin = {
          userId: user.id,
          currencyId: this.data.id,
          currencyName: this.data.name,
          amount: Number(this.tradeForm.get('amount')?.value),
          totalSpent: Number(this.tradeForm.get('value')?.value)
        }

        if (this.transactionType() == "buy") {
          this.store.dispatch(buyCoin(newWalletCoin))
        } else {
          this.store.dispatch(sellCoin(newWalletCoin))
        }

        this.price$.pipe(take(1)).subscribe(price => {
          const newTransaction = {
            userId: user.id,
            currencyId: this.data.id,
            currencyName: this.data.name,
            amount: Number(this.tradeForm.get('amount')?.value),
            price: price,
            totalValue: Number(this.tradeForm.get('amount')?.value) * price,
            transactionType: this.transactionType()
          }
          this.store.dispatch(addTransaction(newTransaction))
        })
      }
    })
    this.tradeForm.reset()
    this.dialogRef.close()
  }

  handleCancel() {
    this.dialogRef.close()
  }

}
