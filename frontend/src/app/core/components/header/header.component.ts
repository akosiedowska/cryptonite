import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../types';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, ButtonComponent, RouterLink, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: undefined | null | string = undefined
  constructor(public userService: UserService, private router: Router, public authService: AuthService) {
    effect(() => {
      // this.userName = this.userService.getUser()
      this.userName = this.authService.currentUser()?.username
    })
  }

  logOut() {
    this.authService.currentUser.set(null)
    this.userName = null
    this.router.navigate(['/'])
  }
}
