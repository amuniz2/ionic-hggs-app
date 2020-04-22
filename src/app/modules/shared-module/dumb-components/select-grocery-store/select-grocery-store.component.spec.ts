import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroceryStoreComponent } from './select-grocery-store.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('SelectGroceryStoreComponent', () => {
  let component: SelectGroceryStoreComponent;
  let fixture: ComponentFixture<SelectGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGroceryStoreComponent ],
      imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
