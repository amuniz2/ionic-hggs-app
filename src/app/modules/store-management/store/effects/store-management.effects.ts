import {Inject, Injectable} from '@angular/core';
import {
  NavigatedToStoreDetailsPage,
  NavigateToStoreDetailsPage,
  StoreManagementActions,
  StoreManagerActionTypes,
} from '../store-management.actions';
import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {StoreManagementState} from '../store-management.reducers';
import {NavigationExtras, Router} from '@angular/router';
import {IPantryDataService} from '../../../../services/IPantryDataService';
import {
  AisleNameChanged,
  DeleteStoreFailed, DisplayError,
  GroceryStoreLocationsLoaded,
  LoadGroceryStoreLocations, SectionNameChanged,
  StoreCreated,
  StoreDeleted
} from '../../../../store';

@Injectable()
export class StoreManagementEffects {
  constructor(private store: Store<StoreManagementState>,
              private actions$: Actions <StoreManagementActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService,
              private router: Router) {
  }

  public addNewGroceryStore$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.CreateStore),
    switchMap((payload) => {
      return this.storeManagementService.addGroceryStore(payload.createGroceryStorePayload).pipe(
        map(newGroceryStore => new StoreCreated({
          ...newGroceryStore,
          sections: Array.from(newGroceryStore.sections),
          aisles: Array.from(newGroceryStore.aisles)})),
        catchError(error => {
          console.log('CreateStore failed');
          return [new DisplayError(error)];
          //
          // return [new CreateStoreFailed(error)];
        })
      );
    }),
  ));

  public deleteGroceryStore$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.DeleteStore),
    tap((payload) => console.log('Calling delete grocery store service', JSON.stringify(payload))),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStore(payload.deleteGroceryStorePayload).pipe(
        map(success => success ? new StoreDeleted(payload.deleteGroceryStorePayload.id) : null),
        catchError(error => [new DeleteStoreFailed(error)])
      );
    })
  ));

  public navigateToStoreDetailsPage$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.NavigateToStoreDetailsPage),
    tap((navigateToEditStorePage: NavigateToStoreDetailsPage) => {
      const navigationExtras: NavigationExtras = { queryParams: { id: navigateToEditStorePage.navigateToEditStorePayload.id} };
      this.router.navigate([this.router.url, 'store-details'], navigationExtras);
    })), 
    {dispatch: false });

  public navigatedToStoreDetailsPage$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.NavigatedToStoreDetailsPage),
    map((navigatedToEditStorePage: NavigatedToStoreDetailsPage) => {
      return new LoadGroceryStoreLocations(navigatedToEditStorePage.groceryStoreId);
    })));

  public loadGroceryStoreLocations$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.NavigatedToStoreDetailsPage),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreLocations(payload.groceryStoreId).pipe(
        map(success => new GroceryStoreLocationsLoaded(payload.groceryStoreId, success)),
        catchError(error => [new DisplayError(error)])
      );
    })));

  public updateSectionName$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.UpdateStoreSection),
    switchMap((payload) => {
      return this.storeManagementService.updateGroceryStoreSection(
        payload.updateRequest.groceryStoreId,
        payload.updateRequest.originalName,
        payload.updateRequest.aisleOrSectionName
      ).pipe(
        map((success) => new SectionNameChanged(payload.updateRequest))
      )
    })
  ));

  public updateAisleName$ = createEffect(() => this.actions$.pipe(
    ofType(StoreManagerActionTypes.UpdateStoreAisle),
    switchMap((payload) => {
      return this.storeManagementService.updateGroceryStoreAisle(
        payload.updateRequest.groceryStoreId,
        payload.updateRequest.originalName,
        payload.updateRequest.aisleOrSectionName
      ).pipe(
        map((success) => new AisleNameChanged(payload.updateRequest))
      )
    })
  ));
}
