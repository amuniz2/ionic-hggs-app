import {Component, Input, OnInit} from '@angular/core';
import {ShoppingItem} from '../../../../model/pantry-item';

@Component({
  selector: 'app-shopping-item-list',
  templateUrl: './shopping-item-list.component.html',
  styleUrls: ['./shopping-item-list.component.scss']
})
export class ShoppingItemListComponent implements OnInit {

  @Input()
  shoppingItems: ShoppingItem[];

  constructor() { }

  ngOnInit() {
  }

}
