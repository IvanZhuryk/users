import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  haveAcount: boolean = true;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  onSwitchMode() {
    this.haveAcount = !this.haveAcount;
  }
  onFormSubmitted() {
    if (this.haveAcount) {
      //login
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authService.logIn({ email, password }).subscribe({
        next: (res) => {
          console.log(res);
          this.authService.token.next(this.authService.getAccessToken());
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.log(err);
        },
      });
      this.loginForm.reset();
    } else {
      const email = this.registerForm.value.email;
      const name = this.registerForm.value.name;
      const password = this.registerForm.value.password;
      this.authService.signup({ name, email, password }).subscribe({
        next: (res) => {
          console.log(res);
          this.haveAcount = !this.haveAcount;
        },
        error: (err) => {
          console.log(err);
        },
      });
      this.registerForm.reset();
    }
  }
}
