import {Inject, Injectable} from '@angular/core';
import {
  AddPantryItemLocation, AddPantryItemLocationFailed,
  AddPantryItemLocationRequest,
  CreateItemFailed, CreatePantryItem, DeletePantryItemFailed,
  ItemCreated, NavigateToPantryItemPage, PantryItemDeleted, PantryItemLocationAdded,
  PantryLoadedSuccessfully, PantryLoadFailed, SavePantryItemFailed, SavePantryItemSucceeded
} from './pantry-management.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {PantryState} from './pantry-management.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';
import {PantryActions, PantryActionTypes} from './pantry-management.actions';
import {NewItemLocation} from '../smart-components/add-pantry-item-location/add-pantry-item-location.component';

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

  @Effect({ dispatch: false })
  public navigateToNewPantryItemDetailsPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.CreateItem),
    tap((navigateToPantryItemPage: CreatePantryItem) => {
      const navigationExtras = { queryParams:
          {
            id: navigateToPantryItemPage.pantryItemRequest.id,
            newItem: navigateToPantryItemPage.pantryItemRequest.newItem
          }
      };
      this.router.navigate([this.router.url, 'pantry-item-details'], navigationExtras);
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
        map(itemAdded => new ItemCreated( itemAdded )),
        catchError(error => [new CreateItemFailed(payload.pantryItem, error)])
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

  @Effect({ dispatch: false })
  public pantryItemUpdated$ = this.actions$.pipe(
    ofType(PantryActionTypes.SavePantryItemSucceeded),
    tap((navigateBackToPantryPage: SavePantryItemSucceeded) => {
      this.router.navigate(['/pantry-items'], { relativeTo: this.activeRoute});
      // this.router.navigate(['../../manage']);
    }));

  @Effect({ dispatch: false })
    public navigateToPantryPage$ = this.actions$.pipe(
      ofType(PantryActionTypes.ItemCreated),
      tap((navigateToPantryPage: ItemCreated) => {
        const navigationExtras = { queryParams:
            {
              newItem: navigateToPantryPage.pantryItem
            }
        };
        this.router.navigate(['/pantry-items'], { relativeTo: this.activeRoute});
        // this.router.navigate(['../../manage']);
      }));

  @Effect({ dispatch: false })
  public navigateToNewLocationPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.AddPantryItemLocationRequest),
    tap((navigateToLocationPage: AddPantryItemLocationRequest) => {
      // todo: make this single '/pantry-items/{pantry-item-id}/new-pantry-item-location
      const route = `/pantry-items/${navigateToLocationPage.request.pantryItem.id}/new-pantry-item-location`;
      this.router.navigateByUrl(route);
      // this.router.navigate(['/pantry-items/pantry-item-locations']);;
      // this.router.navigate(['../../manage']);
    }));

  @Effect({ dispatch: false })
  public addItemLocation = this.actions$.pipe(
    ofType(PantryActionTypes.AddPantryItemLocation),
    switchMap((payload) => {
      return this.storeManagementService.addPantryItemLocation(
        payload.addPantryItemLocation.itemId,
        payload.addPantryItemLocation.location).pipe(
        map(_ => new PantryItemLocationAdded(
          payload.addPantryItemLocation.itemId,
          payload.addPantryItemLocation.itemId,
          payload.addPantryItemLocation.location)),
        catchError(error => [new AddPantryItemLocationFailed(error)])
      );
    }));
}
