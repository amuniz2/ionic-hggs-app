import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../../pantry-management/store/pantry-management.actions';
import * as fromSelectors from '../../store/pantry-management.selectors';
// tslint:disable-next-line:max-line-length
import {
  DeletePantryItemRequest,
  NavigateToEditPantryItemRequest
} from '../../../pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {PantryItem} from '../../../../model/pantry-item';
import {selectPantryItemsLoading} from '../../store/pantry-management.selectors';

@Component({
  selector: 'app-pantry-inventory-manager',
  templateUrl: './pantry-inventory-manager.component.html',
  styleUrls: ['./pantry-inventory-manager.component.scss']
})
export class PantryInventoryManagerComponent implements OnInit {
  title: string;
  pantryItems$: Observable<PantryItem[]>;
  pantryItemsLoading$: Observable<boolean>;
  error$: Observable<Error>;

  constructor(private store: Store<AppState>) {
    this.title = 'Manage pantry items from page component';
  }

  ngOnInit() {
    // dispatch action that list has been navigated to
    console.log('dispatching NavigatedToPantryPage');
    this.store.dispatch(new fromActions.NavigatedToPantryPage());
    this.pantryItems$ = this.store.select(fromSelectors.selectAllPantryItems);
    this.pantryItemsLoading$ = this.store.select(fromSelectors.selectPantryItemsLoading);
    this.error$ = this.store.select(fromSelectors.selectPantryItemsError);
  }

  onDeletePantryItemRequest($event: DeletePantryItemRequest) {
    console.log('dispatching deletePantrItem event');
    console.log($event);
    this.store.dispatch(new fromActions.DeletePantryItem($event));
  }

  onAddStoreClick() {
    console.log('dispatching createPantryItem event');
    this.store.dispatch(new fromActions.CreatePantryItem({newItem: true, id: 0}));
  }
}