import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  token!: string | null;
  constructor(private auth: AuthService) {
    this.auth.token.subscribe((data) => {
      this.token = data;
    });
    this.auth.token.next(this.auth.getAccessToken());
  }
  logout() {
    this.auth.logOut();
  }
}
