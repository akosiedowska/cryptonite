import { Component, effect, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinsService } from '../../core/services/coins.service';
import { Coin } from '../../types';

@Component({
  selector: 'app-currencies',
  imports: [CommonModule],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent {
  coins = signal<Coin[]>([])
  constructor(public coinService: CoinsService) {
    effect(() => {
      this.coins.set(this.coinService.getCoins())
    })

  }
}
