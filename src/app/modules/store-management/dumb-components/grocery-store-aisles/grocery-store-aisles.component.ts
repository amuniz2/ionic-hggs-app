import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../model/grocery-store';
import {NavigateToStoreDetailsPage} from '../../store/store-management.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {DeleteGroceryStoreRequest, NewGroceryStoreRequest} from '../store-list/store-list.component';

export interface StoreAisle {
  groceryStoreId: number;
  aisle: string;
}

@Component({
  selector: 'app-grocery-store-aisles',
  templateUrl: './grocery-store-aisles.component.html',
  styleUrls: ['./grocery-store-aisles.component.scss']
})
export class GroceryStoreAislesComponent implements OnInit {
  newStoreAisle: string;
  enteringStoreAisle: boolean;

  @Output()
  notifyNewStoreAisleRequested: EventEmitter<StoreAisle> = new EventEmitter();

  @Output()
  notifyDeleteStoreAisleRequested: EventEmitter<StoreAisle> = new EventEmitter();

  @Input()
  groceryStore: GroceryStore;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }
  onAddStoreAisleClick() {
    this.newStoreAisle = '';
    this.enteringStoreAisle = true;
    // this.notify.emit('Create new store');
  }

  onCancelAddStoreAisleClick() {
    this.enteringStoreAisle = false;
    this.newStoreAisle = '';
  }

  onAddStoreAisleDoneClick() {
    this.notifyNewStoreAisleRequested.emit({ groceryStoreId: this.groceryStore.id, aisle: this.newStoreAisle});
    this.enteringStoreAisle = false;
    this.newStoreAisle = '';
  }

  editStoreAisle(name: string) {
    // this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
    // item.close();
  }
  remove(item: string) {
    this.notifyDeleteStoreAisleRequested.emit({ groceryStoreId: this.groceryStore.id, aisle: item});
  }
}
