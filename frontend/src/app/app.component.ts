import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { CoinsService } from './core/services/coins.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cryptonite';

  constructor(private coinService: CoinsService, private authService: AuthService) { }

  ngOnInit() {
    this.coinService.fetchCoins()
    const loggedUser = window.localStorage.getItem('CryptoniteUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      this.authService.currentUser.set(user)
    }
  }
}
