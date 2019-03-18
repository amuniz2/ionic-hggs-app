import {Injectable} from '@angular/core';
import {
  AddStoreAisleFailed,
  CreateStoreFailed, DeleteStoreFailed,
  LoadGroceryStoresFailed, NavigateToStoreDetailsPage, StoreAisleAdded, StoreCreated, StoreDeleted, StoreManagementActions,
  StoreManagerActionTypes,
  StoresLoadedSuccessfully
} from './store-management.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {PantryDataService} from '../../../services/pantry-data.service';
import {StoreManagementState} from './store-management.reducers';
import {NavigationExtras, Router} from '@angular/router';
import {selectGroceryStore} from './store-management.selectors';
import {pipe} from 'rxjs';
import {NavigateToEditStoreRequest} from '../dumb-components/store-list/store-list.component';

@Injectable()
export class StoreManagementEffects {
  constructor(private store: Store<StoreManagementState>,
              private actions$: Actions <StoreManagementActions>,
              private storeManagementService: PantryDataService,
              private router: Router) {
  }

  // @Effect()
  // public firstAction$: Observable<Action> = this.actions$.pipe(
  //   ofType( 'FIRST_ACTION' ),
  //   mapTo( new SecondAction() )
  // );

  @Effect()
  public loadGroceryStores$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.NavigatedToStoreListPage),
    switchMap(() => {
        return this.storeManagementService.getGroceryStores().pipe(
          map(data => new StoresLoadedSuccessfully({ groceryStores: data})),
          catchError(error => [new LoadGroceryStoresFailed(error)])
        );
    })
  );

  @Effect()
  public addNewGroceryStore$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.CreateStore),
    switchMap((payload) => {
      return this.storeManagementService.addGroceryStore(payload).pipe(
        map(newGroceryStore => new StoreCreated(newGroceryStore)),
        catchError(error => [new CreateStoreFailed(error)])
      );
    })
  );

  @Effect()
  public deleteGroceryStore$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.DeleteStore),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStore(payload).pipe(
        map(deletedGroceryStore => new StoreDeleted(deletedGroceryStore)),
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

  @Effect()
  public addNewStoreAisle$ = this.actions$.pipe(
    ofType(StoreManagerActionTypes.AddStoreAisle),
    switchMap((payload) => {
      return this.storeManagementService.addGroceryStoreAisle(payload.newStoreAisleRequest).pipe(
        tap((modStore) => console.log(modStore)),
        map(modifiedGroceryStore => new StoreAisleAdded(modifiedGroceryStore)),
        catchError(error => [new AddStoreAisleFailed(error)])
      );
    }));

}
