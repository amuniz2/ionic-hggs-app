import {Inject, Injectable} from '@angular/core';
import {
  LoadShoppingList, LoadShoppingListFailed, LoadShoppingListSucceeded, ShoppingActions, ShoppingActionTypes
} from './shopping.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {NavigationExtras, Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';
import {ShoppingListManagementState} from './shopping.reducers';
import {CreateStoreFailed} from '../../../store';
import {ShoppingItem} from '../../../model/pantry-item';
import {of} from 'rxjs';

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
      return this.storeManagementService.getPantryItemsNeeded(payload.storeId).pipe(
        map(pantryItem => {
          pantryItem: pantryItem,
            inCart: false,
        }),
        switchMap((shoppingItems: ShoppingItem[]) => of(new LoadShoppingListSucceeded(payload.storeId, shoppingItems))),
        catchError(error => {
          console.log('getPantryItemsNeeded failed');
          return [new LoadShoppingListFailed(payload.storeId, error)];
        })
      );
    }),
  );

  @Effect()
  public deleteGroceryStore$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.DeleteStore),
    tap((payload) => console.log('Payload to deleteGroceryStore ' + JSON.stringify(payload))),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStore(payload.deleteGroceryStorePayload).pipe(
        map(success => new StoreDeleted(payload.deleteGroceryStorePayload.id)),
        catchError(error => [new DeleteStoreFailed(error)])
      );
    })
  );

  @Effect({ dispatch: false })
  public navigateToStoreDetailsPage$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.NavigateToStoreDetailsPage),
    tap((navigateToEditStorePage: NavigateToStoreDetailsPage) => {
      const navigationExtras: NavigationExtras = { queryParams: { id: navigateToEditStorePage.navigateToEditStorePayload.id} };
      this.router.navigate([this.router.url, 'store-details'], navigationExtras);
    }));
}
