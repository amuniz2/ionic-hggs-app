import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NewGroceryStoreRequest} from '../store-list/store-list.component';

@Component({
  selector: 'app-add-grocery-store',
  templateUrl: './add-grocery-store.component.html',
  styleUrls: ['./add-grocery-store.component.scss']
})
export class AddGroceryStoreComponent implements OnInit {
  @Output()
  notifyNewStoreRequested: EventEmitter<NewGroceryStoreRequest> = new EventEmitter();

  @Input()
  addingStore: boolean;

  enteringStoreName: boolean;
  newGroceryStoreName: string;
  constructor() { }

  ngOnInit() {
    this.enteringStoreName = true;
  }

  onAddStoreClick() {
    this.enteringStoreName = true;
    this.newGroceryStoreName = '';
  }

  onCancelAddStoreClick() {
    this.enteringStoreName = false;
    this.newGroceryStoreName = '';
  }

  onAddStoreDoneClick() {
    this.notifyNewStoreRequested.emit({ name: this.newGroceryStoreName});
    this.enteringStoreName = false;
    this.newGroceryStoreName = '';
  }
}
