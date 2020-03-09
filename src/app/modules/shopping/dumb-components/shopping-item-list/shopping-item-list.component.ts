import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {ShoppingListState} from '../../store/shopping.reducers';


@Component({
  selector: 'app-shopping-item-list',
  templateUrl: './shopping-item-list.component.html',
  styleUrls: ['./shopping-item-list.component.scss']
})
export class ShoppingItemListComponent implements OnInit {

  @Output()
  notifySaveShoppingItemRequested: EventEmitter<ShoppingItem> = new EventEmitter();

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

  itemClicked($event, shoppingItem: ShoppingItem) {
    this.notifySaveShoppingItemRequested.emit({...shoppingItem, inCart: $event.detail.inCart });
  }

  getShoppingItemDescriptionLine1(shoppingItem: ShoppingItem) {
    return shoppingItem.pantryItem.name + ', ' + shoppingItem.pantryItem.quantityNeeded + ' ' + shoppingItem.pantryItem.units;
  }

  getShoppingItemDescriptionLine2(shoppingItem: ShoppingItem) {
    return shoppingItem.pantryItem.description;
  }
}
