import {Inject, Injectable} from '@angular/core';
import {
  AddPantryItemLocationFailed,
  AddPantryItemLocationRequest,
  CreateItemFailed,
  DeletePantryItemFailed,
  EditPantryItemLocationRequest,
  PantryItemCreated,
  LoadPantryItemLocations,
  NavigateToPantryItemPage,
  PantryItemDeleted,
  PantryItemLoaded,
  PantryItemLocationAdded,
  PantryItemLocationsLoadedSuccessfully, PantryItemLocationUpdated,
  PantryLoadedSuccessfully,
  PantryLoadFailed,
  SavePantryItemFailed,
  SavePantryItemSucceeded
} from './pantry-management.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {PantryState} from './pantry-management.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';
import {PantryActions, PantryActionTypes} from './pantry-management.actions';
import {GroceryStoreLocationPossiblyAdded} from '../../../store';

@Injectable()
export class PantryEffects {
  constructor(private store: Store<PantryState>,
              private actions$: Actions <PantryActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  @Effect()
  public deletePantryItem = this.actions$.pipe(
    ofType(PantryActionTypes.DeletePantryItem),
    tap((payload) => console.log('Payload to deletePantryItem ' + JSON.stringify(payload))),
    switchMap((payload) => {
      return this.storeManagementService.deletePantryItem(payload.deletePantryItemRequest).pipe(
        map(success => new PantryItemDeleted(payload.deletePantryItemRequest.id)),
        catchError(error => [new DeletePantryItemFailed(error)])
      );
    })
  );

  @Effect()
  public loadPantryItems$ = this.actions$.pipe(
    ofType(PantryActionTypes.NavigatedToPantryPage),
    tap(() => console.log('calling stateManagementService.getPantryItems()')),
    switchMap(() => {
        return this.storeManagementService.getPantryItems().pipe(
          tap((pantryItems) => {
            console.log('dispatching PantryLoadedSuccessfully action');
            console.log(pantryItems);
          }),
          map(data => new PantryLoadedSuccessfully(data)),
          catchError(error => [new PantryLoadFailed(error)])
        );
    })
  );

  @Effect()
  public getPantryItemDetails$ = this.actions$.pipe(
    ofType(PantryActionTypes.NavigatedToPantryItemPage),
    switchMap(payload => this.storeManagementService.getPantryItem(payload.pantryItemId)),
    switchMap((x) => {
      return [
        new PantryItemLoaded(x),
        new LoadPantryItemLocations(x.id),
      ];
    }),
    catchError(err => [new PantryLoadFailed(err)])
  );

  @Effect()
  public getPantryItemLocations$ = this.actions$.pipe(
    ofType(PantryActionTypes.LoadPantryItemLocations),
    switchMap(payload => this.storeManagementService.getPantryItemLocations(payload.itemId).pipe(
      map(locations => new PantryItemLocationsLoadedSuccessfully(payload.itemId, locations)),
      catchError(error => [new PantryLoadFailed(error)])
    ))
  );

  // @Effect()
  // public addNewPantryItem$ = this.actions$.pipe(
  //   ofType(PantryActionTypes.CreateItem),
  //   tap((payload) => console.log('Payload to addNewPantryItem$ ' + JSON.stringify(payload))),
  //   switchMap((payload) => {
  //     console.log('calling stateManagementService.addPantryItem()');
  //     return this.storeManagementService.addPantryItem(payload.pantryItemRequest).pipe(
  //       tap((something) => console.log(
  //         'return from addPantryItem, dispatching PantryItemCreated' + JSON.stringify(something))),
  //       map(newPantryitem => new ItemCreated(newPantryitem)),
  //       catchError(error => {
  //         console.log('CreatePantryItem failed');
  //         return [new CreateItemFailed(error)];
  //       })
  //     );
  //   }),
  // );

  @Effect()
  public createPantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.CreatePantryItem),
    switchMap((payload) => {
      return this.storeManagementService.addPantryItem({
        name: payload.pantryItemRequest.name,
        description: '',
        locations: [],
        id: 0,
        need: true,
      }).pipe(
        tap((itemAdded) => {
          console.log(`item Added: ${itemAdded}`);
        }),
        map(itemAdded => new PantryItemCreated( itemAdded )),
        catchError(error => [new CreateItemFailed(payload.pantryItemRequest.name, error)])
      );
    }));

  @Effect({ dispatch: false })
  public navigateToPantryItemDetailsPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.NavigateToPantryItemPage),
    tap((navigateToPantryItemPageRequest: NavigateToPantryItemPage) => {
      const navigationExtras = { queryParams:
          {
            id: navigateToPantryItemPageRequest.pantryItemRequest.id,
            newItem: navigateToPantryItemPageRequest.pantryItemRequest.newItem
          }
      };
      this.router.navigate([this.router.url, 'pantry-item-details'], navigationExtras);
    }));

  @Effect()
  public saveNewPantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.SaveNewPantryItem),
    switchMap((payload) => {
      return this.storeManagementService.addPantryItem(payload.pantryItem).pipe(
        tap((itemAdded) => {
          console.log(`item Added: ${itemAdded}`);
        }),
        map(itemAdded => new PantryItemCreated( itemAdded )),
        catchError(error => [new CreateItemFailed(payload.pantryItem.name, error)])
      );
    }));

  @Effect()
  public savePantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.SavePantryItem),
    switchMap((payload) => {
      return this.storeManagementService.updatePantryItem(payload.pantryItem).pipe(
        tap((itemUpdated) => {
          console.log(`item Added: ${itemUpdated}`);
        }),
        map(itemUpdated => new SavePantryItemSucceeded( payload.pantryItem )),
        catchError(error => [new SavePantryItemFailed(error, payload.pantryItem)])
      );
    }));

  // @Effect({ dispatch: false })
  // public pantryItemUpdated$ = this.actions$.pipe(
  //   ofType(PantryActionTypes.SavePantryItemSucceeded),
  //   tap((navigateBackToPantryPage: SavePantryItemSucceeded) => {
  //     this.router.navigate(['/home/pantry-items']);
  //     // this.router.navigate(['../../manage']);
  //   }));

  // @Effect({ dispatch: false })
  //   public navigateToPantryPage$ = this.actions$.pipe(
  //     ofType(PantryActionTypes.ItemCreated),
  //     tap((navigateToPantryPage: ItemCreated) => {
  //       const navigationExtras = { queryParams:
  //           {
  //             newItem: navigateToPantryPage.pantryItem
  //           }
  //       };
  //       // this.router.navigate(['/home/pantry-items']);
  //     }));

  @Effect({ dispatch: false })
  public navigateToNewLocationPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.AddPantryItemLocationRequest),
    tap((navigateToLocationPage: AddPantryItemLocationRequest) => {
      // todo: make this single '/pantry-items/{pantry-item-id}/new-pantry-item-location
      const route = `/home/pantry-items/${navigateToLocationPage.request.pantryItem.id}/new-pantry-item-location`;
      this.router.navigateByUrl(route);
    }));

  @Effect({ dispatch: false })
  public navigateToEditLocationPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.EditPantryItemLocationRequest),
    tap((navigateToLocationPage: EditPantryItemLocationRequest) => {
      const navigationExtras = { queryParams:
          {
            storeId: navigateToLocationPage.request.storeLocation.storeId,
            storeName: navigateToLocationPage.request.storeLocation.storeName,
            aisle: navigateToLocationPage.request.storeLocation.aisle,
            section: navigateToLocationPage.request.storeLocation.section,
          }
      };
      // tslint:disable-next-line:max-line-length
      const route = `/home/pantry-items/${navigateToLocationPage.request.pantryItem.id}/pantry-item-location/${navigateToLocationPage.request.storeLocation.id}`;
      this.router.navigateByUrl(route, navigationExtras);
    }));

  @Effect()
  public addItemLocation = this.actions$.pipe(
    ofType(PantryActionTypes.AddPantryItemLocation),
    switchMap((payload) => {
      return this.storeManagementService.addPantryItemLocation(
        payload.addPantryItemLocation.itemId,
        payload.addPantryItemLocation.location).pipe(
          tap((pantryItemLocationAdded) => console.log(pantryItemLocationAdded)),
          concatMap((pantryItemLocationAdded) => [
            new PantryItemLocationAdded(payload.addPantryItemLocation.itemId, pantryItemLocationAdded),
            new GroceryStoreLocationPossiblyAdded(pantryItemLocationAdded),
        ]),
        catchError(error => {
          console.log(error);
          return [new AddPantryItemLocationFailed(error)];
        })
      );
    }));

  @Effect()
  public updateItemLocation = this.actions$.pipe(
    ofType(PantryActionTypes.UpdatePantryItemLocation),
    switchMap((payload) => {
      return this.storeManagementService.updatePantryItemLocation(
        payload.updatePantryItemLocation.itemId,
        payload.originalLocationId,
        payload.updatePantryItemLocation.location).pipe(
        map((newPantryItemLocation) => {
          return new PantryItemLocationUpdated(payload.updatePantryItemLocation.itemId, payload.originalLocationId, newPantryItemLocation);
        }),
        catchError(error => {
          console.log(error);
          return [new AddPantryItemLocationFailed(error)];
        })
      );
    }));

  @Effect({dispatch: false})
  public itemLocationAdded = this.actions$.pipe(
    ofType(PantryActionTypes.PantryItemLocationAdded),
    tap((navigateToItemPage: PantryItemLocationAdded) => {
      // todo: make this single '/pantry-items/{pantry-item-id}/new-pantry-item-location
      const route = `/home/pantry-items/pantry-item-details?id=${navigateToItemPage.itemId}&isNewItem=false`;
      this.router.navigateByUrl(route);
      // this.router.navigate(['/pantry-items/pantry-item-locations']);;
      // this.router.navigate(['../../manage']);
    }));

  @Effect({dispatch: false})
  public itemLocationUpdated = this.actions$.pipe(
    ofType(PantryActionTypes.PantryItemLocationUpdated),
    tap((navigateToItemPage: PantryItemLocationUpdated) => {
      const route = `/home/pantry-items/pantry-item-details?id=${navigateToItemPage.itemId}&isNewItem=false`;
      this.router.navigateByUrl(route);
    }));
}
