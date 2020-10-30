import {Observable, of} from 'rxjs';
import {Component, Inject, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {selectPantryItem, selectPantryItemLocations, selectPantryItemsError} from '../../store/pantry-management.selectors';
import {PantryItem} from '../../../../model/pantry-item';
import * as fromActions from '../../../pantry-management/store/pantry-management.actions';
import {NavigatedToPantryItemPage, PantryItemInfoScanned} from '../../store/pantry-management.actions';
import {EditItemLocationRequest, NewItemLocationRequest} from '../../dumb-components/pantry-item-locations/pantry-item-locations.component';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {GroceryStoreState} from '../../../../model/grocery-store';
import {selectAllGroceryStores} from '../../../../store/store-management.selectors';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {IProductInfoService} from '../../../../services/IProductInfoService';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';

export interface ProductInfo {
  name: string;
  description: string;
  imageUri: string;
}

@Component({
  selector: 'app-edit-pantry-item',
  templateUrl: './edit-pantry-item.component.html',
  styleUrls: ['./edit-pantry-item.component.scss']
})
export class EditPantryItemComponent implements OnInit {
  pantryItemId: number;
  groceryStores$: Observable<GroceryStoreState[]>;
  pantryItem$: Observable<PantryItem>;
  pantryItemLocations$: Observable<GroceryStoreLocation[]>;
  isNewItem: boolean;
  error$: Observable<Error>;

  constructor(private store: Store<AppState>,
              private router: Router,
              private location: Location,
              private scanner: BarcodeScanner,
              @Inject('IProductInfoService') private productInfoService: IProductInfoService) {
    this.isNewItem = this.router.getCurrentNavigation().extras.queryParams.newItem;
    this.pantryItemId = this.router.getCurrentNavigation().extras.queryParams.id;
    this.groceryStores$ = this.store.pipe(select(selectAllGroceryStores));
    if (this.isNewItem) {
      this.pantryItem$ = of({
        ...new PantryItem(),
        need: true,
      });
    } else {
      this.store.dispatch(new NavigatedToPantryItemPage(this.pantryItemId));
      this.pantryItem$ = this.store.pipe(select(selectPantryItem(this.pantryItemId)));
      this.pantryItemLocations$ = this.store.pipe(select(selectPantryItemLocations(this.pantryItemId)));
    }
    this.error$ = this.store.pipe(select(selectPantryItemsError));
  }

  ngOnInit() {
  }

  savePantryItemChanges($event: PantryItem) {
    this.store.dispatch(new fromActions.SavePantryItem($event));
  }

  addPantryItem($event: PantryItem) {
    $event.name = this.htmlEncode($event.name);
    $event.description = this.htmlEncode($event.description);
    this.store.dispatch(new fromActions.SaveNewPantryItem($event));
  }
  htmlEncode(str: string): string {
    return str;
    // return str
    //   .replace(/&/g, '&amp;')
    //   .replace(/"/g, '&quot;')
    //   .replace(/'/g, '&#39;')
    //   .replace(/</g, '&lt;')
    //   .replace(/>/g, '&gt;');
  }

  addPantryItemLocation($event: NewItemLocationRequest) {
    this.store.dispatch(new fromActions.AddPantryItemLocationRequest($event, this.router.routerState.snapshot.url));
  }

  editPantryItemLocation($event: EditItemLocationRequest) {
    if ($event.action === UiCrudAction.Update) {
      console.log('recieved update notification, dispatching edit event')
      this.store.dispatch(new fromActions.EditPantryItemLocationRequest($event, this.router.routerState.snapshot.url));
    } else {
      console.log('recieved delete notification, dispatching delete event')
      this.store.dispatch((new fromActions.DeletePantryItemLocation($event)));
    }
  }

  onDeletePantryItem() {
    this.store.dispatch(new fromActions.DeletePantryItem({id: this.pantryItemId}));
    this.location.back();
  }

  onScanBarcode() {
    this.scanner.scan().then(barcodeData => {
      this.productInfoService.getProductInfo(barcodeData).subscribe((productInfo) => {
        console.log(productInfo);
        const scannedProductInfo = this.productInfoService.convertToProductData(productInfo);
        this.store.dispatch(new PantryItemInfoScanned(this.pantryItemId, scannedProductInfo));
        },
        (error) => console.log('error: ', error));
    }).catch(err => {
      console.log('Error', err);
    });
  }
}
