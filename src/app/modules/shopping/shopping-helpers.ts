import {Aisle, ShoppingList} from '../../model/shopping-list';
import {ShoppingItem} from '../../model/shopping-item';

export function buildShoppingList(shoppingItems: ShoppingItem[]): ShoppingList {
  const shoppingList = {
    aisles: [],
    sections: [],
    itemsWithNoStoreLocation: []
  }

  console.log('processing aisles');
  const filteredAisleItems = shoppingItems.filter(item => !!item.location?.aisle);

  const distinctAisles: Set<string> = new Set(filteredAisleItems.map(x => x.location.aisle));
  const filteredSectionItems = shoppingItems.filter((item) => !distinctAisles.has(item.location?.aisle) && !!item.location?.section);

  distinctAisles.forEach(aisle =>
    shoppingList.aisles.push(buildAisle(aisle, filteredAisleItems.filter(item => item.location.aisle === aisle))));

  console.log('processing sections');
  const distinctSections: Set<string> = new Set(filteredSectionItems.map(x => x.location.section));

  distinctSections.forEach(section => shoppingList.sections.push({
    name: section,
    shoppingItems: filteredSectionItems.filter(item => item.location.section === section)
  }));

  console.log('processing other items');
  shoppingList.itemsWithNoStoreLocation = shoppingItems.filter(item =>
    !item.location ||
    (!item.location || (!distinctAisles.has(item.location.aisle) && !distinctSections.has(item.location.section))));

  console.log(`returning ${JSON.stringify(shoppingList)}`);
  return shoppingList;
}

function buildAisle(groupName: string, itemsInGroup: ShoppingItem[]): Aisle {
  /// const itemsInAisle = filteredAisleItems.filter(item => item.location.aisle === aisle);
  const itemsInSectionWithinAisle = [];
  const itemsInAisleWithNoSection = [];

  itemsInGroup.forEach(item => {
    if (!!item.location.section) {
      itemsInSectionWithinAisle.push(item);
    } else {
      itemsInAisleWithNoSection.push(item);
    }
  });

  const newAisle = {
    name: groupName,
    sections: [],
    shoppingItems: itemsInAisleWithNoSection
  };

  const distinctSectionsInAisle = new Set(itemsInSectionWithinAisle.map(item => item.location.section));
  distinctSectionsInAisle.forEach(section => {
    newAisle.sections.push({
      name: section,
      shoppingItems: itemsInGroup.filter(item => item.location.section === section)
    });
  });
  return newAisle;
}
