import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core'
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { ListCoinElement } from '../../../../types'
import { HttpClient } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { map, Observable, startWith } from 'rxjs'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-alerts',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    ButtonComponent,
    MatAutocompleteModule,
    CommonModule,
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent implements OnInit {
  private http = inject(HttpClient)
  private destroyRef = inject(DestroyRef)
  coinList = signal<ListCoinElement[]>([])
  filteredOptions = new Observable<ListCoinElement[]>()
  selectedCoinId = signal<string>('')
  selectedCoinName = signal<string>('')

  alertForm = new FormGroup({
    currency: new FormControl<ListCoinElement | string>(
      '',
      Validators.required
    ),
    option: new FormControl('', Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  currencies = ['BTC', 'ETH', 'USDT', 'EUR', 'USD']

  options = ['<', '>', '=']

  ngOnInit() {
    this.fetchCoinList()

    this.filteredOptions = this.alertForm.get('currency')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue =
          typeof value === 'string'
            ? value.toLowerCase()
            : value?.name?.toLowerCase() || ''
        return this._filter(filterValue).slice(0, 100)
      })
    )
  }

  private _filter(filterValue: string): ListCoinElement[] {
    return this.coinList().filter(option =>
      option.name.toLowerCase().includes(filterValue)
    )
  }

  onSubmit() {
    if (this.alertForm.valid) {
      // const alertData = this.alertForm.value
      // console.log('Alert submitted:', alertData)
      this.alertForm.reset()
    }
  }

  fetchCoinList() {
    return this.http
      .get<ListCoinElement[]>(`https://api.coingecko.com/api/v3/coins/list`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.coinList.set(data)
        const value = this.alertForm.get('currency')!.value || ''
        this.alertForm.get('currency')!.setValue(value)
      })
  }

  onCoinSelected(selected: ListCoinElement) {
    this.selectedCoinId.set(selected.id)
    this.selectedCoinName.set(selected.name)
  }

  displayCoinName(coin: ListCoinElement): string {
    return coin?.name || ''
  }
}
