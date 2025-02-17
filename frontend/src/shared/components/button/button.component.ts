import { Component, Input } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgClass, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() text: string = ''
  @Input() outlined: boolean = false
  @Input() disabled: boolean = false
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
}
