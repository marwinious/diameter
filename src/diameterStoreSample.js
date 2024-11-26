import { DiameterStore } from "./diameterStore";

export class TestStore extends DiameterStore {

    constructor() {
        super();
        this.initState();
        this.initActions();
    }

    initState() {
        this.setState('some-modal', { showModal: false })
        this.setState('some-counter', { counter: 0 })
        this.setState('some-user', { user: {name: "John"} })
        this.setState('some-user-list', { userList: [ { name: "John", age: 30 } ] })
    }

    initActions() {
        this.addAction('some-modal', 'showModal', (state) => {
            return {...state, showModal: true }
        })

        this.addAction('some-counter', 'incrementCounter', (state) => {
            return {...state, counter: state.counter+1}
        })

        this.addAction('some-user', 'changeName', (state, newName) => {
            return {...state, user: { name: newName }}
        })

        this.addAction('some-user-list', 'addUser', (state, newUser) => {
            return state.userList.push(newUser);
        })
    }

    showModal() {
        this.setState('some-modal', { showModal: true })
    }

    hideModal() {
        this.setState('some-modal', { showModal: false })
    }

    addUser(firstName, age) {
        this.runAction('some-user-list', 'addUser', { name: firstName, age: age })
    }

}