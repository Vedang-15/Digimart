import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {


  orderHistoryList : OrderHistory[] = [];
  storage : Storage = sessionStorage;

  constructor(private orderHistoryService : OrderHistoryService) { }

  ngOnInit(): void {

    this.handleOrderHistory();
  }

  handleOrderHistory() {
    
    // read the users email from the session storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    //retreive data from orderHistoryService
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data=>{
        
        this.orderHistoryList = data._embedded.orders; 
        console.log("List");
        console.log(this.orderHistoryList);  // here we are assigning the data returned by orderHistoryService to our orderHistoryList.orderHistoryService itself got the data from spring boot api. The service then mapped the JSON data(that it received from spring boot api) to an OrderHistory array(this happened inside the defined interface), and sent the mapped data to this order-history-component.ts file(when we made a call to service). Once we receivd the mapped data(ie the data mapped to a OrderHistory array), we simply assigned it to orderHistoryList defined here.
      }
    );
  }

}
