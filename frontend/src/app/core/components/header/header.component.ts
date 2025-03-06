import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, ButtonComponent, RouterLink, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName = signal<undefined | null | string>(null)

  constructor(private currentUserService: CurrentUserService, private authService: AuthService) {
    effect(() => {
      this.userName.set(this.currentUserService.getCurrentUser()?.name)
    })
  }

  handleLogOut() {
    this.authService.logout()
    this.userName.set(null)
  }
}
