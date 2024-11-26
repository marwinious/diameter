import { Radius } from "../radius/radius_state_manager";

export class DiameterBase {

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
            console.warn(`The store "${storeName}" already exists.`)
        }
    }

    get radius() { return this.#radius }
    get stores() { return this.#stores }

}