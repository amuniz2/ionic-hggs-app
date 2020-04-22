import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HggsAccordionComponent } from './hggs-accordion.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';

describe('HggsAccordionComponent', () => {
  let component: HggsAccordionComponent;
  let fixture: ComponentFixture<HggsAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HggsAccordionComponent ],
      imports: [
        IonicModule,
        FormsModule
      ]    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HggsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
