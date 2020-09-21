import {BarcodeScanResult} from '@ionic-native/barcode-scanner/ngx';
import {Observable} from 'rxjs';

export interface IProductInfoService {
  getProductInfo(data: BarcodeScanResult): Observable<string>;
}
