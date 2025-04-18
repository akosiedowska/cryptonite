import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  readonly dialog = inject(MatDialog)
  constructor() { }

  openModal<T extends ComponentType<any>, D = any>(component: T, data?: D) {
    return this.dialog.open(component, { data: data })
  }

}
