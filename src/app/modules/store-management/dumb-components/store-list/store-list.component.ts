import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {Router} from '@angular/router';
import {NavigateToStoreDetailsPage} from '../../store/store-management.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

export interface NewGroceryStoreRequest {
  name: string;
}

export interface DeleteGroceryStoreRequest {
  id: number;
  name: string;
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
  groceryStores: GroceryStoreState[];

  constructor(private router: Router, private store: Store<AppState>) {
    // this.groceryStores = [];
  }

  ngOnInit() {
  }

  editGroceryStore(item: GroceryStoreState) {
    this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
  }
  remove(item: GroceryStoreState) {
    this.notifyDeleteStoreRequested.emit({ id: item.id, name: item.name });
  }
}
