import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {ActivatedRoute, Router} from '@angular/router';
import {selectPantryItem, selectPantryItemsError} from '../../store/pantry-management.selectors';
import {PantryItem} from '../../../../model/pantry-item';
import {Observable, of} from 'rxjs';
import * as fromActions from '../../../pantry-management/store/pantry-management.actions';
import {NewItemLocationRequest} from '../../dumb-components/pantry-item-locations/pantry-item-locations.component';


@Component({
  selector: 'app-edit-pantry-item',
  templateUrl: './edit-pantry-item.component.html',
  styleUrls: ['./edit-pantry-item.component.scss']
})
export class EditPantryItemComponent implements OnInit {
  pantryItemId: number;
  pantryItem$: Observable<PantryItem>;
  isNewItem: boolean;
  error$: Observable<Error>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    this.isNewItem = this.router.getCurrentNavigation().extras.queryParams.newItem;
    this.pantryItemId = this.router.getCurrentNavigation().extras.queryParams.id;
    if (this.isNewItem) {
      this.pantryItem$ = of({
        id: 0,
        name: '',
        description: '',
        locations: [],
      });
    } else {
      this.pantryItem$ = this.store.pipe(select(selectPantryItem(this.pantryItemId)));
    }
    this.error$ = this.store.pipe(select(selectPantryItemsError));
  }

  ngOnInit() {
  }

  savePantryItemChanges($event: PantryItem) {
    this.store.dispatch(new fromActions.SavePantryItem($event));
  }

  addPantryItem($event: PantryItem) {
    $event.name = this.htmlEncode($event.name);
    $event.description = this.htmlEncode($event.description);
    this.store.dispatch(new fromActions.SaveNewPantryItem($event));
  }
  htmlEncode(str: string): string {
    return str;
    // return str
    //   .replace(/&/g, '&amp;')
    //   .replace(/"/g, '&quot;')
    //   .replace(/'/g, '&#39;')
    //   .replace(/</g, '&lt;')
    //   .replace(/>/g, '&gt;');
  }

  addPantryItemLocation($event: NewItemLocationRequest) {
    this.store.dispatch(new fromActions.AddPantryItemLocationRequest($event));
  }
}
