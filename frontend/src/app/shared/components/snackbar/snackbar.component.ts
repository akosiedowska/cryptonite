import { Component, Inject, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBarAction, MatSnackBarLabel } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  imports: [MatIconModule, MatSnackBarModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  public snackBarRef = inject(MatSnackBarRef)

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

}
