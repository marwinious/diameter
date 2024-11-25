import { Radius } from "../radius/radius_state_manager";

export class DiameterBase {

    #stateManager = {};

    constructor() {
        // Init Radius
        this.#stateManager = new Radius();
    }

    

}