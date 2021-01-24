import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {CreateShoppingItemRequest} from '../../store/shopping.actions';

@Component({
  selector: 'app-add-shopping-item',
  templateUrl: './add-shopping-item.component.html',
  styleUrls: ['./add-shopping-item.component.scss']
})
export class AddShoppingItemComponent implements OnInit {

  @Input()
  initialStoreLocation: GroceryStoreLocation;

  @Output()
  notifyNewPantryItemRequested: EventEmitter<CreateShoppingItemRequest> = new EventEmitter();

  @Output()
  notifyNewPantryItemRequestCancelled: EventEmitter<GroceryStoreLocation> = new EventEmitter();

  newPantryItemName: string;

  constructor() { }

  ngOnInit() {
  }

  onCancelAddPantryItemClick() {
    this.notifyNewPantryItemRequestCancelled.emit(null);
    this.newPantryItemName = '';
  }

  onAddPantryItemDoneClick() {
    this.notifyNewPantryItemRequested.emit({
      name: this.newPantryItemName,
        storeId: this.initialStoreLocation.storeId,
      aisle: this.initialStoreLocation.aisle,
      section: this.initialStoreLocation.section
    });
    this.newPantryItemName = '';
  }
}
