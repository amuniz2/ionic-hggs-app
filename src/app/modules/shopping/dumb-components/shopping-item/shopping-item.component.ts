import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';

@Component({
  selector: 'app-shopping-item',
  templateUrl: './shopping-item.component.html',
  styleUrls: ['./shopping-item.component.scss']
})
export class ShoppingItemComponent implements OnInit {

  @Input()
  shoppingItem: ShoppingItem;

  @Output()
  notifySaveRequested: EventEmitter<ShoppingItem> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  itemClicked($event) {
    this.notifySaveRequested.emit({...this.shoppingItem, inCart: $event.detail.inCart });
  }

  getShoppingItemDescriptionLine1(shoppingItem: ShoppingItem) {
    if (!shoppingItem) {
      return '';
    }
    return this.shoppingItem.pantryItem.name + ', ' + this.shoppingItem.pantryItem.quantityNeeded + ' ' + shoppingItem.pantryItem.units;
  }

  getShoppingItemDescriptionLine2(shoppingItem: ShoppingItem) {
    if (!shoppingItem) {
      return '';
    }
    return this.shoppingItem.pantryItem.description;
  }
}
