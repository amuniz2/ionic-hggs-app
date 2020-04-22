import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingItemListComponent } from './shopping-item-list.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ShoppingItemComponent} from '../shopping-item/shopping-item.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('ShoppingItemListComponent', () => {
  let component: ShoppingItemListComponent;
  let fixture: ComponentFixture<ShoppingItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShoppingItemListComponent,
        ShoppingItemComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
