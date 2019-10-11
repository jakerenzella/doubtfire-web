import { Injectable, Injector, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import API_URL from 'src/app/config/constants/apiURL';
import { CurrentUser } from 'src/app/sessions/current-user/current-user';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private currentUser: CurrentUser,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith(API_URL) && this.currentUser.authenticationToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.currentUser.authenticationToken}`
        },
        params: request.params.append('auth_token', this.currentUser.authenticationToken)
      });
    }
    return next.handle(request);

  }
}
