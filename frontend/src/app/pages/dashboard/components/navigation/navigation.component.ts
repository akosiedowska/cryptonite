import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ModalService } from '../../../../core/services/modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(private modalService: ModalService, private authService: AuthService) { }

  handleLogOut() {
    const dialogRef = this.modalService.openModal(ConfirmModalComponent, { message: 'Are you sure you want to log out?' })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout()
      }
    })
  }
}
