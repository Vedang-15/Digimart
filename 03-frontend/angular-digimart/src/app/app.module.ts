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









