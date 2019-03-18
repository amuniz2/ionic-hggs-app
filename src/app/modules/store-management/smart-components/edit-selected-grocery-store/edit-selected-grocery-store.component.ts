import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {GroceryStore} from '../../model/grocery-store';
import {selectGroceryStore} from '../../store/store-management.selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {NewGroceryStoreRequest} from '../../dumb-components/store-list/store-list.component';
import * as fromActions from '../../store/store-management.actions';
import {StoreAisle} from '../../dumb-components/grocery-store-aisles/grocery-store-aisles.component';

@Component({
  selector: 'app-edit-selected-grocery-store',
  templateUrl: './edit-selected-grocery-store.component.html',
  styleUrls: ['./edit-selected-grocery-store.component.scss']
})
export class EditSelectedGroceryStoreComponent implements OnInit {

  groceryStoreId: number;
  groceryStore$: Observable<GroceryStore>;
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    this.groceryStoreId = this.router.getCurrentNavigation().extras.queryParams.id;
  }

  ngOnInit() {
    this.groceryStore$ = this.store.pipe(select(selectGroceryStore(this.groceryStoreId)));
    // this.store.dispatch(new fromActions.NavigatedToStoreDetailsPage())
  }
  onNotifyNewStoreAisleRequest($event: StoreAisle) {
    this.store.dispatch(new fromActions.AddStoreAisle($event));
  }

}
