import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public snackBar = inject(MatSnackBar)

  open(message: string, type?: string) {
    let additionalClass = type === 'error' ? 'red-snackbar' : 'green-snackbar'

    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message },
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [additionalClass]
    })
  }
}
