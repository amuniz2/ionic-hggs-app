import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';

export class ShoppingItemUpdate {
  id: number;
  inCart: boolean;
}

@Component({
  selector: 'app-shopping-item',
  templateUrl: './shopping-item.component.html',
  styleUrls: ['./shopping-item.component.scss']
})
export class ShoppingItemComponent implements OnInit {

  @Input()
  shoppingItem: ShoppingItem;

  @Output()
  notifySaveRequested: EventEmitter<ShoppingItemUpdate> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  itemClicked($event) {
    this.notifySaveRequested.emit({
      id: this.shoppingItem.pantryItemId,
      inCart: !this.shoppingItem.inCart });
  }

  getShoppingItemDescriptionLine1(shoppingItem: ShoppingItem) {
    if (!shoppingItem) {
      return '';
    }
    return this.shoppingItem.name + ', ' + this.shoppingItem.quantity + ' ' + shoppingItem.units;
  }

  getShoppingItemDescriptionLine2(shoppingItem: ShoppingItem) {
    if (!shoppingItem) {
      return '';
    }
    return this.shoppingItem.description;
  }
}
