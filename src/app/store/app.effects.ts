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
  DeleteGroceryStoreSectionFailed,
  GroceryStoreSectionsLoaded,
  DisplayError,
  LoadGroceryStoreLocations,
  LoadGroceryStores,
  LoadImportedData,
  GroceryStoresImportedSuccessfully, SelectStore, GroceryStoreLocationsLoaded
} from '../store/app.actions';
import {catchError, concatAll, map, switchMap, tap} from 'rxjs/operators';
import {AppState} from './app.state';
import {IPantryDataService} from '../services/IPantryDataService';
import {
  GetGroceryStoreLocationsFailed,
  GetStoreAislesFailed, GetStoreSectionsFailed
} from '../modules/store-management/store/store-management.actions';
import {forkJoin, of, throwError} from 'rxjs';
import {GroceryStoreState} from '../model/grocery-store';
import {
  LoadPantryItems,
  PantryImportedSuccessfully,
  PantryLoadedSuccessfully,
  PantryLoadFailed
} from '../modules/pantry-management/store/pantry-management.actions';
import {Router} from '@angular/router';

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
        map((success) => {
          if (success) {
            console.log('Pantry Data Management Service is initialized.');
          } else {
            console.log('Pantry Data Management Service failed to initialize.');
            // throwError('Pantry Data Management Service failed to initialize.');
          }
          return new FinishAppInitializer();
        }),
        // map(data => new DatabaseOpenedSuccessfully({groceryStores: data})),
        catchError(error => [new DatabaseOpenFailed(error)])
      );
    }));

  @Effect()
  public loadData = this.actions$.pipe(
    ofType(AppActionTypes.FinishAppInitializer),
    switchMap(() => {
        return [
          new LoadPantryItems(),
          new LoadGroceryStores()
        ];
      }
    ));

  @Effect()
  public loadGroceryStores$ = this.actions$.pipe(
    ofType(AppActionTypes.LoadGroceryStores),
    tap(x => console.log('calling service getGroceryStores()')),
    switchMap(() => {
      return this.storeManagementService.getGroceryStores().pipe(
        map(data => {
          const stateData: GroceryStoreState[] = data.map(x => {
                return {
                  ...x,
                  aisles: Array.from(x.aisles),
                  sections: Array.from(x.sections),
                };
          });
          return new StoresLoadedSuccessfully(stateData);
        }),
        catchError(error => [new LoadGroceryStoresFailed(error)])
      );
    })
  );

  @Effect()
  public loadGroceryStoresAislesAndSections$ = this.actions$.pipe(
    ofType(AppActionTypes.LocationGroceryStoreSelected),
    switchMap((payload) => {
      return [
        new SelectStore(payload.storeId),
        new LoadGroceryStoreAisles(payload.storeId),
        new LoadGroceryStoreSections(payload.storeId),
        new LoadGroceryStoreLocations(payload.storeId)
      ];
    })
  );

  @Effect()
  public getStoreLocations$ = this.actions$.pipe(
    ofType(AppActionTypes.LoadGroceryStoreLocations),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreLocations(payload.groceryStoreId).pipe(
        map(locations => new GroceryStoreLocationsLoaded( payload.groceryStoreId,
          locations)),
        catchError(error => [new GetGroceryStoreLocationsFailed(error)])
      );
    }));

  @Effect()
  public getStoreAisles$ = this.actions$.pipe(
    ofType(AppActionTypes.LoadStoreAisles),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreAisles(payload.groceryStoreId).pipe(
        map(aisles => new GroceryStoreAislesLoaded( {
          groceryStoreId: payload.groceryStoreId,
          aisles: Array.from(aisles)
        })),
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
        map(sections => new GroceryStoreSectionsLoaded( {
          groceryStoreId: payload.groceryStoreId,
          sections: Array.from(sections)
        })),
        catchError(error => [new GetStoreSectionsFailed(error)])
      );
    }));

  @Effect()
  public addNewStoreAisle$ = this.actions$.pipe(
    ofType(AppActionTypes.AddStoreAisle),
    switchMap((payload) => {
        return this.storeManagementService.addGroceryStoreAisle(payload.newStoreAisleRequest).pipe(
          map(aisleAdded => {
            return new StoreAisleAdded(
              {groceryStoreId: payload.newStoreAisleRequest.groceryStoreId, newAisle: aisleAdded});
          }),
          catchError(error => {
            return [new DisplayError(error)];
          })
        );
      })
    );

  @Effect()
  public deleteStoreAisle$ = this.actions$.pipe(
    ofType(AppActionTypes.DeleteStoreAisle),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStoreAisle(payload.deleteStoreAisleRequest).pipe(
        map(aisleDeleted => new GroceryStoreAisleDeleted( {
          groceryStoreId: payload.deleteStoreAisleRequest.groceryStoreId,
          aisle: payload.deleteStoreAisleRequest.name })),
        catchError(error => {
          return of(new DisplayError(error));
        }));
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
        catchError(error => of(new DisplayError(error)))
      );
    }));

  @Effect()
  public deleteGroceryStoreSection$ = this.actions$.pipe(
    ofType(AppActionTypes.DeleteGroceryStoreSection),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStoreSection({
        groceryStoreId: payload.deleteGroceryStoreSectionRequest.groceryStoreId,
        name: payload.deleteGroceryStoreSectionRequest.name}).pipe(
        map(sectionDeleted => new GroceryStoreSectionDeleted( {
          groceryStoreId: payload.deleteGroceryStoreSectionRequest.groceryStoreId,
          section: payload.deleteGroceryStoreSectionRequest.name })),
        catchError(error => [new DeleteGroceryStoreSectionFailed(error)])
      );
    }));

  // @Effect()
  // public updateStoreAisle$ = this.actions$.pipe(
  //   ofType(AppActionTypes.UpdateAisle),
  //   switchMap((payload) => {
  //     return this.storeManagementService.updateGroceryStoreAisle(
  //       payload.updateRequest.groceryStoreId,
  //       payload.updateRequest.originalName,
  //       payload.updateRequest.aisleOrSectionName).pipe(
  //           switchMap(aisleUpdated => [
  //             new LoadGroceryStoreAisles(payload.updateRequest.groceryStoreId),
  //             new LoadGroceryStoreLocations(payload.updateRequest.groceryStoreId)
  //           ]),
  //           catchError(error => {
  //             return of(new DisplayError(error));
  //           }));
  //   }),
  // );

  @Effect({ dispatch: false})
  public displayError$ = this.actions$.pipe(
    ofType(AppActionTypes.DisplayError),
    tap((payload) => {
      window.alert(payload.error);
    })
  );

  @Effect()
  public ImportData$ = this.actions$.pipe(
    ofType(AppActionTypes.ImportData),
    switchMap((payload) => {
      return this.storeManagementService.importHggsData(payload.data).pipe(
        switchMap(succeeded => [
          new LoadImportedData(payload.returnUrl),
        ]),
        catchError(error => {
          return of(new DisplayError(error));
        }));
    }),
  );

  @Effect()
  public loadImportedData$ = this.actions$.pipe(
    ofType(AppActionTypes.LoadImportedData),
    switchMap((payload) => {
      console.log('calling stateManagementService.getPantryItems()');
      return forkJoin([this.storeManagementService.getPantryItems(), this.storeManagementService.getGroceryStores()]).pipe(
        switchMap(([pantryItems, groceryStores]) => {
          return [
            new PantryImportedSuccessfully(pantryItems, payload.returnUrl),
            new GroceryStoresImportedSuccessfully(groceryStores, payload.returnUrl)
          ];
        }),
        catchError(error => [new PantryLoadFailed(error)])
      );
    })
  );

  @Effect({ dispatch: false})
  public databaseIsReady$ = this.actions$.pipe(
    ofType(AppActionTypes.DatabaseReady),
    // todo: comment back in when  called from a button
    // switchMap(() => this.storeManagementService.cleanupLocations())
  );
}
