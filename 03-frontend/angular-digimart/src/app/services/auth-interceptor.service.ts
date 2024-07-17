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



// Actual flow of application (How are we securing the order History route) : 
/*
Till no, we have ensured that if a user is not logged in, he cant see order history(we did this by using okta protected route for "/orders" and we also added if condition to show the orders button in login-status-component.html file). But the backend api route for displaying ordrs is not protected. Like if anyone accesses "https://localhost:8443/api/orders" (or any of its subpath like "https://localhost:8443/api/orders/findByCustomerEmail?email=something") from the browser, he will directly get the list of orders from dfatabase, as the route is not protected on backend. To do so, we use okt-security-for-spring on the backend. e add dependency and set5 up a configuration file. Now unless the backend api is not told that the user is logged in, it ill send 401 unauthorized for all http requests of the type "https://localhost:8443/api/orders/**". Ho to tell the backend that user is logged in at frontend? Well, we send an access token from frontnd to backend alongwith the http request that we make to get order history for loggd in customer. Once he logs in at front end, we retreive the okta access tokn and send it to backend api whilke making request call for order history using the url(https://localhost:8443/api/orders/findByCustomerEmail?email=something). To send the access token, we use Angular Interceptor. Interceptor is an interface that ais capable of intercepting/modifying an outgoing http request. e create an AuthIntyerceptor service class that implements the standard HTTP_INTERCEPTOR interceptor. Inside this calss we define a handleAccess method. Inside this method, w first check if the current http rquest is being mad to the url-"https://localhost:8443/api/orders/**", ie we chck if the currnt http request is being made for OrderHistory or not. Becaus if not, like if it is being made for some other purpose(getting products etc), we dont need to send access token with that request as those routes are not protected. Only the "https://localhost:8443/api/orders/**" route is protcted.So, if the current request is for order histor, we add the access token in the header of http request and send it to the destination. As the backnd api rceives the accesstoken, it comes to know that the user is logges in and the api sends us the orders from database. We also add the interceptor info in app.moduls.ts files providers list.This is how we secure the order History route on both front end and backend.
*/

