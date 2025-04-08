import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { selectTransactions } from '../../../../core/store/transactions/transactions.selector';

@Component({
  selector: 'app-transactions',
  imports: [MatTableModule, CommonModule, DatePipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  private store = inject(Store)
  transactions$ = this.store.select(selectTransactions)
  displayedColumns = ['coin-name', 'transaction-type', 'price', 'amount', 'spent', 'date']
}
