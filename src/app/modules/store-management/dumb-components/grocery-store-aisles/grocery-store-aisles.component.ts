import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

export enum Action {
  RequestCreate = 1,
  Create,
  Delete ,
  RequestUpdate,
  Update,
  Cancel
}
export interface StoreAisle {
  groceryStoreId: number;
  aisle: string;
}

export interface StoreAisleActionRequest {
  groceryStoreId: number;
  aisle: string;
  action: Action;
}

@Component({
  selector: 'app-grocery-store-aisles',
  templateUrl: './grocery-store-aisles.component.html',
  styleUrls: ['./grocery-store-aisles.component.scss']
})
export class GroceryStoreAislesComponent implements OnInit {
  newStoreAisle: string;

  @Input()
  addingAisle: boolean;

  @Output()
  notifyNewStoreAisleRequested: EventEmitter<StoreAisleActionRequest> = new EventEmitter();

  @Output()
  notifyDeleteStoreAisleRequested: EventEmitter<StoreAisleActionRequest> = new EventEmitter();

  @Input()
  groceryStore: GroceryStore;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    console.log('GroceryStore in aisles component');
    console.log(this.groceryStore);
  }
  onAddStoreAisleClick() {
    this.notifyNewStoreAisleRequested.emit({ groceryStoreId: this.groceryStore.id, aisle: null, action: Action.RequestCreate});
    this.newStoreAisle = '';
  }

  onCancelAddStoreAisleClick() {
    this.notifyNewStoreAisleRequested.emit({ groceryStoreId: this.groceryStore.id, aisle: this.newStoreAisle, action: Action.Cancel});
    this.newStoreAisle = '';
  }

  onAddStoreAisleDoneClick() {
    this.notifyNewStoreAisleRequested.emit({ groceryStoreId: this.groceryStore.id, aisle: this.newStoreAisle, action: Action.Create});
    this.newStoreAisle = '';
  }

  editStoreAisle(name: string) {
    // this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
    // item.close();
  }
  remove(item: string) {
    console.log('emitting notifyDeleteStoreAisleRequested');
    this.notifyDeleteStoreAisleRequested.emit({ groceryStoreId: this.groceryStore.id, aisle: item, action: Action.Delete});
  }
}
