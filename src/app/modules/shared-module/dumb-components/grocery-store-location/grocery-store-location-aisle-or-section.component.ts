import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStoreSelected} from '../grocery-store-location-store/grocery-store-location-store.component';
import {ControlContainer, FormControl} from '@angular/forms';
export interface GroceryStoreAisleOrSectionSelected {
  name: string;
}
@Component({
  selector: 'app-grocery-store-location-aisle-or-section',
  templateUrl: './grocery-store-location-aisle-or-section.component.html',
  styleUrls: ['./grocery-store-location-aisle-or-section.component.scss']
})
export class GroceryStoreLocationAisleOrSectionComponent implements OnInit {

  @Input()
  inputControlName: string;

  @Input()
  label: string;

  @Input()
  groceryStoreAislesOrSections: string[];

  @Output()
  aisleOrSectionChange: EventEmitter<GroceryStoreAisleOrSectionSelected> =
    new EventEmitter<GroceryStoreAisleOrSectionSelected>();

  @Input()
  selectedGroceryStoreAisleOrSection: string;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit() {
  }

  onChangeAisleOrSection($event: CustomEvent) {
    this.selectedGroceryStoreAisleOrSection = $event.detail.value;
    this.aisleOrSectionChange.emit({ name: $event.detail.value});
  }
}
