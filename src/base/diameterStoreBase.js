import { Radius } from "../radius/radius_state_manager";

export class DiameterStoreBase {

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
        this.radius.setState(eventLabel, newState)
    }

    baseSubscribe(eventLabel, callback) {
        this.radius.subcribe(eventLabel, callback);
    }

    baseUnsubscribe(eventLabel, callback) {
        this.radius.unsubcribe(eventLabel, callback);
    }

    get radius() { return this.#radius }
    get guestStates() { return this.#guestStates }
    set guestStates(newGuestStates) { this.#guestStates = newGuestStates }
}