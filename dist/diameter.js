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
        this.notify(event);

        // Return
        return stateReturn
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

    subscribe(event, callbackFn) {
        // Make sure we're getting a function for the callback
        if(typeof callbackFn !== 'function') { throw new Error("Subscriber callbacks must be functions") } 

        // Init event if it doesn't exist
        this.initEvent(event);

        // Add callback to event
        this.#events[event].push(callbackFn); 

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
            this.#events[event] = [];
        }
    }

    unsubscribe(event, callbackFn) {
        let unsubscribedFromEvent = false;

        // Filter event to only items that do not match the callbackFn (it will be omitted)
        this.#events[event] = this.#events[event].filter((sub) => {
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

    notify(event) {
        const notifiedSubscribers = [];
        const eventState = this.getState(event);

        if(this.#events.hasOwnProperty(event)) {
            this.#events[event].forEach((subscriber) => {
                subscriber(eventState);
                notifiedSubscribers.push(subscriber);
            });
        }

        return { 
            event: event,
            notifiedSubscribers: notifiedSubscribers
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
        this.#guestStates[guestLabel] = guestState;
    }

    baseGetState(eventLabel) {
        return this.radius.getState(eventLabel);
    }

    baseAddAction(eventLabel, actionName, mutatorFn) {
        this.#radius.addAction(eventLabel, actionName, mutatorFn);
    }

    baseRunAction(eventLabel, actionName, ...args) {
        this.radius.runAction(eventLabel, actionName, ...args);
    }

    baseSetState(eventLabel, newState) {
        this.radius.setState(eventLabel, newState);
    }

    baseSubscribe(eventLabel, callback) {
        this.radius.subscribe(eventLabel, callback);
    }

    baseUnsubscribe(eventLabel, callback) {
        this.radius.unsubcribe(eventLabel, callback);
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
        super.baseAddGuestState(guestLabel, guestState);
    }

    getState(eventLabel) {
        return super.baseGetState(eventLabel)
    }

    getTangent(tangentLabel) {
        return super.tangents[tangentLabel];
    }

    addAction(eventLabel, actionName, mutatorFn) {
        super.baseAddAction(eventLabel, actionName, mutatorFn);
    }

    runAction(eventLabel, actionName, ...args) {
        super.baseRunAction(eventLabel, actionName, ...args);
    }

    setState(eventLabel, newState) {
        super.baseSetState(eventLabel, newState);
    }

    subscribe(eventLabel, callback) {
        super.baseSubscribe(eventLabel, callback);
    }

    unsubscribe(eventLabel, callback) {
        super.baseUnsubscribe(eventLabel, callback);
    }

}

export { Diameter, DiameterStore };
//# sourceMappingURL=diameter.js.map
