import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest,HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (typeof token === 'string' && token.trim().length > 0 && !this.authService.canMakeRequest()) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Session expired after 30 minutes of inactivity.'));
    }

    if (typeof token === 'string' && token.trim().length > 0) {
      this.authService.markActivity();
    }

    let cloned = req;
    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout(); // clear token, user info
          this.router.navigate(['/login']); // redirect to login page
        }
        return throwError(() => error);
      })
    );
  }
}
