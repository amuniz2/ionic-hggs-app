import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {NewGroceryStoreRequest} from '../../../store-management/dumb-components/store-list/store-list.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @Input()
  groceryStores: GroceryStore[];

  @Input()
  @Output()
  selectedStoreLocation: GroceryStoreLocation;

  @Output()
  notifySelectedGroceryStoreChanged: EventEmitter<GroceryStoreLocation> = new EventEmitter();

  constructor() {
    this.selectedStoreLocation = {
      storeId: null, storeName: null, aisle: '', section: '', id: null
    };
  }

  ngOnInit() {
  }

  onChangeGroceryStoreSelected(event) {
    console.log('Grocery Store Selected event: ');
    console.log(event);
    this.selectedStoreLocation.storeId = event.detail.value;
    this.selectedStoreLocation.aisle = '';
    this.notifySelectedGroceryStoreChanged.emit({
      ...this.selectedStoreLocation,
      storeId: event.detail.value
    });
  }}
