import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../../shared/Model/AuthRespons';
import { AuthReq } from '../../shared/Model/AuthReq';
import { LogReq } from '../../shared/Model/LogReq';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { Tokens } from '../../shared/Model/Tokens';
import { User } from '../../shared/Model/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = new Subject<string | null>();
  constructor(private http: HttpClient, private router: Router) {}
  signup(data: AuthReq) {
    const dataReq = {
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: 'https://picsum.photos/800',
    };
    return this.http.post<AuthResponse>(
      'https://api.escuelajs.co/api/v1/users/',
      dataReq
    );
  }
  getUsers() {
    return this.http.get<User[]>('https://api.escuelajs.co/api/v1/users');
  }
  logIn(data: LogReq) {
    const dataReq = {
      email: data.email,
      password: data.password,
    };
    return this.http
      .post<Tokens>('https://api.escuelajs.co/api/v1/auth/login', dataReq)
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }
  refreshToken() {
    return this.http
      .post<Tokens>('https://api.escuelajs.co/api/v1/auth/refresh-token', {
        refreshToken: `${this.getRefreshToken}`,
      })
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn() {
    return !!this.getAccessToken();
  }
  logOut() {
    localStorage.clear();
    this.token.next(this.getAccessToken());
    this.router.navigate(['/login']);
  }
}
