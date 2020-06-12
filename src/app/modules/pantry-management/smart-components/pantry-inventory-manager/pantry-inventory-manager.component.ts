import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../../pantry-management/store/pantry-management.actions';
import * as fromSelectors from '../../store/pantry-management.selectors';
// tslint:disable-next-line:max-line-length
import {
  CreatePantryItemRequest,
  DeletePantryItemRequest,
  NavigateToEditPantryItemRequest
} from '../../../pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {PantryItem} from '../../../../model/pantry-item';
import {selectPantryItemsLoading} from '../../store/pantry-management.selectors';
import {LoadGroceryStores} from '../../../../store';
import {selectAllGroceryStores, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {ShareComponent} from '../../../shared-module/share-component/share.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-pantry-inventory-manager',
  templateUrl: './pantry-inventory-manager.component.html',
  styleUrls: ['./pantry-inventory-manager.component.scss']
})
export class PantryInventoryManagerComponent implements OnInit {
  title: string;
  pantryItems$: Observable<PantryItem[]>;
  pantryItemsLoading$: Observable<boolean>;
  error$: Observable<Error>;
  addingPantryItem$: Observable<boolean>;
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStoreState[]>;
  private showSharingOptions: boolean;

  constructor(private popoverController: PopoverController, private store: Store<AppState>) {
    this.title = 'Manage pantry items from page component';
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    console.log('dispatching NavigatedToPantryPage');
    this.store.dispatch(new fromActions.NavigatedToPantryPage());
    this.pantryItemsLoading$ = this.store.select(fromSelectors.selectPantryItemsLoading);
    this.groceryStores$ = this.store.select(selectAllGroceryStores);
    this.showSharingOptions = false;
  }

  ngOnInit() {
    // dispatch action that list has been navigated to
    this.pantryItems$ = this.store.select(fromSelectors.selectAllPantryItems);
    this.error$ = this.store.select(fromSelectors.selectPantryItemsError);
  }

  onDeletePantryItemRequest($event: DeletePantryItemRequest) {
    console.log('dispatching deletePantrItem event');
    console.log($event);
    this.store.dispatch(new fromActions.DeletePantryItem($event));
  }

  onAddStoreClick() {
    this.addingPantryItem$ = of(true);
    // console.log('dispatching createPantryItem event');
    // this.store.dispatch(new fromActions.CreatePantryItem({newItem: true, id: 0}));
  }

  onCreateItem($event: CreatePantryItemRequest) {
    this.addingPantryItem$ = of(false);
    if ($event.name) {
      this.store.dispatch(new fromActions.CreatePantryItem($event));
    }
  }

  onPantryItemModified($event: PantryItem) {
    this.store.dispatch(new fromActions.SavePantryItem($event));
  }

  onShopClick() {

  }

  groceryStoresExist() {

  }

  // async settingsPopover(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: SharingComponent,
  //     event: ev,
  //     componentProps: {page: 'Login'},
  //     cssClass: 'popover_class',
  //   });
  //
  //   /** Sync event from popover component */
  //   //   this.events.subscribe(''fromPopoverEvent', () => {
  //   //   this.syncTasks();
  //   // });
  //   return await popover.present();
  // }

  async presentSharingOptions(ev: any) {
    const popover = await this.popoverController.create({
      component: ShareComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
