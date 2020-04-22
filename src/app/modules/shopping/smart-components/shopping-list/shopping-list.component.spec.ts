import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SelectGroceryStoreComponent} from '../../../shared-module/dumb-components/select-grocery-store/select-grocery-store.component';
import {ShoppingItemListComponent} from '../../dumb-components/shopping-item-list/shopping-item-list.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../../store/app.reducers';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingListComponent,
        SelectGroceryStoreComponent,
        ShoppingItemListComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
        StoreModule.forRoot(reducers, {
        }),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
