import {Inject, Injectable} from '@angular/core';
import {
  LoadShoppingListFailed, LoadShoppingListSucceeded, ShoppingActions, ShoppingActionTypes, ShoppingItemUpdateSucceeded
} from './shopping.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';
import {ShoppingListManagementState} from './shopping.reducers';
import {DisplayError} from '../../../store';

@Injectable()
export class ShoppingListManagementEffects {
  constructor(private store: Store<ShoppingListManagementState>,
              private actions$: Actions <ShoppingActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService,
              private router: Router) {
  }

  @Effect()
  public loadShoppingItems$ = this.actions$.pipe(
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
  );

  @Effect()
  public saveShoppingiItem$ = this.actions$.pipe(
    ofType(ShoppingActionTypes.ItemPlacedInOrRemovedFromCart),
    switchMap((payload) => {

      return this.storeManagementService.updateShoppingItem(payload.update.id, payload.update.inCart).pipe(
        map((succeeded) => new ShoppingItemUpdateSucceeded(payload.update.storeId, payload.update.id)),
        catchError(error => {
          console.log('update shopping item failed');
          return [new DisplayError(error)];
        })
      );
    }),
  );
}
