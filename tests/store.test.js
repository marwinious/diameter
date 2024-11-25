import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { Diameter, DiameterStore } from '../main'
import { TestStore } from '../src/diameterStoreSample';

describe('stores', () => {

    /* let radius = new Radius();
    const mockData = {test: "Testing nav update event" };
    const mockResponse = mockData;
    const mockEvent = 'testEvent';

    beforeEach(() => {
        radius = new Radius();
    }) */

    let diameter = new Diameter();

    beforeEach(() => {
        diameter = new Diameter();
    })

    test('should create a new store and add it to diameter instance', () => {
        const newStore = new DiameterStore();
        diameter.addStore('newStore', newStore);

        console.log('diameter.stores.newStore: ', diameter.stores.newStore);

        expect(diameter.stores).toHaveProperty('newStore');
    })

    test('store guest state should match root state after root state change', () => {
        const newStore = new DiameterStore();
        const initialState = { foo: "bar" }
        const updatedState = { foo: "bar2" }

        // Add a new store to Diameter
        diameter.addStore('newStore', newStore);

        // Create initial state in root Diameter instance
        diameter.radius.state = initialState

        // Add the root Diameter state instance as a guest to the new store
        diameter.stores.newStore.addGuestState('test', diameter.radius);

        // Update the state of the root Diameter instance
        diameter.radius.state = updatedState

        console.log('diameter.radius.state: ', diameter.radius.state);
        console.log('diameter.stores.newStore.guestStates.test.state: ', diameter.stores.newStore.guestStates.test.state);

        expect(diameter.stores).toHaveProperty('newStore');
        expect(diameter.radius.state).toMatchObject(updatedState);
        expect(diameter.stores.newStore.guestStates.test.state).toMatchObject(updatedState);
    })

    test('store guest state should match root state after root state change', () => {
        const testStore = new TestStore();
        const initialState = { foo: "bar" }
        const updatedState = { foo: "bar2" }

        // Add a new store to Diameter
        diameter.addStore('testStore', testStore);

        console.log("diameter.stores.testStore.radius.getState('some-modal'): ", diameter.stores.testStore.radius.getState('some-modal') );

        diameter.stores.testStore.showModal();

        console.log("diameter.stores.testStore.radius.getState('some-modal'): ", diameter.stores.testStore.radius.getState('some-modal') );

        diameter.stores.testStore.hideModal();

        console.log("diameter.stores.testStore.radius.getState('some-modal'): ", diameter.stores.testStore.radius.getState('some-modal') );
        
    })

})