export class StoreTable {
  static COLS = class {
    public static ID = 'store_id';
    public static STORE_NAME = 'store_name';
  };
  public static NAME = 'stores';
}

export class StoreGrocerySectionTable {
  public static COLS = class {
    public static GROCERY_SECTION = 'grocery_section';
    public static STORE_ID = 'store_id';
  };
  public static NAME = 'storeGrocerySections';
}

export class StoreGroceryAisleTable {
  public static COLS = class {
    public static GROCERY_AISLE = 'grocery_aisle';
    public static STORE_ID = 'store_id';
  };
  public static NAME = 'storeGroceryAisles';
}

export class LocationTable {
  public static COLS = class {
    public static ID = 'location_id';
    public static STORE_ID = 'store_id';
    public static SECTION_NAME = 'section_name';
    public static AISLE = 'store_aisle';
  };
  public static NAME = 'grocery_item_locations';
}

export class PantryItemTable {
  public static NAME = 'pantryItems';

  public static COLS = class {
    public static ID = 'pantry_item_id';
    public static NAME = 'name';
    public static DESCRIPTION = 'description';
    public static SELECT_BY_DEFAULT = 'select_by_default';
    public static DEFAULT_QUANTITY = 'default_quantity';
    public static UNITS = 'units';
  };
}

export class ShoppingItemTable {
  public static NAME = 'shoppingItems';

  public static COLS = class {
    public static PANTRY_ITEM_ID = 'pantry_item_id';
    public static SELECTED = 'selected';
    public static IN_CART = 'in_cart';
    public static QUANTITY = 'quantity';
    public static UNITS = 'units';
  };
}

export class PantryItemLocationTable
{
  public static NAME = 'pantryitemlocationtable';

  public static COLS = class {
    //        public static UUID = 'uuid';
    public static LOCATION_ID = 'locationid';
    public static PANTRY_ITEM_ID = 'pantryitemid';
  }
}
