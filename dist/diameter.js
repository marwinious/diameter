class RadiusBase {

    #states = {}
    #events = {};
    #actions = {};

    constructor() {
        
    }

    getState(event) {
        return this.#states[event] || {};
    }

    setState(event, newState) {
        // Set state
        const stateReturn = this.setStateOnly(event, newState);

        // Notify event subscribers of event state changes
        const notified = this.notify(event, stateReturn.newState, stateReturn.previousState);

        // Return
        return {...stateReturn, ...notified}
    }

    setStateOnly(event, newState) {
        // Init event state and subscribers if it doesn't exist
        this.initEvent(event);
        const previousState = this.#states[event];

        // Merge new state with current state
        this.#states[event] = {...this.#states[event], ...newState};

        // Return
        return {
            event: event,
            newState: newState,
            previousState: previousState
        }
    }

    watch(event, property, callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") } 

        // Init event if it doesn't exist
        this.initEvent(event);

        // Init property if it doesn't exist
        if(!this.#events[event].watchers.properties[property]) { this.#events[event].watchers.properties[property] = []; }

        // Add callback to event
        this.#events[event].watchers.properties[property].push(callbackFn);

        // Return
        return {
            event: event,
            property: property,
            callback: callbackFn,
            unsubscribe: () => { this.stopWatcher(event, property, callbackFn); }
        }
    }

    subscribe(event, callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") } 

        // Init event if it doesn't exist
        this.initEvent(event);

        // Add callback to event
        this.#events[event].subscribers.push(callbackFn); 

        // Return
        return {
            event: event,
            callback: callbackFn,
            unsubscribe: () => { this.unsubscribe(event, callbackFn); }
        }

    }

    initEvent(event) {
        if(!this.#states[event]) { 
            this.#states[event] = {};
            this.#events[event] = {
                subscribers: [],
                watchers: {
                    properties: {}
                }
            };
        }
    }

    unsubscribe(event, callbackFn) {
        let unsubscribedFromEvent = false;

        // Filter event to only items that do not match the callbackFn (it will be omitted)
        this.#events[event].subscribers = this.#events[event].subscribers.filter((sub) => {
            if(sub === callbackFn) { unsubscribedFromEvent = true; }
            return sub !== callbackFn
        });

        if(unsubscribedFromEvent) {
            return {
                event: event,
                unsubscribedCallback: callbackFn
            }
        }

        return {
            event: event,
            unsubscribedCallback: "not found"
        }

    }

    stopWatcher(event, property, callbackFn) {
        let unsubscribedFromWatcher = false;

        // Filter event to only items that do not match the callbackFn (it will be omitted)
        this.#events[event].watchers.properties[property] = this.#events[event].watchers.properties[property].filter((sub) => {
            if(sub === callbackFn) { unsubscribedFromWatcher = true; }
            return sub !== callbackFn
        });

        if(unsubscribedFromWatcher) {
            return {
                event: event,
                property: property,
                unsubscribedCallback: callbackFn
            }
        }

        return {
            event: event,
            property: property,
            unsubscribedCallback: "not found"
        }
    }

    addAction(event, actionName, mutatorFn) {
        // Make sure we're getting a function for the callback
        if(typeof mutatorFn !== 'function') { throw new Error("Action callbacks must be functions") } 

        // Initialize the event category if it doesn't exist
        if(!this.#actions[event]) { 
            this.#actions[event] = {}; 
        }

        // Add action to list of actions
        this.#actions[event][actionName] = mutatorFn;

        return {
            event: event,
            actionName: actionName,
            mutator: mutatorFn
        }
    }

    runAction(event, actionName, ...args) {
        const action = this.#actions[event]?.[actionName];
        if(action) {
            const newState = action(this.#states[event], ...args);
            if(newState) {
                const previousState = this.getState(event);
                this.setState(event, newState);

                return {
                    newState: this.getState(event),
                    previousState: previousState
                }
            }
        }
        else {
            console.warn(`Action "${actionName}" for event "${event}" not found`);
        }
    }

    notify(event, newState, previousState) {
        const notifiedSubscribers = [];
        const eventState = this.getState(event);
        let notifyWatchers = {
            notifiedWatchers: [],
            changedProperties: []
        };

        if(this.#events.hasOwnProperty(event)) {
            // Notify subscribers
            this.#events[event].subscribers.forEach((subscriber) => {
                subscriber(eventState);
                notifiedSubscribers.push(subscriber);
            });

            // Notify watchers
            notifyWatchers = this.notifyWatchers(event, newState, previousState);
        }

        return { 
            event: event,
            notifiedSubscribers: notifiedSubscribers,
            notifiedWatchers: notifyWatchers.notifiedWatchers,
            changedProperties: notifyWatchers.changedProperties
        }
    }

    notifyWatchers(event, newState, previousState) {
        const notifiedWatchers = [];
        const changedProperties = [];
        const watchers = this.#events[event].watchers;

        // Loop through previousState to find matches for watched properties
        Object.entries(previousState).forEach(([key, value]) => {
            // If a watched property matches a previousState property
            if(watchers.properties.hasOwnProperty(key)) {
                // Check if previousState property has changed in newState
                if(previousState[key] !== newState[key]) {
                    // Something changed on this property, so we need to notify all watchers
                    const propertyWatchers = watchers.properties[key];
                    changedProperties.push(key);

                    // Loop through all watchers of this property and fire callbacks
                    propertyWatchers.forEach((watcher) => {
                        watcher(newState);
                        notifiedWatchers.push(watcher);
                    });
                }
            }
        });

        return {
            event: event,
            notifiedWatchers: notifiedWatchers,
            changedProperties: changedProperties
        }
    }

}

