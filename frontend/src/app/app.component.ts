import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { CurrentUserService } from './core/services/current-user.service';
import { Store } from '@ngrx/store';
import { CoinsLoadActions } from './core/store/coins/coins.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cryptonite'

  constructor(private currentUserService: CurrentUserService, private store: Store) { }

  ngOnInit() {
    this.store.dispatch(CoinsLoadActions.loadCoins())
    this.currentUserService.initializeCurrentUser()
  }
}
