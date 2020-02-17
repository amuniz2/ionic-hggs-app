import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Action, StoreAisle, StoreAisleActionRequest} from '../grocery-store-aisles/grocery-store-aisles.component';
import {Observable, of} from 'rxjs';
import {CollapsedStatusChangedEvent, PageSection} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {StoreSection} from '../grocery-store-sections/grocery-store-sections.component';

@Component({
  selector: 'app-edit-grocery-store',
  templateUrl: './edit-grocery-store.component.html',
  styleUrls: ['./edit-grocery-store.component.scss']
})
export class EditGroceryStoreComponent implements OnInit {

  @Input()
  groceryAislesSectionIsOpen: boolean;

  aislesSection: PageSection = {
    label: 'Aisles',
    isOpen$: of(false)
  };
  grocerySectionsSection: PageSection = {
    label: 'Grocery Sections',
    isOpen$: of(false)
  };

  addingAisle$: Observable<boolean>;

  @Input()
  groceryStore: GroceryStore;

  @Output()
  notifyNewStoreAisleRequested: EventEmitter<StoreAisle> = new EventEmitter();

  @Output()
  notifyDeleteStoreAisleRequested: EventEmitter<StoreAisle> = new EventEmitter();

  @Output()
  notifyNewGroceryStoreSectionRequested: EventEmitter<StoreSection> = new EventEmitter();

  @Output()
  notifyDeleteGroceryStoreSectionRequested: EventEmitter<StoreSection> = new EventEmitter();

  @Output()
  notifyExpandAisles: EventEmitter<number> = new EventEmitter();

  @Output()
  notifyExpandSections: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onNotifyNewStoreAisleRequest($event: StoreAisleActionRequest) {
    if ($event.action === Action.RequestCreate) {
      this.addingAisle$ = of(true);
    } else {
      this.addingAisle$ = of(false);
      if (($event.action === Action.Create) && $event.aisle) {
        this.notifyNewStoreAisleRequested.emit($event);
      }
    }
  }

  onNotifyDeleteStoreAisleRequest($event: StoreAisle) {
    this.notifyDeleteStoreAisleRequested.emit($event);
  }

  onNotifyNewStoreGrocerySectionRequest($event: StoreSection) {
    this.notifyNewGroceryStoreSectionRequested.emit($event);
  }

  onNotifyDeleteGroceryStoreSectionRequest($event: StoreSection) {
    this.notifyDeleteGroceryStoreSectionRequested.emit($event);
  }
  public captureName($event: CollapsedStatusChangedEvent) {
    if ($event.sectionName === this.aislesSection.label) {
      this.aislesSection.isOpen$ = of($event.isOpen);
      if ($event.isOpen && this.groceryStore.aisles.length === 0) {
        this.notifyExpandAisles.emit(this.groceryStore.id);
      }
    } else if ($event.sectionName === this.grocerySectionsSection.label) {
      this.grocerySectionsSection.isOpen$ = of($event.isOpen);
      if ($event.isOpen && this.groceryStore.sections.length === 0) {
        this.notifyExpandSections.emit(this.groceryStore.id);
      }
    }
  }

  onAddAisleClicked() {
    this.addingAisle$ = of(true);
  }
}
