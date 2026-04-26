import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isAuth = (this.auth as any)._isAuthenticated?.value ?? false;
    if (isAuth) return true;
    return this.router.parseUrl('/login');
  }

  canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }
}
