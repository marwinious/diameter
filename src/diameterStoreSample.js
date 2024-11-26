import { DiameterStore } from "./diameterStore";

export class TestStore extends DiameterStore {

    constructor() {
        super();
        this.initState();
        this.initActions();
    }

    initState() {
        this.setState('some-modal', { showModal: false })
    }

    initActions() {
        this.addAction('some-modal', 'showModal', (state) => {
            return {...state, showModal: true }
        })
    }

    showModal() {
        this.setState('some-modal', { showModal: true })
    }

    hideModal() {
        this.setState('some-modal', { showModal: false })
    }

}