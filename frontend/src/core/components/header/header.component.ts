import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, ButtonComponent, RouterLink, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName = ''
  constructor(public userService: UserService, private router: Router) {
    effect(() => {
      this.userName = this.userService.getUser()
    })
  }

  logOut() {
    this.userName = ''
    this.router.navigate(['/'])
  }
}
