import { inject, Injectable } from '@angular/core';
import { Coin } from '../store/coins/coins.model';
import { MatDialog } from '@angular/material/dialog';
import { TradeModalComponent } from '../../shared/components/trade-modal/trade-modal.component';


@Injectable({
  providedIn: 'root'
})
export class TradeModalService {
  readonly dialog = inject(MatDialog)
  constructor() { }

  openModal(coin: Coin): void {
    const dialogRef = this.dialog.open(TradeModalComponent, { data: coin })

    dialogRef.afterClosed().subscribe(() => console.log('modal closed'))
  }

}
