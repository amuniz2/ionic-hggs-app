import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IProductInfoService} from './IProductInfoService';
import {Observable, of} from 'rxjs';
import {BarcodeScanResult} from '@ionic-native/barcode-scanner';
import {ProductInfo} from '../modules/pantry-management/smart-components/edit-pantry-item/edit-pantry-item.component';

@Injectable()
export class FakeProductInfoService implements IProductInfoService {
  constructor() {
  }

  getProductInfo(data: BarcodeScanResult): Observable<any> {
    const url = 'https://barcode-lookup.p.rapidapi.com/v2/products';

    return of({ products: [
        {
          product_name: `name for ${data.text}`,
          description: `description for ${data.text}`,
          images: [ 'imageUrl']
        }
      ]});
  }

  convertToProductData(data: any): ProductInfo[] {
    const result: ProductInfo[] = []
    if (!!!data.products || data.products.length === 0) {
      return result;
    }
    data.products.forEach(product => result.push({
      name: product.product_name,
      description: product.description,
      imageUri: !!product.images && product.images.length > 0 ? product.images[0] : ''
    }));

    console.log('product data: ', result);
    return result;
  }
}
