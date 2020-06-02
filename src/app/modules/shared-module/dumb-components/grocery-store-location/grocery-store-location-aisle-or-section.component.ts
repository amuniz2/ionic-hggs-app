import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {GroceryStore} from '../../../../model/grocery-store';
export interface GroceryStoreAisleOrSectionSelected {
  name: string;
}
@Component({
  selector: 'app-grocery-store-location-aisle-or-section',
  templateUrl: './grocery-store-location-aisle-or-section.component.html',
  styleUrls: ['./grocery-store-location-aisle-or-section.component.scss']
})
export class GroceryStoreLocationAisleOrSectionComponent implements OnInit, OnChanges {

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

  ngOnChanges(changes: SimpleChanges) {
    if (this.label !== 'Aisle') {
      return;
    }

    // tslint:disable-next-line:forin
    for (let propName in changes) {
      if (propName === 'groceryStoreAislesOrSections') {
        const chng = changes[propName];
        const cur = JSON.stringify(chng.currentValue);
        const prev = JSON.stringify(chng.previousValue);
        console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
      }
    }
  }

  onChangeAisleOrSection($event: CustomEvent) {
    this.selectedGroceryStoreAisleOrSection = $event.detail.value;
    this.aisleOrSectionChange.emit({ name: $event.detail.value});
  }

  sectionsOrAislesExist(): boolean {
    return this.groceryStoreAislesOrSections !== null && this.groceryStoreAislesOrSections.length > 0;
  }
}
