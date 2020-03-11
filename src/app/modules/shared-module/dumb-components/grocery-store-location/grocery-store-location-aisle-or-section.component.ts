import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormControl} from '@angular/forms';
import {GroceryStore} from '../../../../model/grocery-store';
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
  groceryStores: GroceryStore[];

  @Input()
  groceryStoreAislesOrSections: string[];

  @Output()
  aisleOrSectionChange: EventEmitter<GroceryStoreAisleOrSectionSelected> = new EventEmitter<GroceryStoreAisleOrSectionSelected>();

  @Input()
  selectedGroceryStoreAisleOrSection: string;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit() {
  }

  onChangeAisleOrSection($event: CustomEvent) {
    this.selectedGroceryStoreAisleOrSection = $event.detail.value;
    this.aisleOrSectionChange.emit({ name: $event.detail.value});
  }

  sectionsOrAislesExist(): boolean {
    return this.groceryStoreAislesOrSections != null && this.groceryStoreAislesOrSections.length > 0;
  }
}
