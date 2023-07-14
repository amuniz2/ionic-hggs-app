import {Component, Inject, OnInit} from '@angular/core';
import {SelectStore} from '../../../../store';
import {
  selectAllGroceryStores,
  selectCurrentGroceryStore,
  selectGroceryStoresLoading
} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable, of} from 'rxjs';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {
  CreateShoppingItemForNewPantryItem,
  CreateShoppingItemRequest,
  ItemPlacedInOrRemovedFromCart,
  LoadShoppingList
} from '../../store/shopping.actions';
import {ShoppingItem} from '../../../../model/shopping-item';
import {selectCurrrentStoreShoppingItem, selectStoreShoppingItems,} from '../../store/shopping.selectors';
import {
  AddPantryItemToStoreShoppingList,
  StoreShoppingItemUpdate
} from '../../dumb-components/shopping-item-list/shopping-item-list.component';
import {withLatestFrom} from 'rxjs/operators';
import {EditItemLocationRequest} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';
import {EditPantryItemLocationRequest} from '../../../pantry-management/store/pantry-management.actions';
import {Router} from '@angular/router';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ToastController} from '@ionic/angular';
import {IGroceryDataExporter, ShoppingListFormat} from '../../../../services/grocery-data-exporter.service';
import {ShoppingList} from '../../../../model/shopping-list';
import { htmlToText } from 'html-to-text';

export class AddShoppingItemRequest {
  public itemId: number;
  public storeId: number;
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStoreState[]>;
  shoppingItems$: Observable<ShoppingItem[]>;
  shoppingStore$: Observable<GroceryStoreState>;
  addingShoppingItem$: Observable<boolean>;
  addingShoppingItemInAisle$: Observable<string>;
  currentShoppingItem$: Observable<ShoppingItem>;

  selectedStore: GroceryStore;

  private shoppingList: ShoppingList;
  protected filterList: boolean;
  filter: string;
  currentPantryItemId: number;

  constructor(private store: Store<AppState>, private router: Router,
              private socialSharing: SocialSharing,
              private toastController: ToastController,
              @Inject('IGroceryDataExporter') private exporter: IGroceryDataExporter) {
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(selectAllGroceryStores);
  }

  ngOnInit() {
    console.log('in shopping-list-component.ngOnInit()');
    this.addingShoppingItem$ = of(false);
    this.addingShoppingItemInAisle$ = of(null);
    this.shoppingStore$ = this.store.select(selectCurrentGroceryStore());
    this.shoppingStore$.pipe(
      withLatestFrom(store => {
        this.selectedStore = {
          ...store,
          aisles: new Set(store.aisles),
          sections: new Set(store.sections)
        };
        this.shoppingItems$ = this.store.select(selectStoreShoppingItems(this.selectedStore?.id));
        this.currentShoppingItem$ = this.store.select(selectCurrrentStoreShoppingItem(this.selectedStore?.id, this.currentPantryItemId));
      }));
    
  }

  onGroceryStoreSelected($event: GroceryStore) {
    this.store.dispatch(new SelectStore($event.id));
    this.selectedStore = $event;
    this.store.dispatch(new LoadShoppingList(this.selectedStore?.id));
    this.shoppingItems$ = this.store.select(selectStoreShoppingItems(this.selectedStore?.id));
  }

  onItemPlacedInOrRemovedFromCart($event: StoreShoppingItemUpdate) {
    this.currentPantryItemId = $event.id;
    this.store.dispatch(new ItemPlacedInOrRemovedFromCart($event))
  }

  filterItems() {
    this.filterList = true;
  }

  cancelFilter() {
    this.filterList = false;
  }

  onItemLocationChangeRequested($event: EditItemLocationRequest) {
    this.store.dispatch((new EditPantryItemLocationRequest($event, this.router.routerState.snapshot.url)));
  }

  onAddShoppingItemClick() {
    this.addingShoppingItem$ = of(true);

    // ?
    // this.store.dispatch(new AddNewShoppingItem( { itemId: this., storeId: this.selectedStore.id});
  }

  onAddShoppingItemInAisleClick(request: CreateShoppingItemRequest) {
    this.addingShoppingItemInAisle$ = of(request.aisle);
    // this.store.dispatch(new CreatePantryItem(
    //   {name: request.name, initialStoreLocation:
    //       { storeName: '', id: 0, storeId: request.storeId, aisle: request.aisle}}));
  }

  onCreateShoppingItem($event: CreateShoppingItemRequest) {
    this.addingShoppingItem$ = of(false);
    this.addingShoppingItemInAisle$ = of(null);
    if ($event.name) {
      const request = {
        name: $event.name,
        aisle: $event.aisle,
        storeId: this.selectedStore?.id,
        section: $event.section,
        selectByDefault: false // todo: is this correct?
      };
      this.store.dispatch(new CreateShoppingItemForNewPantryItem(request));
    }
  }

  onAddPantryItemToStoreShoppingList($event: AddPantryItemToStoreShoppingList) {
    this.addingShoppingItem$ = of(true);
    // this.store.dispatch(new CreateShoppingItemForNewPantryItem({
    //   name: $event.name,
    //   aisle: $event.aisle.name,
    //   storeId: this.selectedStore.id
    // }));
  }

  onCancelAddShoppingItem($event: GroceryStoreLocation) {
    this.addingShoppingItemInAisle$ = of(null);
    this.addingShoppingItem$ = of(false);
  }

  private async onSuccessExport(result) {
    const toast = await this.toastController.create({message: 'List shared.', duration: 2000});
    await toast.present();
  };

  private async onExportError(err) {
    const toast = await this.toastController.create({
      message: `Email failed to send with error: ${JSON.stringify(err)}.`,
      duration: 10000
    });
    await toast.present();
  };

  async presentSharingOptions() {
    this.exporter.exportShoppingList(this.shoppingList, ShoppingListFormat.Html).subscribe(ret => {
      console.log(`shopping list file name returned: ${ret.fileName}`)
      this.socialSharing.shareWithOptions({
        subject: 'Grocery shopping list',
        chooserTitle: 'Select how to send shopping list',
        message: htmlToText(ret.contents, {
          wordwrap: 130
        })
        // files: ret.fileName
      }).then(async r => await this.onSuccessExport(r)).catch(async err => await this.onExportError(err));
    });


   //  const listToShare = this.exporter.exportShoppingList(this.shoppingList, ShoppingListFormat.Html);
   // // const listToShare = `Shopping List\n${this.exporter.exportShoppingList(this.shoppingList, ShoppingListFormat.Html)}`;
   //  console.log('calling shareWithOptions');
   //  this.socialSharing.shareWithOptions({
   //    subject: 'Grocery shopping list',
   //    chooserTitle: 'Select how to send shopping list',
   //    message: listToShare,
   //    files: []
   //  })
   //    .then(async r => {
   //      await this.onSuccessExport(r)
   //    })
   //    .catch(async err => await this.onExportError(err));
  }

  updateShoppingList($event: ShoppingList) {
    this.shoppingList = $event;
  }
}
