import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../model/grocery-store';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {NavigateToStoreDetailsPage} from '../../store/store-management.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

export interface NewGroceryStoreRequest {
  name: string;
}

export interface DeleteGroceryStoreRequest {
  id: number;
}

export interface NavigateToEditStoreRequest {
  id: number;
}

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {

  @Output()
  notifyDeleteStoreRequested: EventEmitter<DeleteGroceryStoreRequest> = new EventEmitter();

  @Input()
  groceryStoresLoading: boolean;

  @Input()
  groceryStores: GroceryStore[];

  constructor(private router: Router, private store: Store<AppState>) {
    // this.groceryStores = [];
  }

  ngOnInit() {
      // .subscribe( groceryStores  => this.groceryStores$ = groceryStores);
    // to do get list of stores from the ngrx store
    // this.groceryStores = [...this.groceryStores, { id: 2, name: 'Test'}];
    console.log(this.groceryStores);
  }

  editGroceryStore(item: GroceryStore) {
    this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
    // item.close();
  }
  remove(item: GroceryStore) {
    console.log(`emitting notification that store delete is requested ${item.id}`);
    this.notifyDeleteStoreRequested.emit({ id: item.id});
  }
}
