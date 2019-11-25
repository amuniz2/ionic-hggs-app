import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';

export interface StoreSection {
  groceryStoreId: number;
  section: string;
}

@Component({
  selector: 'app-grocery-store-sections',
  templateUrl: './grocery-store-sections.component.html',
  styleUrls: ['./grocery-store-sections.component.scss']
})
export class GroceryStoreSectionsComponent implements OnInit {
  newGroceryStoreSection: string;
  enteringGroceryStoreSection: boolean;

  @Output()
  notifyNewGroceryStoreSectionRequested: EventEmitter<StoreSection> = new EventEmitter();

  @Output()
  notifyDeleteGroceryStoreSectionRequested: EventEmitter<StoreSection> = new EventEmitter();

  @Input()
  groceryStore: GroceryStore;

  constructor() { }

  ngOnInit() {
    console.log('GroceryStore in sections component');
    console.log(this.groceryStore);
  }
  onAddGroceryStoreSectionClick() {
    this.newGroceryStoreSection = '';
    this.enteringGroceryStoreSection = true;
  }

  onCancelAddGroceryStoreSectionClick() {
    this.enteringGroceryStoreSection = false;
    this.newGroceryStoreSection = '';
  }

  onAddGroceryStoreSectionDoneClick() {
    this.notifyNewGroceryStoreSectionRequested.emit({ groceryStoreId: this.groceryStore.id, section: this.newGroceryStoreSection});
    this.enteringGroceryStoreSection = false;
    this.newGroceryStoreSection = '';
  }

  editStoreSection(name: string) {
    // this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
    // item.close();
  }
  remove(item: string) {
    console.log('emitting notifyDeleteGroceryStoreSectionRequested');
    this.notifyDeleteGroceryStoreSectionRequested.emit({ groceryStoreId: this.groceryStore.id, section: item});
  }
}
