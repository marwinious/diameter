import { Radius } from "../radius/radius_state_manager";

export class DiameterStoreBase {

    #radius = {}
    #guestStates = {}

    constructor() {
        this.#radius = new Radius();
    }

    addGuestState(guestLabel, guestState) {
        this.#guestStates[guestLabel] = guestState;
    }

    get radius() { return this.#radius }
    get guestStates() { return this.#guestStates }
}