import { DiameterStoreBase } from "./base/diameterStoreBase";

export class DiameterStore extends DiameterStoreBase {

    constructor() {
        super();
    }

    addTangent(guestLabel, guestState) {
        super.baseAddGuestState(guestLabel, guestState)
    }

    getState(eventLabel) {
        return super.baseGetState(eventLabel)
    }

    getTangent(tangentLabel) {
        return super.tangents[tangentLabel];
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

    setStateOnly(eventLabel, newState) {
        super.baseSetStateOnly(eventLabel, newState)
    }

    subscribe(eventLabel, callback) {
        super.baseSubscribe(eventLabel, callback);
    }

    unsubscribe(eventLabel, callback) {
        super.baseUnsubscribe(eventLabel, callback);
    }

}