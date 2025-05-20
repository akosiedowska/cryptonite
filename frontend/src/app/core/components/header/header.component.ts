import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { ButtonComponent } from '../../../shared/components/button/button.component'
import { RouterLink, RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Store } from '@ngrx/store'
import { selectCurrentUser } from '../../store/user/user.selector'
import { MatMenuModule } from '@angular/material/menu'
import { MatDividerModule } from '@angular/material/divider'

@Component({
  selector: 'app-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    ButtonComponent,
    RouterLink,
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store)
  user$ = this.store.select(selectCurrentUser)

  constructor(private authService: AuthService) {}

  handleLogOut() {
    this.authService.logout()
  }
}
