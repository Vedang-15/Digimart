import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG, OktaAuthGuard } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';


const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth : OktaAuth, injector : Injector){
  // we use injector to access any service available within our app. here, we will use injector to access the router.
  const router = injector.get(Router);

  // redirct the yser to custom login page
  router.navigate(['/custom-login']); // if we us login instead of custom-login, we will get redirectd to oktas login page instead of our apps custom login page.
}

const routes : Routes = [
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data: { onAuthRequires: sendToLoginPage } },
  { path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], data: { onAuthRequires: sendToLoginPage } },   // here we are making this route protected using OktaAuthGuard route guard. Also, onAuthRequired is callback function that is triggered when a route protected by OktaAuthGuard is accessed without authentication or without needed level of end-user assurance. In this case, if user is not authnricated and tries to access this protected route, sendToLoginPage function will be called.
  { path: 'login/callback', component : OktaCallbackComponent},
  { path: 'login', component : LoginComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:productId', component: ProductDetailsComponent },
  { path: 'search/:keyword', component : ProductListComponent},
  { path : 'category/:id', component : ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo : '/products', pathMatch : 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,  // we need http client module to make a request and receive JSON data from spring boots rest api. This http module facilitates JSON data transfer beteen spring boots rest api and our angular code.
    RouterModule.forRoot(routes), // used to configure the router according to above defined routes
    NgbModule, // used to directly incorporate angular widgets built using bootstrap
    ReactiveFormsModule, // gives support for reactive forms
    OktaAuthModule // gives support for okta integration with our app. This includes providing authentication, authorization, generating tokens tec. 
  ],
  providers: [ProductService, { provide : OKTA_CONFIG, useValue : { oktaAuth}}, {provide : HTTP_INTERCEPTORS, useClass : AuthInterceptorService, multi : true}],  
  /* 
  1. ProductService - allows to inject our product service in other parts of code
  2. { provide : OKTA_CONFIG, useValue : { oktaAuth}} - tells the app w are using OKTA_AUTH amd allows us to inject oktaAuth in other parts of code
  3. {provide : HTTP_INTERCEPTORS, useClass : AuthInterceptorService, multi : true} - tells the app thar we are going to use HTTP_INTERCEPTORS in our project, also tlls that we are registering AuthInterceptorService class as out HTTP_INTERCEPTOR. Finally, the multi:true informs angular that we can hav multiple interceptors(0 to many).
  */
  bootstrap: [AppComponent]
})
export class AppModule { }









/*
A server is an application, a piece of networking software. So, whenever we build a backend application, we are basically building a server that serves files/resources to others. Also an app/server alays works on/listns on a particular port and we use that port to build urls to talk/interact with the application/server. For eg, our backnd spring boot app(which is nothing buit a server) on port 8443 and we use this port to build urls(like "https://localhost:8443/api/products") to intract with the backend server/app.
*/

/*
Deploying code is the process of moving code changes from a development environment to a production environment, where it becomes accessible to users. This typically involves a series of steps, including testing, building, and releasing the code. So basically pushing code into production means running it on our companies server(their port, their enviornment etc, eg - https://myapp.mycompany.com:443/something) instead of running it on our development server(i localhost, eg : https://localhost:8080/something). Code put in production has moved out of our development environment(local systems) and is available to users when they access company-provided server(domain/website etc)
*/


/* API vs Library */
/*
Often APIs and a libraries have a 1:1 relationship, so I can understand some of the confusion. Often, a library to solve some problem has its specific way how to interact with the library (making up the API).

An API (Application Programming Interface) is the way your application communicates with some software component, typically a library. A typical example is the Java API. It defines lots of classes and methods that can be used by your application.

A library is a collection of functionality not making up an application of its own, but offered to application software to ease implementing some tasks. The way of interacting with that library is defined by some API. You can think of the jar files inside your JRE as being libraries (although that term isn't often used in that context) that follow the Java API. There can be different implementations (from different vendors) making up different libraries, all following the same API.

A framework not only offers some classes and methods, but also proposes a specific way how to structure your application software. The distinction between API and framework isn't 100 percent sharp, as every API influences the way you write your application. We talk about a "framework" if that influence is significant.

So, for example I'd call Java's Reflection an API (if you use it, it's typically quite local), and Java's Swing GUI a framework (using it typically has quite an impact on larger aspects of your code).

A Library is a collection of reusable classes and/or functions.

A framework is a reusable software environment that provides functionality as part of a larger software platform.

Libraries and frameworks both have an API. The API is the surface area of any library or framework with which your software interacts; it is comprised of all of the definitions of the publicly-declared classes, methods and properties.
*/



/*
If we have libraries, we can directly import them in a language abnd make the method calls on function provided by the importd library. But if we decide to use REST api directly(the standard way), we have to us the provided endpoints and make http request on thos endpoints(urls) to get the job done. Using endpoints to access the API functions is the mopst used way as libraries are not available for everything. But we can always make our own api functions(based on our requirements) and release endpoints which can be used by other apps/softwares to interact with our app(inside which we have created our api, eg - we created REST api in our spring boot backend app, and our angular frontend angular app interacted with the backend using our released api endpoints.)
In almost all applications, front end interacts with backend app using the api endpoints. And in almost all applications, these api functions are defined in backend app(these functions itself comprise of backnd so when we say backend we actually mean code of these functions) and we release endpoints to these functions(ie api endpoints) so that other apps(frontend etc) can interact with our backend(ie interact with the functions written in backend).
*/
