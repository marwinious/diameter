import { Radius } from "../radius/radius_state_manager";

export class DiameterStoreBase {

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
        return this.radius.unsubscribe(eventLabel, callback);
    }

    baseWatch(eventLabel, propertyLabel, callback) {
        return this.radius.watch(eventLabel, propertyLabel, callback)
    }

    baseStopWatcher(eventLabel, propertyLabel, callback) {
        return this.radius.stopWatcher(eventLabel, propertyLabel, callback)
    }

    get radius() { return this.#radius }

    get guestStates() { return this.#guestStates }
    set guestStates(newGuestStates) { this.#guestStates = newGuestStates }

    get tangents() { return this.#guestStates }
    set tangents(newTangent) { this.#guestStates = newTangent }
}