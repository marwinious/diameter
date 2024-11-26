import { DiameterStoreBase } from "./base/diameterStoreBase";

export class DiameterStore extends DiameterStoreBase {

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

}