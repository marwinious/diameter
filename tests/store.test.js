import { describe, expect, test, expectTypeOf, vi, beforeEach } from 'vitest'
import { Diameter, DiameterStore } from '../main'
import { TestStore } from '../src/diameterStoreSample';

describe('stores', () => {

    /* let radius = new Radius();
    const mockData = {test: "Testing nav update event" };
    
    const mockEvent = 'testEvent';

    beforeEach(() => {
        radius = new Radius();
    }) */

    const mockData = {test: "Testing nav update event" };
    const mockResponse = mockData;

    let diameter = new Diameter();

    beforeEach(() => {
        diameter = new Diameter();
    })

    test('should create a new store and add it to diameter instance', () => {
        const newStore = new DiameterStore();
        diameter.addStore('newStore', newStore);

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
        const modalShownState = { showModal: true }
        const modalHideState = { showModal: false }

        // Add a new store to Diameter
        diameter.addStore('testStore', testStore);

        const modalStartState = diameter.stores.testStore.getState('some-modal');
        console.log("modalStartState: ", modalStartState );

        // Show the modal
        diameter.stores.testStore.showModal();

        const modalSecondState = diameter.stores.testStore.getState('some-modal');
        console.log("modalSecondState: ", modalSecondState );

        // Hide the modal
        diameter.stores.testStore.hideModal();

        const modalThirdState = diameter.stores.testStore.getState('some-modal');
        console.log("modalThirdState: ", modalThirdState );
        
        expect(modalStartState).toMatchObject(modalHideState)
        expect(modalSecondState).toMatchObject(modalShownState)
        expect(modalThirdState).toMatchObject(modalHideState)
    })

    test('action should update state', () => {
        const testStore = new TestStore();
        const modalShownState = { showModal: true }
        const modalHideState = { showModal: false }

        // Add a new store to Diameter
        diameter.addStore('testStore', testStore);

        const modalStartState = diameter.stores.testStore.getState('some-modal');
        console.log("modalStartState: ", modalStartState );

        // Run an action to show the modal
        diameter.stores.testStore.runAction('some-modal', 'showModal');

        const modalSecondState = diameter.stores.testStore.getState('some-modal');
        console.log("modalSecondState: ", modalSecondState );

        expect(modalStartState).toMatchObject(modalHideState)
        expect(modalSecondState).toMatchObject(modalShownState)
    })

    test('action should trigger subscriber callback', () => {
        const mockCallbackResponse = { showModal: true }
        const mockCallback = vi.fn(() => mockResponse)
        const testStore = new TestStore();
        
        // Add a new store to Diameter
        diameter.addStore('testStore', testStore);

        // Create subscription
        diameter.stores.testStore.subscribe('some-modal', (data) => {
            mockCallback();
        })

        // Run Action
        diameter.stores.testStore.runAction('some-modal', 'showModal');

        const modalSecondState = diameter.stores.testStore.getState('some-modal');
        console.log("modalSecondState: ", modalSecondState );

        expect(mockCallback).toHaveBeenCalledOnce();
        expect(modalSecondState).toMatchObject(mockCallbackResponse)
    })

    test('action should add user to array', () => {
        const testStore = new TestStore();
        const expectedState = { userList: [ { name: 'John', age: 30 }, { name: 'Jane', age: 29 } ] }
        
        // Add a new store to Diameter
        diameter.addStore('testStore', testStore);

        // Set initial state
        diameter.stores.testStore.setState('some-user-list', { userList: [ { name: "John", age: 30 } ] })

        // Run Action
        diameter.stores.testStore.runAction('some-user-list', 'addUser', { name: "Jane", age: 29 });

        const secondState = diameter.stores.testStore.getState('some-user-list');
        console.log("secondState: ", secondState );

        expect(secondState).toMatchObject(expectedState)
    })

    test('action should add user to array via store method', () => {
        const testStore = new TestStore();
        const expectedState = { userList: [ { name: 'John', age: 30 }, { name: 'Jane', age: 29 } ] }
        
        // Add a new store to Diameter
        diameter.addStore('testStore', testStore);

        // Set initial state
        diameter.stores.testStore.setState('some-user-list', { userList: [ { name: "John", age: 30 } ] })

        // Call store action
        diameter.stores.testStore.addUser('Jane', 29)

        const secondState = diameter.stores.testStore.getState('some-user-list');
        console.log("secondState: ", secondState );

        expect(secondState).toMatchObject(expectedState)
    })

})