import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroceryStoreComponent } from './add-grocery-store';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

describe('AddGroceryStoreComponent', () => {
  let component: AddGroceryStoreComponent;
  let fixture: ComponentFixture<AddGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroceryStoreComponent ],
      imports: [
        IonicModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
