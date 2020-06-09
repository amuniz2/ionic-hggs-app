import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {ShoppingListState} from '../../store/shopping.reducers';
import {ShoppingItemUpdate} from '../shopping-item/shopping-item.component';

export class StoreShoppingItemUpdate {
  storeId: number;
  id: number;
  inCart: boolean;
}
@Component({
  selector: 'app-shopping-item-list',
  templateUrl: './shopping-item-list.component.html',
  styleUrls: ['./shopping-item-list.component.scss']
})
export class ShoppingItemListComponent implements OnInit {

  @Output()
  notifySaveShoppingItemRequested: EventEmitter<StoreShoppingItemUpdate> = new EventEmitter();

  @Input()
  shoppingList: ShoppingListState;

  shoppingItemsLoading: boolean;
  error: Error;

  constructor() {
    this.shoppingItemsLoading = false;
    this.error = null;
    // this.shoppingList = null;
  }

  ngOnInit() {
  //   this.getSortedShoppingItems();
  }

  onSaveShoppingItem(shoppingItem: ShoppingItemUpdate) {
    this.notifySaveShoppingItemRequested.emit({storeId: this.shoppingList.id, id: shoppingItem.id, inCart: shoppingItem.inCart});
  }
}
