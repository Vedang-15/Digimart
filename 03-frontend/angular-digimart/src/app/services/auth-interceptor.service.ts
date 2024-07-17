import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth : OktaAuth) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.handleAccess(request, next));

  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {


    // only add an access token for secured endpoints
    const theEndpoint = environment.digimartApiUrl + '/orders';   
    // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values basd on the environment in which w are runningm our app)
    
    const securedEndpoints = [theEndpoint];   // if we have multiple secured endpoints on backend, we can add all of them in this array.

    if(securedEndpoints.some(url => request.urlWithParams.includes(url))){    // hre we chck if the url for the current http requests contains the secured endpoint, ie if current http request is being made for a route that6 is protected at tjhe backnd or not.

      //get the access token
      const accessToken = this.oktaAuth.getAccessToken();

      // clone the existing request(the one that we are intercepting) and add access token as a header to the cloned request
      request = request.clone({
        setHeaders : {
          Authorization : 'Bearer ' + accessToken
        }
      });
    }

    return await lastValueFrom(next.handle(request));   // this line implies simply passed this modified request to the nxt interceptor. If there are no further interceptor, pass/send it to the destination(which in our case is the spring boot api).Since we have only one intyerceptor in our project, we send the modified request to th spring boot api.
  }
}



