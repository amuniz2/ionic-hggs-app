export class RouterStub {
  getCurrentNavigation() {
    return {
      extras: {
        queryParams: {
          newItem: true,
          id: 1
        },
        state: {
          locationId: 'someId',
          locationName: 'someName'
        }
      }
    };
  }
}
