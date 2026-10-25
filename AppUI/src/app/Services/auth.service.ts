import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_MARKER_KEY = '__app_session_activity__';
const REFRESH_WINDOW_MS = 5 * 60 * 1000;
//const REFRESH_INTERVAL_MS = 29 * 60 * 1000;
const TIMER_MIN_DELAY_MS = 1000;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private tokenKey = 'jwtToken';
  private usernameKey = 'username';
  private userIdKey = 'UserId';
  private authUrl = 'http://localhost:8080/api/Auth/';
  private activityTimer?: ReturnType<typeof setTimeout>;
  private refreshSubscription?: Subscription;
  private lastActivityUpdate = 0;
  private lastTokenRefresh = 0;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private dialog: MatDialog
  ) {
    const url = window.location.href;
    if (url.indexOf('localhost:4200') > -1) {
      this.authUrl = 'https://localhost:44314/api/Auth/';
    }

    ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach(eventName => {
      this.document.addEventListener(eventName, this.recordActivity, { passive: true });
    });
    this.scheduleSessionCheck();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl + 'login', { Username: username, Password: password }).pipe(
      tap(response => {
        if (response?.token) {
          this.setToken(response.token);
          this.setUsername(username);
          this.lastTokenRefresh = Date.now();
          this.lastActivityUpdate = Date.now();
          console.log('Login successful',this.lastActivityUpdate );
          // localStorage is shared by tabs; sessionStorage is not. Keeping the
          // activity marker here lets a link opened in a new tab reuse the login.
          localStorage.setItem(SESSION_MARKER_KEY, String(Date.now() + IDLE_TIMEOUT_MS));
          this.recordActivity();
          this.scheduleSessionCheck();
          this.writeAuthLog(username, response.token, 'LOGIN');
        }
      })
    );
  }

  setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey) ?? sessionStorage.getItem(this.userIdKey);
  }

  logout(action = 'LOGOUT', redirectToLogin = true): void {
    this.dialog.closeAll();
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = undefined;
    }
    this.writeAuthLog(this.getUsername() ?? '', this.getToken() ?? '', action);
    localStorage.clear();
    sessionStorage.clear();

    if (redirectToLogin) {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

 isLoggedIn(): boolean {
    const token = this.getToken();
    return this.hasValidToken(token) && !this.isIdleExpired();
  }

  isIdleExpired(): boolean {
    const marker = Number(localStorage.getItem(SESSION_MARKER_KEY));
    return !Number.isFinite(marker) || Date.now() > marker;
  }
  canMakeRequest(): boolean {
    return this.hasValidToken(this.getToken()) && !this.isIdleExpired();
  }
  markActivity(): void {
    this.recordActivity();
  }

  refreshToken(): Observable<any> {
    const userId = this.getUserId();
    const username = this.getUsername() ?? localStorage.getItem('UserName');
    return this.http.post<any>(`${this.authUrl}refresh`, {
      userid: userId,
      username
    }).pipe(tap(response => {
      if (response?.token) {
        this.setToken(response.token);
        this.lastTokenRefresh = Date.now();
        //this.recordActivity();
        this.writeAuthLog(username ?? '', '', 'TOKEN_REFRESH');
      }
    }));
  }

  private readonly recordActivity = (): void => {
    if (!this.hasValidToken(this.getToken()) || this.isIdleExpired()) {
      return;
    }

    const now = Date.now();
    if (now - this.lastActivityUpdate < 1000) {
      return;
    }
    this.lastActivityUpdate = now;
    localStorage.setItem(SESSION_MARKER_KEY, String(now + IDLE_TIMEOUT_MS));
  };

  private checkSession(): void {
    const token = this.getToken();
    if (!this.hasValidToken(token)) {
    this.writeAuthLog(this.getUsername() ?? '', this.getToken() ?? '', 'not valid token');
      return;
    }
    if (this.isIdleExpired()) {
      this.logout('IDLE_TIMEOUT_LOGOUT', true);
      return;
    }

    const tokenExpiry = this.getTokenExpiry(token);
    if (tokenExpiry === null || tokenExpiry <= Date.now()) {
  this.logout('TOKEN_EXPIRED_LOGOUT', true);
  return;
    }
    console.log('tokenExpiry',this.lastActivityUpdate );
    const userActiveSinceRefresh = this.lastActivityUpdate > this.lastTokenRefresh;  
    console.log('userActiveSinceRefresh',userActiveSinceRefresh );  
   // const tokenNeedsRefresh = userActiveSinceRefresh && tokenExpiry !== null && tokenExpiry - Date.now() <= REFRESH_WINDOW_MS;
   // const activeSessionNeedsRefresh = userActiveSinceRefresh && Date.now() - this.lastTokenRefresh >= REFRESH_INTERVAL_MS;
    // if ((tokenNeedsRefresh || activeSessionNeedsRefresh) && !this.refreshSubscription) {
    //   this.refreshSubscription = this.refreshToken().subscribe({
    //     error: () => this.logout('TOKEN_REFRESH_FAILED_LOGOUT'),
    //     complete: () => {
    //       this.refreshSubscription = undefined;
    //       this.scheduleSessionCheck();
    //     }
    //   });
    // } 
    if (tokenExpiry - Date.now() <= REFRESH_WINDOW_MS && !this.refreshSubscription) {
  this.refreshSubscription = this.refreshToken().subscribe({
    error: () => this.logout('TOKEN_REFRESH_FAILED_LOGOUT', true),
    complete: () => {
      this.refreshSubscription = undefined;
      this.scheduleSessionCheck();
    }
  });
  return;
} 
      this.scheduleSessionCheck();     
  }

  private scheduleSessionCheck(): void {
    const now = Date.now(); 
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    const token = this.getToken();
    if (!this.hasValidToken(token)) {
      this.activityTimer = undefined;
      return;
    }
  
    const userActiveSinceRefresh = this.lastActivityUpdate > this.lastTokenRefresh;
    const idleAt = Number(localStorage.getItem(SESSION_MARKER_KEY));
    const tokenExpiry = this.getTokenExpiry(token);


  const refreshAt = tokenExpiry
    ? tokenExpiry - REFRESH_WINDOW_MS
    : Number.MAX_SAFE_INTEGER;

  const nextCheckAt = Math.min(
    Number.isFinite(idleAt) ? idleAt : Date.now(),
    refreshAt
  );

  const delay = Math.max(
    nextCheckAt - Date.now(),
    TIMER_MIN_DELAY_MS
  );

  this.activityTimer = setTimeout(() => {
    this.activityTimer = undefined;
    this.checkSession();
  }, delay);
  }
 writeAuthLog(username: string, token: string, action:string): void {
  this.http.post(`${this.authUrl}auth-log`, {
    username,
    token,
    action,
    time: new Date().toISOString()
  }).subscribe();
}
  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private hasValidToken(token: string | null): token is string {
    return typeof token === 'string' && token.trim().length > 0;
  }

  ngOnDestroy(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach(eventName => {
      this.document.removeEventListener(eventName, this.recordActivity);
    });
  }
}
