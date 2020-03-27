import {Inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  AppActions,
  AppActionTypes,
  DatabaseOpenFailed,
  FinishAppInitializer,
  LoadGroceryStoreAisles,
  LoadGroceryStoreSections,
  GroceryStoreAislesLoaded,
  LoadGroceryStoresFailed,
  StoresLoadedSuccessfully,
  StoreAisleAdded,
  AddStoreAisleFailed,
  GroceryStoreAisleDeleted,
  DeleteStoreAisleFailed,
  GroceryStoreSectionAdded,
  AddGroceryStoreSectionFailed,
  GroceryStoreSectionDeleted,
  DeleteGroceryStoreSectionFailed, GroceryStoreSectionsLoaded, DisplayError, LoadGroceryStoreLocations
} from '../store/app.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AppState} from './app.state';
import {IPantryDataService} from '../services/IPantryDataService';
import {
  GetStoreAislesFailed, GetStoreSectionsFailed
} from '../modules/store-management/store/store-management.actions';
import {of} from 'rxjs';
import {colors} from '@angular-devkit/core/src/terminal';

@Injectable()
export class AppEffects {
  constructor(private store: Store<AppState>,
              private actions$: Actions<AppActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService) {
  }

  @Effect()
  public openDatabase$ = this.actions$.pipe(
    ofType(AppActionTypes.StartAppInitializer),
    switchMap(() => {
      return this.storeManagementService.initialize().pipe(
        map((success) => new FinishAppInitializer()),
        // map(data => new DatabaseOpenedSuccessfully({groceryStores: data})),
        catchError(error => [new DatabaseOpenFailed(error)])
      );
    }));

  @Effect()
  public loadGroceryStores$ = this.actions$.pipe(
    ofType(AppActionTypes.LoadGroceryStores),
    switchMap(() => {
      return this.storeManagementService.getGroceryStores().pipe(
        tap(data => {
          console.log('grocery stores returned: ');
          console.log(data);
        }),
        map(data => new StoresLoadedSuccessfully(data)),
        catchError(error => [new LoadGroceryStoresFailed(error)])
      );
    })
  );

  @Effect()
  public loadGroceryStoresAislesAndSections$ = this.actions$.pipe(
    ofType(AppActionTypes.LocationGroceryStoreSelected),
    switchMap((payload) => {
      return [
        new LoadGroceryStoreAisles(payload.storeId),
        new LoadGroceryStoreSections(payload.storeId),
      ];
    })
  );

  @Effect()
  public getStoreAisles$ = this.actions$.pipe(
    ofType(AppActionTypes.LoadStoreAisles),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreAisles(payload.groceryStoreId).pipe(
        tap((aisles) => {
          console.log(`aisles: ${aisles}`);
        }),
        map(aisles => new GroceryStoreAislesLoaded( { groceryStoreId: payload.groceryStoreId, aisles })),
        catchError(error => [new GetStoreAislesFailed(error)])
      );
    }));

  @Effect()
  public getGroceryStoreSections$ = this.actions$.pipe(
    ofType(AppActionTypes.LoacGroceryStoreSections),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreSections(payload.groceryStoreId).pipe(
        tap((sections) => {
          console.log(`sections: ${sections}`);
        }),
        map(sections => new GroceryStoreSectionsLoaded( { groceryStoreId: payload.groceryStoreId, sections })),
        catchError(error => [new GetStoreSectionsFailed(error)])
      );
    }));

  @Effect()
  public addNewStoreAisle$ = this.actions$.pipe(
    ofType(AppActionTypes.AddStoreAisle),
    switchMap((payload) => {
      return this.storeManagementService.addGroceryStoreAisle(payload.newStoreAisleRequest).pipe(
        tap((aisleAdded) => {
          console.log(`aisleAdded: ${aisleAdded}`);
        }),
        map(aisleAdded => new StoreAisleAdded( { groceryStoreId: payload.newStoreAisleRequest.groceryStoreId, newAisle: aisleAdded })),
        catchError(error => [new AddStoreAisleFailed(error)])
      );
    }));

  @Effect()
  public deleteStoreAisle$ = this.actions$.pipe(
    ofType(AppActionTypes.DeleteStoreAisle),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStoreAisle(payload.deleteStoreAisleRequest).pipe(
        tap((aisleDeleted) => {
          console.log(`aisleDeleted: ${aisleDeleted}`);
        }),
        map(aisleDeleted => new GroceryStoreAisleDeleted( {
          groceryStoreId: payload.deleteStoreAisleRequest.groceryStoreId,
          aisle: payload.deleteStoreAisleRequest.name })));
    }),
    catchError(error => {
      return of(new DisplayError(error));
    }));

  @Effect()
  public addNewGroceryStoreSection$ = this.actions$.pipe(
    ofType(AppActionTypes.AddGroceryStoreSection),
    switchMap((payload) => {
      return this.storeManagementService.addGroceryStoreSection(payload.newGroceryStoreSectionRequest).pipe(
        tap((sectionAdded) => {
          console.log(`sectionAdded: ${sectionAdded}`);
        }),
        map(sectionAdded => new GroceryStoreSectionAdded( {
          groceryStoreId: payload.newGroceryStoreSectionRequest.groceryStoreId,
          newSection: sectionAdded })),
        catchError(error => [new AddGroceryStoreSectionFailed(error)])
      );
    }));

  @Effect()
  public deleteGroceryStoreSection$ = this.actions$.pipe(
    ofType(AppActionTypes.DeleteGroceryStoreSection),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStoreSection({
        groceryStoreId: payload.deleteGroceryStoreSectionRequest.groceryStoreId,
        name: payload.deleteGroceryStoreSectionRequest.name}).pipe(
        tap((sectionDeleted) => {
          console.log(`sectionDeleted: ${sectionDeleted}`);
        }),
        map(sectionDeleted => new GroceryStoreSectionDeleted( {
          groceryStoreId: payload.deleteGroceryStoreSectionRequest.groceryStoreId,
          section: payload.deleteGroceryStoreSectionRequest.name })),
        catchError(error => [new DeleteGroceryStoreSectionFailed(error)])
      );
    }));

  @Effect()
  public updateStoreAisle$ = this.actions$.pipe(
    ofType(AppActionTypes.UpdateAisle),
    switchMap((payload) => {
      return this.storeManagementService.updateGroceryStoreAisle(
        payload.updateRequest.groceryStoreId,
        payload.updateRequest.originalName,
        payload.updateRequest.aisleOrSectionName).pipe(
            switchMap(aisleUpdated => [
              new LoadGroceryStoreAisles(payload.updateRequest.groceryStoreId),
              new LoadGroceryStoreLocations(payload.updateRequest.groceryStoreId)
            ]));
        }),
    catchError(error => {
      return of(new DisplayError(error));
    }));

  @Effect({ dispatch: false})
  public displayError$ = this.actions$.pipe(
    ofType(AppActionTypes.DisplayError),
    tap((payload) => {
      window.alert(payload.error);
    })
  );
}
