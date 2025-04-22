import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { ButtonComponent } from '../../../shared/components/button/button.component'
import { RouterLink, RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Store } from '@ngrx/store'
import { selectCurrentUser } from '../../store/user/user.selector'
import { CoinsService } from '../../services/coins.service'

@Component({
  selector: 'app-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    ButtonComponent,
    RouterLink,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store)
  user$ = this.store.select(selectCurrentUser)

  constructor(
    private authService: AuthService,
    private CoinService: CoinsService
  ) {}

  handleLogOut() {
    this.authService.logout()
  }
}
