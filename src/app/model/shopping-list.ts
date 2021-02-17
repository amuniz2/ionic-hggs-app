import {ShoppingItem} from './shopping-item';

export class ShoppingItemGroup {
  name: string;
  shoppingItems: ShoppingItem[];
}

export class Aisle extends ShoppingItemGroup {
  sections: ShoppingItemGroup[];
}

export class ShoppingList {
  aisles: Aisle[];
  sections: ShoppingItemGroup[];
  itemsWithNoStoreLocation: ShoppingItem[];
}
