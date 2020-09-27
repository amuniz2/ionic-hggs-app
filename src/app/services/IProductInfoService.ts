import {BarcodeScanResult} from '@ionic-native/barcode-scanner/ngx';
import {Observable} from 'rxjs';
import {ProductInfo} from '../modules/pantry-management/smart-components/edit-pantry-item/edit-pantry-item.component';

export interface IProductInfoService {
  getProductInfo(data: BarcodeScanResult): Observable<string>;
  convertToProductData(data: any): ProductInfo[];
}
