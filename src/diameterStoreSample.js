import { DiameterStore } from "./diameterStore";

export class TestStore extends DiameterStore {

    constructor() {
        super();
        this.initState();
    }

    initState() {
        this.radius.setState('some-modal', { showModal: false })
    }

    showModal() {
        this.radius.setState('some-modal', { showModal: true })
    }

    hideModal() {
        this.radius.setState('some-modal', { showModal: false })
    }

}