import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {EditItemLocationRequest} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';

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
  notifySaveRequested: EventEmitter<ShoppingItem> = new EventEmitter();

  @Output()
  notifyEditPantryItemLocationRequested: EventEmitter<EditItemLocationRequest> = new EventEmitter<EditItemLocationRequest>();

  constructor() { }

  ngOnInit() {
  }

  itemClicked($event: any) {
    const event = {
      ...this.shoppingItem,
      inCart: $event.detail.checked };
    this.notifySaveRequested.emit(event);
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

  editLocation() {
    this.notifyEditPantryItemLocationRequested.emit( {
      pantryItemId: this.shoppingItem.pantryItemId,
      storeLocation: { ...this.shoppingItem.location, storeId: this.shoppingItem.storeId, storeName: '', id: this.shoppingItem.location.locationId},
      action: UiCrudAction.Update
    });
  }
}
