import { Component, DoCheck } from '@angular/core';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  shownav = false;
  title = 'App.UI';

  constructor(private authService: AuthService) {}

  ngDoCheck(): void {
    this.shownav = this.authService.isLoggedIn();
  }
}
