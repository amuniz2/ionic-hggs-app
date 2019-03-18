import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../model/grocery-store';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {NavigateToStoreDetailsPage} from '../../store/store-management.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

export interface NewGroceryStoreRequest {
  name: string;
}

export interface DeleteStoreRequest {
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
  notifyNewStoreRequested: EventEmitter<NewGroceryStoreRequest> = new EventEmitter();

  @Output()
  notifyDeleteStoreRequested: EventEmitter<DeleteStoreRequest> = new EventEmitter();

  @Input()
  groceryStores: GroceryStore[];
  newGroceryStoreName: string;
  enteringStoreName: boolean;

  constructor(private router: Router, private store: Store<AppState>) {
    // this.groceryStores = [];
  }

  ngOnInit() {
      // .subscribe( groceryStores  => this.groceryStores$ = groceryStores);
    // to do get list of stores from the ngrx store
    // this.groceryStores = [...this.groceryStores, { id: 2, name: 'Test'}];
    console.log(this.groceryStores);
  }

  onAddStoreClick() {
    this.newGroceryStoreName = '';
    this.enteringStoreName = true;
    // this.notify.emit('Create new store');
  }

  onCancelAddStoreClick() {
    this.enteringStoreName = false;
    this.newGroceryStoreName = '';
  }

  onAddStoreDoneClick() {
    this.notifyNewStoreRequested.emit({ name: this.newGroceryStoreName});
    this.enteringStoreName = false;
    this.newGroceryStoreName = '';
  }

  editGroceryStore(item: GroceryStore) {
    this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
    // item.close();
  }
  remove(item: GroceryStore) {
    this.notifyDeleteStoreRequested.emit({ id: item.id});
  }
}
