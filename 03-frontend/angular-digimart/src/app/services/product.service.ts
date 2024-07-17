import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.digimartApiUrl + "/products";   
  // this is the URL from which angulars HttpClientModule will try to obtain JSON data. This JSON data will have list of products

  
  // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values basd on the environment in which w are runningm our app)

  private catgoryUrl = environment.digimartApiUrl  + "/product-category";
  // Http client modul will us this url to gt list of all ProductCategory objects from the spring boot rest api.


  constructor(private httpClient : HttpClient) { }


  // here we define the getProductList mthgod used inside product-list-component.ts and the getProductCategories method used inside product-category-menu-component.ts files.

  getProductList(theCategoryId : number) : Observable<Product[]>{
    
    //need to biuld url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
    
  }

  getProductCategories() : Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.catgoryUrl).pipe(map(response => response._embedded.productCategory));  
    // this productCatgory in  _embedded.productCategory is the same name as declared in GetResponseProductCatgory LHS belo.
    // the data returnd by spring boot rest api will be mapped to productCategories array. The returnd data will have objects corresponding to all product categories thatw e have in our database

  }


//below method is for pagination while displaying list of products based on category
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {

    console.log(`Getting products from - ${this.baseUrl}`);
    
    //need to biuld url based on category id, page number and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +  `&page=${thePage}&size=${thePageSize}`;
    // earlier when we were not passing page number and size through url, spring data rest as always rturning the 1st page with default size 20. With this modified url, it will rturn the rquested page of requested siz edepoending on passed values of page numbr and size.

    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
    
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    //need to biuld url based on the passed keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;


    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
    // will map the returned data to products array. The returnbed data will have all the product objects whose names contain the passed keyword "theKeyword".
    // This uses the same GetResponseProducts methos as usd by getProductList() method since in both of thse cases, we are getting a list of products only from the spring boot rest api.
  }


// below method is for pagination while searching by keyword
  SearchProductListPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    //need to biuld url based on keyword, page number and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;
    

    return this.httpClient.get<GetResponseProducts>(searchUrl);
    

  }

  getProduct(theProductId : number) : Observable<Product>{

    //need to build url based on the passed product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
    
  }




}

// note : getProductList() and searchProducts() methods were being used befor pagination support was added. Now we are using getProductListPaginate() and searcgProductListsPaginate() methods.

interface GetResponseProducts {
  _embedded : {
    products : Product[];
  },
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];   
  }
}


