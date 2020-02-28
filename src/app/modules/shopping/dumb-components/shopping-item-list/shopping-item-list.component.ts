import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {PantryItem} from '../../../../model/pantry-item';

@Component({
  selector: 'app-shopping-item-list',
  templateUrl: './shopping-item-list.component.html',
  styleUrls: ['./shopping-item-list.component.scss']
})
export class ShoppingItemListComponent implements OnInit {

  @Output()
  notifySaveShoppingItemRequested: EventEmitter<ShoppingItem> = new EventEmitter();

  @Input()
  shoppingItems: ShoppingItem[];

  shoppingItemsLoading: boolean;
  error: Error;

  constructor() {
    this.shoppingItemsLoading = false;
    this.error = null;
  }

  ngOnInit() {
  }

  itemClicked($event, shoppingItem: ShoppingItem) {
    this.notifySaveShoppingItemRequested.emit({...shoppingItem, inCart: $event.detail.inCart });
  }
}
