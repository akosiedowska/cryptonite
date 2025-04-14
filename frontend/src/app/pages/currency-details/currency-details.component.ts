import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-currency-details',
  imports: [],
  templateUrl: './currency-details.component.html',
  styleUrl: './currency-details.component.scss'
})
export class CurrencyDetailsComponent {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)
  coinId = signal('')
  coinPrices = signal([])

  ngOnInit() {
    this.coinId.set(this.route.snapshot.paramMap.get('id') || '')
    this.fetchCoinData()
  }

  fetchCoinData() {
    return this.http.get(`https://api.coingecko.com/api/v3/coins/${this.coinId()}/market_chart?vs_currency=eur&days=1&x_cg_demo_api_key=${environment.apiKey}`)
      .subscribe(
        data => {
          console.log('data', data)
        }
      )
  }
}
