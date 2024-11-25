import { Radius } from "../radius/radius_state_manager";

export class DiameterBase {

    #stateManager = {};
    #stores = {};

    constructor() {
        // Init Radius
        this.#stateManager = new Radius();
    }

    addStore(storeName, storeClass) {
        // Only init store if it doesn't exist yet
        if(!this.#stores.hasOwnProperty(storeName)) {
            this.#stores[storeName] = new storeClass();
        }
        else {
            console.warn(`The store "${storeName}" already exists.`)
        }
    }

}