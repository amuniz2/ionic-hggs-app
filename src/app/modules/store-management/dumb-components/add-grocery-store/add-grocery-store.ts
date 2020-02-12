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

  newGroceryStoreName: string;
  constructor() { }

  ngOnInit() {
  }

  onCancelAddStoreClick() {
    this.notifyNewStoreRequested.emit({ name: null});
    this.newGroceryStoreName = '';
  }

  onAddStoreDoneClick() {
    this.notifyNewStoreRequested.emit({ name: this.newGroceryStoreName});
    this.newGroceryStoreName = '';
  }
}
