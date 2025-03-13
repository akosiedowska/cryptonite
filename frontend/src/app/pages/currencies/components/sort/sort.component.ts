import { Component, Input } from '@angular/core';
import { CoinsService } from '../../../../core/services/coins.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sort',
  imports: [MatIconModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent {
  @Input() order = ''
  constructor(public coinService: CoinsService) { }

  toggleOrder(order: string) {
    const currentOrder = this.coinService.getOrder()

    if (currentOrder === order + '_desc') {
      this.coinService.setOrder(order + '_asc')
    } else {
      this.coinService.setOrder(order + '_desc')
    }
  }

  getSortIcon(order: string): string {
    const currentOrder = this.coinService.getOrder()

    if (currentOrder.startsWith(order)) {
      return currentOrder.endsWith('_asc') ? 'arrow_upward' : 'arrow_downward'
    } else {
      return 'arrow_downward'
    }
  }
}
