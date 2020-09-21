import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IProductInfoService} from './IProductInfoService';
import {BarcodeScanResult} from '@ionic-native/barcode-scanner';
import {Observable, of} from 'rxjs';

@Injectable()
export class ProductInfoService implements IProductInfoService {
  constructor(private httpClient: HttpClient) {
  }

  getProductInfo(data: BarcodeScanResult): Observable<any> {
    const url = 'https://product-data1.p.rapidapi.com/lookup';
    /*
xhr.open("GET", "https://product-data1.p.rapidapi.com/lookup?upc=30937302731");
xhr.setRequestHeader("x-rapidapi-host", "product-data1.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", "SIGN-UP-FOR-KEY");
     */
    const opts = {params: new HttpParams({fromString: `upc=${data.text}`})};
    return this.httpClient.get(url, opts);
  }
}
