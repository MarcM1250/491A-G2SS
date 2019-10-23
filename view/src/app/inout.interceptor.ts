/** */
import { Injectable } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class InOutInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const tkn = this.authenticationService.getCurrentToken();

    if (tkn) {
      if (request.url.match('localhost')) {
        console.log('Request URL:', request.url);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${tkn}`
          }
        });
      }
    }

    return next.handle(request).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }

          this.authenticationService.boot();
        }
      }
    ));
  }
}
