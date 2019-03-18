import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromSelectors from '../../store/store-management.selectors';
import {GroceryStore} from '../../model/grocery-store';
import * as fromActions from '../../store/store-management.actions';
import {AppState} from '../../../../store/app.state';
import {DeleteStoreRequest, NewGroceryStoreRequest} from '../../dumb-components/store-list/store-list.component';

@Component({
  selector: 'app-store-inventory-manager',
  templateUrl: './store-inventory-manager-page.component.html',
  styleUrls: ['./store-inventory-manager-page.component.scss']
})
export class StoreInventoryManagerPageComponent implements OnInit {
  title: string;
  groceryStores$: Observable<GroceryStore[]>;
  constructor(private store: Store<AppState>) {
    this.title = 'Manage Stores from page component';
  }

  ngOnInit() {
    // dispatch action that list has been navigated to
    this.store.dispatch(new fromActions.NavigatedToStoreListPage());
    this.groceryStores$ = this.store.select(fromSelectors.selectAllGroceryStores);
  }

  onNotifyNewStoreRequest($event: NewGroceryStoreRequest) {
    this.store.dispatch(new fromActions.CreateStore($event));
  }

  onDeleteStoreRequest($event: DeleteStoreRequest) {
    this.store.dispatch(new fromActions.DeleteStore($event));
  }

  // onNavigateToEditStoreRequest($event: NavigateToEditStoreRequest) {
  //   const groceryStoreId = $event.id;
  //   const groceryStore$ = select(this.groceryStores$);
  //   this.store.dispatch(new fromActions.NavigateToEditStore($event));
  // }
}
