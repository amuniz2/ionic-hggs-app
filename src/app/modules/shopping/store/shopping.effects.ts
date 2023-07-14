import {Inject, Injectable} from '@angular/core';
import {
  LoadShoppingListFailed,
  LoadShoppingListSucceeded,
  ShoppingActions,
  ShoppingActionTypes,
  ShoppingItemUpdateSucceeded, UpdateStoreShoppingList
} from './shopping.actions';
import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';
import {ShoppingListManagementState} from './shopping.reducers';
import {DisplayError} from '../../../store';
import {
  CreateItemFailed,
  LoadPantryItemLocations,
  PantryItemCreated,
  PantryItemLoaded,
  PantryLoadFailed
} from '../../pantry-management/store/pantry-management.actions';
import {PantryItem} from '../../../model/pantry-item';

@Injectable()
export class ShoppingListManagementEffects {
  constructor(private store$: Store<ShoppingListManagementState>,
              private actions$: Actions <ShoppingActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService,
              private router: Router) {
  }

  public loadShoppingItems$ = createEffect(() => this.actions$.pipe(
    ofType(ShoppingActionTypes.LoadShoppingList),
    switchMap((payload) => {
      return this.storeManagementService.getShoppingList(payload.storeId).pipe(
        map((shoppingList) => new LoadShoppingListSucceeded(payload.storeId, shoppingList)),
        catchError(error => {
          console.log('getPantryItemsNeeded failed');
          return [new LoadShoppingListFailed(payload.storeId, error)];
        })
      );
    }),
  ));

  public updateShoppingList = createEffect(() => this.actions$.pipe(
    ofType(ShoppingActionTypes.UpdateStoreShoppingList),
    switchMap((payload) => {
      return this.storeManagementService.getShoppingList(payload.storeId).pipe(
        map((shoppingList) => new LoadShoppingListSucceeded(payload.storeId, shoppingList)),
        catchError(error => {
          console.log('getPantryItemsNeeded failed');
          return [new LoadShoppingListFailed(payload.storeId, error)];
        })
      );
    }),
  ));

  public saveShoppingiItem$ = createEffect(() => this.actions$.pipe(
    ofType(ShoppingActionTypes.ItemPlacedInOrRemovedFromCart),
    switchMap((payload) => {

      return this.storeManagementService.updateShoppingItem(payload.update.storeId, payload.update.id, payload.update.inCart).pipe(
        map((shoppingItem) => new ShoppingItemUpdateSucceeded(payload.update.storeId, shoppingItem)),
        catchError(error => {
          console.log('update shopping item failed');
          return [new DisplayError(error)];
        })
      );
    }),
  ));

  public getShoppingItemDetails$ = createEffect(() => this.actions$.pipe(
    ofType(ShoppingActionTypes.NavigatedToShoppingItemPage),
    switchMap(payload => this.storeManagementService.getPantryItem(payload)),
    switchMap((x) => {
      return [
        new PantryItemLoaded(x),
        new LoadPantryItemLocations(x.id),
      ];
    }),
    catchError(err => [new PantryLoadFailed(err)])
  ));

  public createShoppingItemInStore$ = createEffect(() => this.actions$.pipe(
    ofType(ShoppingActionTypes.CreateShoppingItemForNewPantryItem),
    switchMap((payload) => {
      console.log('calling addShoppingItemInNewLocation');
      return this.storeManagementService.addShoppingItemInNewLocation( {
        ...new PantryItem(),
        name: payload.request.name,
      }, {
          id: null,
          storeName: null,
          storeId: payload.request.storeId,
          aisle: payload.request.aisle,
          section: payload.request.section
      }).pipe(
        switchMap(itemAdded => [
          new UpdateStoreShoppingList( payload.request.storeId),
          new PantryItemCreated({
            ...itemAdded,
            locations: [ {
              ...itemAdded.location,
              id: itemAdded.location.locationId,
              storeId: payload.request.storeId,
              storeName: ''
            }],
            id: itemAdded.pantryItemId,
            quantityNeeded: itemAdded.quantity,
            defaultQuantity: itemAdded.quantity,
            need: true,
            selectByDefault: payload.request.selectByDefault,            
          })]
        ),
        catchError(error => [new CreateItemFailed(payload.request.name, error)])
      );
    })));
}
