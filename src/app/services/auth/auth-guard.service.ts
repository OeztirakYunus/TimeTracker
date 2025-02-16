import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth : AuthService ,private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.checkUserLogin(route, state.url);
  }

  async checkUserLogin(route: ActivatedRouteSnapshot, url: string): Promise<boolean> {
    if (this.auth.isAuthenticated()) {
      const userRole = await this.auth.role;
      if (route.data['role'] && route.data['role'] !== userRole) {
        this.router.navigate(['/stempeln']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
