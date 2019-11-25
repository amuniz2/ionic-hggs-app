import {Inject, Injectable} from '@angular/core';
import {
  DeleteStoreFailed,
  NavigateToStoreDetailsPage,
  StoreCreated,
  StoreDeleted,
  StoreManagementActions,
  StoreManagerActionTypes,
  CreateStoreFailed
} from './store-management.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {StoreManagementState} from './store-management.reducers';
import {NavigationExtras, Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';

@Injectable()
export class StoreManagementEffects {
  constructor(private store: Store<StoreManagementState>,
              private actions$: Actions <StoreManagementActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService,
              private router: Router) {
  }

  // @Effect()
  // public firstAction$: Observable<Action> = this.actions$.pipe(
  //   ofType( 'FIRST_ACTION' ),
  //   mapTo( new SecondAction() )
  // );

  @Effect()
  public addNewGroceryStore$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.CreateStore),
    tap((payload) => console.log('Payload to addNewStore$ ' + JSON.stringify(payload))),
    switchMap((payload) => {
      console.log('calling stateManagementService.addGroceryStore()');
      return this.storeManagementService.addGroceryStore(payload.createGroceryStorePayload).pipe(
        tap((something) => console.log(
          'return from addGroceryStore, dispatching StoreCreated' + JSON.stringify(something))),
        map(newGroceryStore => new StoreCreated(newGroceryStore)),
        catchError(error => {
          console.log('CreateStore failed');
          return [new CreateStoreFailed(error)];
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

  // @Effect()
  // public storeAisleAdded$ = this.action$.pipe(
  //   ofType(StoreManagerActionTypes.StoreAisleAdded),
  //   map((payload) => new LoadGroceryStoreAisles())); // (app action)
}
