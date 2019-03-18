import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../model/grocery-store';
import {StoreAisle} from '../grocery-store-aisles/grocery-store-aisles.component';
import {NewGroceryStoreRequest} from '../store-list/store-list.component';
import * as fromActions from '../../store/store-management.actions';

@Component({
  selector: 'app-edit-grocery-store',
  templateUrl: './edit-grocery-store.component.html',
  styleUrls: ['./edit-grocery-store.component.scss']
})
export class EditGroceryStoreComponent implements OnInit {

  @Input()
  groceryStore: GroceryStore;

  @Output()
  notifyNewStoreAisleRequested: EventEmitter<StoreAisle> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onNotifyNewStoreAisleRequest($event: StoreAisle) {
    this.notifyNewStoreAisleRequested.emit($event);
  }
}
