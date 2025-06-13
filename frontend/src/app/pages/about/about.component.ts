import { Component } from '@angular/core'
import { ButtonComponent } from '../../shared/components/button/button.component'
import { CurrentUserService } from '../../core/services/current-user.service'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-about',
  imports: [ButtonComponent, RouterLink, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(public currentUserService: CurrentUserService) {}
}
