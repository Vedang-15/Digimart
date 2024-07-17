import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  totalPrice : Subject<number> = new BehaviorSubject<number>(0); // Subject is a subclass of Observable. We can use Subject to publish events in our code. The event will be sent to all of the subscribers.

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage : Storage = localStorage;

  constructor() {

    // read the data from the browsers session storage an populate the above declared cartItems with the data(ie the value crresponding to the key 'cartItems') present in the browsers session storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);  // JSON.parse converts the data pbtained from storage(using the key 'cartItems'), into an object. The data is present as a string in the storage hence we convrt it to an object after rtreival.

    if(data != null){
      this.cartItems = data;

      //compute totals based on the data retreived from storage
      this.computeCartTotals();  
      
    }
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); 
  }


  addToCartHelper(theCartItem : CartItem){
    
    // check if we already have the item in our cart
    let alreadyExistsInCart : boolean = false;
    let existingCartItem : CartItem = undefined!;

    if(this.cartItems.length > 0){
      // find the item in cart based on item id;
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id == theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
    }

    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);
    if(alreadyExistsInCart){
      existingCartItem.quantity++;
      
    }
    else{
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and quantity
    this.computeCartTotals();
  }


  computeCartTotals() {
    // compute the total values
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += (currentCartItem.quantity * currentCartItem.unitPrice);
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values, all subscribers will recive the new data.
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    

    //persist the cart data
    this.persistCartItems();

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue : number, totalQuantityValue : number) {
    console.log("contents of the cart : ");
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name : ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice = ${tempCartItem.unitPrice}, subtotalprice : ${subTotalPrice}`);

    }
    console.log(`totalPrice : ${totalPriceValue.toFixed(2)}, totalQuantity = ${totalQuantityValue}`);
    console.log("------------------");
  }

  decrementFromCartHelper(theCartItem : CartItem){

   

    theCartItem.quantity--;

    if(theCartItem.quantity == 0){
      this.removeFromCartHelper(theCartItem);
    }
    else{
      this.computeCartTotals();
      // since we are decrementing an item, we again need to calculate total price and quantity and publish it to all subscribers so that they can update this info in their respective component views.
    }
  }

  removeFromCartHelper(theCartItem : CartItem){  
    // since objects are passd by refernec in typescript, this theCartItem that was passed, is actually the same item which is present in array.

    // get the index of this item in array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id == theCartItem.id);

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
      // since we are removing an item, we again need to calculate total price and quantity and publish it to all subscribers so that they can update this info in their respective component views.
    }

  }

  
}


