import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreLocationStoreComponent } from './grocery-store-location-store.component';
import {IonicModule} from '@ionic/angular';
import {ControlContainer, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

describe('GroceryStoreLocationStoreComponent', () => {
  let component: GroceryStoreLocationStoreComponent;
  let fixture: ComponentFixture<GroceryStoreLocationStoreComponent>;
  let fb: FormBuilder;

  beforeEach(async(() => {
    fb  = new FormBuilder();
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreLocationStoreComponent ],
      imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ControlContainer,  useValue: { control: new FormGroup({locationStore: new FormControl()})} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreLocationStoreComponent);
    component = fixture.componentInstance;
    // component.parentForm = new FormGroup( {locationStore: new FormControl()});
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      }
    );
  });
});
