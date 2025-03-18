import { effect, Injectable, signal } from '@angular/core';
import { Coin, ListCoinElement } from '../../types';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root',
})

export class CoinsService {
  private coins = signal<Coin[]>([])
  private totalResults = signal<number>(0)
  private perPage = signal<number>(15)
  private page = signal<number>(1)
  private query = signal<string>('')
  private order = signal<string>('market_cap_desc')
  isLoading = false
  errorMessage = signal<string>('')

  constructor() { }

  async fetchCoins() {
    try {
      let coinIds
      this.isLoading = true
      // const coinsListResponse = await fetch('https://api.coingecko.com/api/v3/coins/list')
      // const totalResultsData: ListCoinElement[] = await coinsListResponse.json()
      // this.totalResults.set(totalResultsData.length)
      this.totalResults.set(17182)
      if (this.query()) {
        const searchResponse = await fetch(`https://api.coingecko.com/api/v3/search?query=${this.query()}`)
        if (!searchResponse.ok) throw new Error('Failed to fetch the data.')

        const searchData = await searchResponse.json()
        coinIds = searchData.coins.map((coin: ListCoinElement) => coin.id).join(',')
        this.totalResults.set(searchData.coins.length)
      }

      const coinsResponse = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&page=${this.page()}&per_page=${this.perPage()}&order=${this.order()}&price_change_percentage=1h%2C24h%2C7d&ids=${coinIds || this.query()}&x_cg_demo_api_key=${environment.apiKey}`)
      if (!coinsResponse.ok) throw new Error('Failed to fetch the data.')
      const coinsData: Coin[] = await coinsResponse.json()
      console.log('coinsData', coinsData)
      this.coins.set(coinsData)
    } catch (e) {
      console.log(e)
      this.errorMessage.set('Failed to fetch the data. Please try again later.')
      this.coins.set([])
    } finally {
      this.isLoading = false
    }
  }

  getCoins() {
    return this.coins()
  }

  getPagination() {
    return {
      page: this.page(),
      perPage: this.perPage(),
      totalResults: this.totalResults()
    }
  }

  setPage(page: number) {
    if (page < 1 || page > (Math.ceil(this.totalResults() / this.perPage()))) return
    this.page.set(page)
    this.fetchCoins()
  }

  setQuery(search: string) {
    this.query.set(search)
  }

  setOrder(order: string) {
    this.order.set(order)
    this.fetchCoins()
  }
  getOrder() {
    return this.order()
  }
}
