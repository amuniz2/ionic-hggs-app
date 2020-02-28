export class ShoppingItem {
  pantryItemId: number;
  locationId: number;
  quantity: number;
  inCart: boolean;

  constructor(pantryItemId: number, locationId: number) {
    this.pantryItemId = pantryItemId;
    this.locationId = locationId;
    this.inCart = false;
    this.quantity = 1;
  }
}
