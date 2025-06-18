import { Component } from '@angular/core'
import { MatTableModule } from '@angular/material/table'

@Component({
  selector: 'app-notifications',
  imports: [MatTableModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {}
