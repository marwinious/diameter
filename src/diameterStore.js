import { DiameterStoreBase } from "./base/diameterStoreBase";

export class DiameterStore extends DiameterStoreBase {

    constructor() {
        super();
    }

    addGuestState(guestLabel, guestState) {
        super.baseAddGuestState(guestLabel, guestState)
    }

    getState(eventLabel) {
        return super.baseGetState(eventLabel)
    }

    addAction(eventLabel, actionName, mutatorFn) {
        super.baseAddAction(eventLabel, actionName, mutatorFn)
    }

    runAction(eventLabel, actionName, ...args) {
        super.baseRunAction(eventLabel, actionName, ...args)
    }

    setState(eventLabel, newState) {
        super.baseSetState(eventLabel, newState)
    }

    subscribe(eventLabel, callback) {
        super.baseSubscribe(eventLabel, callback);
    }

    unsubscribe(eventLabel, callback) {
        super.baseUnsubscribe(eventLabel, callback);
    }

}