import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated : boolean = false;
  userFullName : string = "";
  
  storage : Storage = sessionStorage;

  constructor(private oktaAuthService : OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth : OktaAuth) { }

  ngOnInit(): void {

    //subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    
    if(this.isAuthenticated){
      //Fetch the logged in users details

      //users full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;

          //retreive the users email from authentication response
          const theEmail = res.email;

          //now store the email in browser storage. This stored email will be retreived/used later the by OrderHistoryComponent.
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      )
    }
  }

  logout(){

    // terminates the session and removs current tokens
    this.oktaAuth.signOut();
  }

}
