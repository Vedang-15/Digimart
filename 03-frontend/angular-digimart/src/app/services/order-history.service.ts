import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.digimartApiUrl + "/orders";
  // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values basd on the environment in which w are runningm our app)

  constructor(private httpClient : HttpClient) { }

  getOrderHistory(theEmail : string) : Observable<GetResponseOrderHistory>{

    //build the url based on the email passed to this method
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);   // calling the REST API using constructed URL
  }

}

interface GetResponseOrderHistory {
  _embedded : {
    orders : OrderHistory[];  // Here we are mapping the JSON data returned by spring boot api top an OrderHistory array and this mapped data will be assigned to orderHistory array (orderHistoryList) defined in order-history-aomponent.ts file(inside the subscription part).
  }

}



