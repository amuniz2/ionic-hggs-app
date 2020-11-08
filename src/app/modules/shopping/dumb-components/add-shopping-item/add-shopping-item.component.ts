import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {GroceryStoreLocation} from "../../../../model/grocery-store-location";
import {CreatePantryItemRequest} from "../../../pantry-management/dumb-components/pantry-item-list/pantry-item-list.component";

@Component({
  selector: 'app-add-shopping-item',
  templateUrl: './add-shopping-item.component.html',
  styleUrls: ['./add-shopping-item.component.scss']
})
export class AddShoppingItemComponent implements OnInit {

  @Input()
  addingShoppingItem: boolean;

  @Input()
  initialStoreLocation: GroceryStoreLocation;

  @Output()
  notifyNewPantryItemRequested: EventEmitter<CreatePantryItemRequest> = new EventEmitter();

  newPantryItemName: string;

  constructor() { }

  ngOnInit() {
  }

  onCancelAddPantryItemClick() {
    this.notifyNewPantryItemRequested.emit({ name: null});
    this.newPantryItemName = '';
  }

  onAddPantryItemDoneClick() {
    this.notifyNewPantryItemRequested.emit({
      name: this.newPantryItemName,
      initialStoreLocation: this.initialStoreLocation
    });
    this.newPantryItemName = '';
  }
}
