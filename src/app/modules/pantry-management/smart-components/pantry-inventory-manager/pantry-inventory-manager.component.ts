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
import {PopoverController, ToastController} from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

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

  constructor(private store: Store<AppState>,
              private socialSharing: SocialSharing,
              private toastController: ToastController
              /*private popoverController: PopoverController, */) {
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

  private async onSuccess(result) {
    const toast = await this.toastController.create({message: 'List shared.', duration: 2000});
    await toast.present();
    console.log(`return from sharing ${JSON.stringify(result)}`);
  };

  private async onError(err) {
    const toast = await this.toastController.create({message: `Email failed to send with error: ${JSON.stringify(err)}.`, duration: 5000});
    await toast.present();
  };

  async presentSharingOptions(ev: any) {
    // const popover = await this.popoverController.create({
    //   component: ShareComponent,
    //   cssClass: 'my-custom-class',
    //   event: ev,
    //   translucent: true
    // });
    // return await popover.present();

      // this.events.publish('event data');

      await this.socialSharing.shareWithOptions({
        subject: 'Grocery shopping list',
        message: 'Grocery Shopping List (subject)',
      }).then(async r => await this.onSuccess(r)).catch(async err => await this.onError(err));

      // this.socialSharing.canShareViaEmail().then((canSend) => {
      //     if (canSend) {
      //       this.socialSharing.shareViaEmail('Grocery shopping list', 'Grocery Shopping List (subject)', [this.emailAddress]).then(async r => {
      //         const toast = await this.toastController.create({message: 'Email sent.', duration: 200});
      //         await toast.present();
      //       });
      //       return true;
      //     } else {
      //       console.log('Cannot send via email');
      //       return false
      //     }
      //   });
      // console.log('send and dismiss');
      // await this.popoverController.dismiss();
    }
}
