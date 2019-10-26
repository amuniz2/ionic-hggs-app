import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../model/grocery-store';
import {StoreAisle} from '../grocery-store-aisles/grocery-store-aisles.component';
import {Observable, of} from 'rxjs';
import {CollapsedStatusChangedEvent} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';

interface PageSection {
  label: string;
  isOpen$: Observable<boolean>;
}


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
  grocerySectionsSection: PageSection;
  inventorySection: PageSection;

  @Input()
  groceryStore: GroceryStore;

  @Output()
  notifyNewStoreAisleRequested: EventEmitter<StoreAisle> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onNotifyNewStoreAisleRequest($event: StoreAisle) {
    this.notifyNewStoreAisleRequested.emit($event);
  }

  public captureName($event: CollapsedStatusChangedEvent) {
    if ($event.sectionName === this.aislesSection.label) {
      this.aislesSection.isOpen$ = of($event.isOpen);
    }
  }
}