class Radius extends RadiusBase {

    constructor() {
        super();
    }

}

class DiameterBase {

    #radius = {};
    #stores = {};

    constructor() {
        // Init Radius
        this.#radius = new Radius();
    }

    addStore(storeName='', storeClass={}) {
        // Only init store if it doesn't exist yet
        if(storeName && !this.#stores.hasOwnProperty(storeName)) {
            // Add new store to local stores array
            this.#stores[storeName] = storeClass;
        }
        else {
            console.warn(`The store "${storeName}" already exists.`);
        }
    }

    get radius() { return this.#radius }
    get stores() { return this.#stores }

}

class Diameter extends DiameterBase {

    constructor() {
        super();
    }

    

}

class DiameterStoreBase {

    #radius = {}
    #guestStates = {}

    constructor() {
        this.#radius = new Radius();
    }

    baseAddGuestState(guestLabel, guestState) {
        return this.#guestStates[guestLabel] = guestState;
    }

    baseGetState(eventLabel) {
        return this.radius.getState(eventLabel);
    }

    baseAddAction(eventLabel, actionName, mutatorFn) {
        return this.#radius.addAction(eventLabel, actionName, mutatorFn);
    }

    baseRunAction(eventLabel, actionName, ...args) {
        return this.radius.runAction(eventLabel, actionName, ...args);
    }

    baseSetState(eventLabel, newState) {
        return this.radius.setState(eventLabel, newState)
    }

    baseSetStateOnly(eventLabel, newState) {
        return this.radius.setStateOnly(eventLabel, newState)
    }

    baseSubscribe(eventLabel, callback) {
        return this.radius.subscribe(eventLabel, callback);
    }

    baseUnsubscribe(eventLabel, callback) {
        return this.radius.unsubcribe(eventLabel, callback);
    }

    baseWatch(eventLabel, propertyLabel, callback) {
        return this.radius.watch(eventLabel, propertyLabel, callback)
    }

    baseStopWatcher(eventLabel, propertyLabel, callback) {
        return this.radius.stopWatcher(eventLabel, propertyLabel, callback)
    }

    get radius() { return this.#radius }

    get guestStates() { return this.#guestStates }
    set guestStates(newGuestStates) { this.#guestStates = newGuestStates; }

    get tangents() { return this.#guestStates }
    set tangents(newTangent) { this.#guestStates = newTangent; }
}

class DiameterStore extends DiameterStoreBase {

    constructor() {
        super();
    }

    addTangent(guestLabel, guestState) {
        return super.baseAddGuestState(guestLabel, guestState)
    }

    getState(eventLabel) {
        return super.baseGetState(eventLabel)
    }

    getTangent(tangentLabel) {
        return super.tangents[tangentLabel];
    }

    addAction(eventLabel, actionName, mutatorFn) {
        return super.baseAddAction(eventLabel, actionName, mutatorFn)
    }

    runAction(eventLabel, actionName, ...args) {
        return super.baseRunAction(eventLabel, actionName, ...args)
    }

    setState(eventLabel, newState) {
        return super.baseSetState(eventLabel, newState)
    }

    setStateOnly(eventLabel, newState) {
        return super.baseSetStateOnly(eventLabel, newState)
    }

    subscribe(eventLabel, callback) {
        return super.baseSubscribe(eventLabel, callback);
    }

    unsubscribe(eventLabel, callback) {
        return super.baseUnsubscribe(eventLabel, callback);
    }

    watch(eventLabel, propertyLabel, callback) {
        return super.baseWatch(eventLabel, propertyLabel, callback);
    }

    stopWatcher(eventLabel, propertyLabel, callback) {
        return super.baseStopWatcher(eventLabel, propertyLabel, callback);
    }

}

export { Diameter, DiameterStore };
//# sourceMappingURL=diameter.js.map
