import {ShoppingItemListComponent} from './shopping-item-list.component';

fdescribe('BuildShoppingList tests', () => {
  const component = new ShoppingItemListComponent();
  const defaultLocation = {
    locationId: 1,
    aisle: null,
    section: null
  };

  const defaultShoppingItem = {
    storeId: 1,
    name: 'test',
    quantity: 1,
    units: 'box',
    pantryItemId: 1,
    description: 'test',
    inCart: false,
    location: defaultLocation
  };

  beforeEach(() => {
    component.shoppingItems = [];
  });

  describe('should build shopping list with no aisles or sections', () => {
    it('when no aisle or section is assigned', () => {
      component.shoppingItems.push(defaultShoppingItem);

      component.buildShoppingList();

      expect(component.shoppingList.aisles.length).toBe(0);
      expect(component.shoppingList.sections.length).toBe(0);
      expect(component.shoppingList.itemsWithNoStoreLocation.length).toBe(1);
    });

    it('when no location is assigned', () => {
      component.shoppingItems.push({
        ...defaultShoppingItem,
        location: null
      });

      component.buildShoppingList();

      expect(component.shoppingList.aisles.length).toBe(0);
      expect(component.shoppingList.sections.length).toBe(0);
      expect(component.shoppingList.itemsWithNoStoreLocation.length).toBe(1);
    })
  })

  describe('should build shopping list with aisles and no sections', () => {
    describe('when only aisles are assigned', () => {
      it('and no sections are defined in the aisle', () => {
        component.shoppingItems.push({
          ...defaultShoppingItem,
          location: {
            ...defaultLocation,
            aisle: '1'
          }
        });

        component.buildShoppingList();

        expect(component.shoppingList.aisles.length).toBe(1);
        expect(component.shoppingList.sections.length).toBe(0);
        expect(component.shoppingList.itemsWithNoStoreLocation.length).toBe(0);

        expect(component.shoppingList.aisles[0].sections.length).toBe(0);
        expect(component.shoppingList.aisles[0].shoppingItems.length).toBe(1);

        expect(component.shoppingList.aisles[0].shoppingItems[0].name).toBe(defaultShoppingItem.name);
      });

      it('and sections are defined in the aisle', () => {
        component.shoppingItems.push({
          ...defaultShoppingItem,
          location: {
            ...defaultLocation,
            aisle: '1',
            section: 'dairy'
          }
        });

        component.buildShoppingList();

        expect(component.shoppingList.aisles.length).toBe(1);
        expect(component.shoppingList.sections.length).toBe(0);
        expect(component.shoppingList.itemsWithNoStoreLocation.length).toBe(0);

        expect(component.shoppingList.aisles[0].sections.length).toBe(1);
        expect(component.shoppingList.aisles[0].shoppingItems.length).toBe(0);

        expect(component.shoppingList.aisles[0].sections[0].name).toBe('dairy');
        expect(component.shoppingList.aisles[0].sections[0].shoppingItems.length).toBe(1);
        expect(component.shoppingList.aisles[0].sections[0].shoppingItems[0].name).toBe(defaultShoppingItem.name);
      });
    });
  });

  describe('should build shopping list with sections and no aisles', () => {
    it('when only sections are assigned', () => {
      component.shoppingItems.push({
        ...defaultShoppingItem,
        location: {
          ...defaultLocation,
          section: 'dairy'
        }
      });

      component.buildShoppingList();

      expect(component.shoppingList.sections.length).toBe(1);
      expect(component.shoppingList.aisles.length).toBe(0);
      expect(component.shoppingList.itemsWithNoStoreLocation.length).toBe(0);

      expect(component.shoppingList.sections[0].shoppingItems.length).toBe(1);

      expect(component.shoppingList.sections[0].shoppingItems[0].name).toBe(defaultShoppingItem.name);
    });
  });

  describe('should build shopping list with aisles, sections in aisles, sections, and items with neither', () => {
    it('should have each item in list only once', () => {
      component.shoppingItems.push({
        ...defaultShoppingItem,
        location: {
          ...defaultLocation,
          aisle: '1',
          section: 'dairy'
        }
      }, {
          ...defaultShoppingItem,
          name: 'in aisle 1, no section',
          location: {
            ...defaultLocation,
            aisle: '1'
          }
        }, {
          ...defaultShoppingItem,
          name: 'in dairy section, no aisle',
          location: {
            ...defaultLocation,
            section: 'dairy'
          },
        }, {
          ...defaultShoppingItem,
          name: 'no location',
          location: {
            ...defaultLocation,
          }
        });

      component.buildShoppingList();

      expect(component.shoppingList.aisles.length).toBe(1);
      expect(component.shoppingList.sections.length).toBe(1);
      expect(component.shoppingList.itemsWithNoStoreLocation.length).toBe(1);

      expect(component.shoppingList.aisles[0].sections.length).toBe(1);
      expect(component.shoppingList.sections[0].shoppingItems.length).toBe(1);
      expect(component.shoppingList.aisles[0].sections[0].shoppingItems.length).toBe(1);

      expect(component.shoppingList.aisles[0].sections[0].shoppingItems[0].name).toBe(defaultShoppingItem.name);
      expect(component.shoppingList.aisles[0].shoppingItems[0].name).toBe('in aisle 1, no section');
      expect(component.shoppingList.sections[0].shoppingItems[0].name).toBe('in dairy section, no aisle');
      expect(component.shoppingList.itemsWithNoStoreLocation[0].name).toBe('no location');
    });
  });
});
