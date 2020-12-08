import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatePantryItemRequest} from '../../../../helpers';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

@Component({
  selector: 'app-add-pantry-item',
  templateUrl: './add-pantry-item.component.html',
  styleUrls: ['./add-pantry-item.component.scss']
})
export class AddPantryItemComponent implements OnInit {

  @Input()
  addingPantryItem: boolean;

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
