import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NewGroceryStoreRequest} from '../../../store-management/dumb-components/store-list/store-list.component';
import {CreatePantryItemRequest} from '../pantry-item-list/pantry-item-list.component';

@Component({
  selector: 'app-add-pantry-item',
  templateUrl: './add-pantry-item.component.html',
  styleUrls: ['./add-pantry-item.component.scss']
})
export class AddPantryItemComponent implements OnInit {

  @Input()
  addingPantryItem: boolean;

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
    this.notifyNewPantryItemRequested.emit({ name: this.newPantryItemName});
    this.newPantryItemName = '';
  }
}
