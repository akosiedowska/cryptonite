import { Injectable, signal } from '@angular/core';
import { Coin } from '../../types';

@Injectable({
  providedIn: 'root',
})

export class CoinsService {
  private coins = signal<Coin[]>([])
  constructor() { }

  async fetchCoins() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&per_page=25')
      const data: Coin[] = await response.json()
      console.log('data', data)
      this.coins.set(data)
    } catch (e) {
      console.log(e)
    }
  }

  getCoins() {
    return this.coins()
  }
}
