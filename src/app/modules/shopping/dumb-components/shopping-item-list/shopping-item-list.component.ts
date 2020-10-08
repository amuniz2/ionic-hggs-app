import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {AisleItems, SectionItems, ShoppingListState} from '../../store/shopping.reducers';
import {ShoppingItemUpdate} from '../shopping-item/shopping-item.component';
import {EditItemLocationRequest} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';

export class StoreShoppingItemUpdate {
  storeId: number;
  id: number;
  inCart: boolean;
}
@Component({
  selector: 'app-shopping-item-list',
  templateUrl: './shopping-item-list.component.html',
  styleUrls: ['./shopping-item-list.component.scss']
})
export class ShoppingItemListComponent implements OnInit {

  constructor() {
    this.shoppingItemsLoading = false;
    this.error = null;
    // this.shoppingList = null;
  }

  @Output()
  notifySaveShoppingItemRequested: EventEmitter<StoreShoppingItemUpdate> = new EventEmitter();

  @Output()
  notifyChangeShoppingItemLocationRequested: EventEmitter<EditItemLocationRequest> = new EventEmitter();

  @Input()
  shoppingList: ShoppingListState;

  @Input()
  filter: string;

  shoppingItemsLoading: boolean;
  error: Error;

  private filteredShoppingItems(items: ShoppingItem[]): ShoppingItem[] {
    if (!!this.filter) {
      return items.filter(item =>
           this.filterMatchesItem(item));
    }
    return items;
  }

  private filteredAisles(aisles: AisleItems[]): AisleItems[] {
    if (!!this.filter) {
      return aisles.filter(aisle =>
        aisle.items.some(item => this.filterMatchesItem(item)));
    }
    return aisles;
  }

  private filteredSections(sections: SectionItems[]): SectionItems[] {
    if (!!this.filter) {
      return sections.filter(section =>
        section.items.some(item => this.filterMatchesItem(item)));
    }
    return sections;
  }

  private filterMatchesItem(item: ShoppingItem): boolean {
    const lowerCaseFilter = this.filter.toLowerCase();
    return item.name?.toLowerCase().includes(lowerCaseFilter) ||
      item.description?.toLowerCase().includes(lowerCaseFilter);
  }

  ngOnInit() {
  //   this.getSortedShoppingItems();
  }

  onSaveShoppingItem(shoppingItem: ShoppingItemUpdate) {
    this.notifySaveShoppingItemRequested.emit({storeId: this.shoppingList.id, id: shoppingItem.id, inCart: shoppingItem.inCart});
  }

  onChangeShoppingItemLocation($event: EditItemLocationRequest) {
   this.notifyChangeShoppingItemLocationRequested.emit($event);
  }
}
