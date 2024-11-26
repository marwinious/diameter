### Diameter Javascript Store
Diameter is a simple, drop-in javascript store to add a layer between your front-end UI code and fundamental state management. 

You can abstract away numerous actions and methods from your components to keep front-end code simple, readable, and "dumber" by letting Diameter translate simple requests into slightly more complex state management concerns.

Diameter is built on top of Radius, making Diameter a store than manages state and actions where the state itself is handled by Radius under the hood.

### Creating a basic store
Spinning up a new store is very straight-forward, requiring one import and a new class.

```javascript
import { DiameterStore } from './path/to/diameter'

export class MyStore extends DiameterStore {

    constructor() {
        super();
    }

}
```

That's it! Anything beyond that basic setup is entirely up to you. Of course there are some suggested approaches to make the most use of Diameter as you'll see below.

## OPTIONAL SETUP
Everything below is entirely optional and is intended to give you an idea of how Diameter could be setup, but don't feel limited by any of this.

### Initializing State
A good idea for your store boilerplate might be to initialize various things upon instantiation to help bootstrap the store. Setting up some initial states can help make your code more readable and understandable since you'll have all of the relevant events in one easy place to reference.

The `.setState()` method accepts an event label and an object representing the state you want to add/change: `.setState(eventLabel, stateObj)`

```javascript
import { DiameterStore } from './path/to/diameter'

export class MyStore extends DiameterStore {

    constructor() {
        super();
        this.initState();
    }

    initState() {
        this.setState('some-modal', { showModal: false })
        this.setState('some-counter', { counter: 0 })
        this.setState('some-user', { user: {name: "John"} })
        this.setState('some-user-list', { userList: [ { name: "John", age: 30 } ] })
        this.setState('some-login-state'), { isLoggedIn: false }
    }

}
```

### Initializing Actions
Defining some common actions that your app might need will give all users of your store quick access to reusable state patterns.

The `.addAction()` method accepts an event label, an action name, and a state-changing callback: `.addAction(eventLabel, actionName, stateCallbackFn)`

Actions are isolated to a given event within a given store, maximizing scope separations, reducing namespace collisions, and symantically organizing your actions to events.

```javascript
import { DiameterStore } from './path/to/diameter'

export class MyStore extends DiameterStore {

    constructor() {
        super();
        this.initActions();
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

}
```

### Initializing Subscriptions
While you'll probably use state change subscriptions primarily in your components, a Diameter store can also subscribe to various events and run methods on itself to handle some concerns directly without involving outside components at all.

```javascript
import { DiameterStore } from './path/to/diameter'

export class MyStore extends DiameterStore {

    constructor() {
        super();
        this.initSubscriptions();
    }

    initSubscriptions() {
        const self = this;

        this.subscribe('some-login-state', (state) => {
            self.login(state);
        })
    }

    login(state) {
        console.log('made it to "login" in our sample store: ', state);
    }

}
```

### Sample Store Methods
Your Diameter store is intended to simplify certain actions that your app might want to take so that you can write smaller component code. In addition, it provides a single source of truth for everything a given store/feature might be concerned with which reduces the need to file-dive in your app to find various state, methods, etc.

```javascript
import { DiameterStore } from './path/to/diameter'

export class MyStore extends DiameterStore {

    constructor() {
        super();
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
```

### Putting it all together
Here is a sample store file based on all of the sample items above:

```javascript
import { DiameterStore } from './path/to/diameter'

export class MyStore extends DiameterStore {

    constructor() {
        super();
        this.initState();
        this.initActions();
        this.initSubscriptions();
    }

    initState() {
        this.setState('some-modal', { showModal: false })
        this.setState('some-counter', { counter: 0 })
        this.setState('some-user', { user: {name: "John"} })
        this.setState('some-user-list', { userList: [ { name: "John", age: 30 } ] })
        this.setState('some-login-state'), { isLoggedIn: false }
    }

    initSubscriptions() {
        const self = this;

        this.subscribe('some-login-state', (state) => {
            self.login(state);
        })
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

    login(state) {
        console.log('made it to "login" in our sample store: ', state);
    }

}
```

## Example Usage
Given the sample store setup above, here are some examples of how you might interact with this store from components in your app.

### Create a New Diameter Instance
In most cases you'll probably want Diameter to be a singleton imported at the top of your app. This will give you an app-wide store pattern and persistent state, however you could spin-up more than one based on your needs.

```javascript
import { Diameter } from './path/to/diameter'

// Create a new Diameter instance
const diameter = new Diameter();
```

### Add a Store to Diameter
Diameter itself has basic under-the-hood state management capabilities from Radius that are exposed, however you probably want to create new stores for various features of your app. If you just need basic state management, check out Radius which solely focuses on simple state management without a "store" concept baked in.

The `.addStore()` method accepts a store label and an instantiated store class: `.addStore(storeLabel, storeClassInstance)`

```javascript
import { Diameter } from './path/to/diameter'
import { MyStore } from './path/to/MyStore'

// Create a new Diameter instance
const diameter = new Diameter();

// Instantiate your new store. 
/* 
You would typically do this in a separate file where 
your Diameter instance is imported.
Showing it in one place here for example purposes. 
*/
const myStore = new MyStore();

// Add your new store to Diameter
diameter.addStore('myStore', myStore)
```

### Calling a Store Action
Now that you've attached your store to Diameter, you can access the various methods from it.

```javascript
import { Diameter } from './path/to/diameter'
import { MyStore } from './path/to/MyStore'

// Create a new Diameter instance
const diameter = new Diameter();

// Instantiate your new store. 
const myStore = new MyStore();

// Add your new store to Diameter
diameter.addStore('myStore', myStore)

// Run an action/method from your store
diameter.stores.myStore.adduser('John', 30) // (name, age)
```

### Subscribing to Store Changes
You can subscribe to state changes from specific events within specific stores. Each store has its own event subscriptions and definitions so you can work in isolation from store-to-store.

The `.subscribe()` method accepts an event label and a callback: `.subscribe(eventLabel, callbackFn)`

```javascript
import { Diameter } from './path/to/diameter'
import { MyStore } from './path/to/MyStore'

// Create a new Diameter instance
const diameter = new Diameter();

// Instantiate your new store. 
const myStore = new MyStore();

// Add your new store to Diameter
diameter.addStore('myStore', myStore)

// Subscribe to a state change
diameter.stores.myStore.subscribe('some-modal', (state) => { console.log('Someone change the modal state: ', state) } )

// Call an action from the store to change the state via the same event
diameter.stores.myStore.showModal()

// Alternatively, we could change the state directly, but you would typically hide this within a store method
diameter.stores.myStore.setState('some-modal', { showModal: true })
```

### Calling Actions from a Store
Remember those actions with initialized in our sample store above? Those are ready to be used by any component importing our store.

The `.runAction()` store method requires an event label and action name: `.runAction(eventLabel, actionName)`

If your action accepts arguments, then a third parameter can be passed: `.runAction(eventLabel, actionName, args)`

```javascript
import { Diameter } from './path/to/diameter'
import { MyStore } from './path/to/MyStore'

// Create a new Diameter instance
const diameter = new Diameter();

// Instantiate your new store. 
const myStore = new MyStore();

// Add your new store to Diameter
diameter.addStore('myStore', myStore)

// Call an action that was defined in the store
diameter.stores.myStore.runAction('some-counter', 'incrementCounter')

// Or maybe we want to use the core action to add a user instead of the simpler method we used earlier
diameter.stores.myStore.runAction('some-user-list', 'addUser', { name: "Bob", age: 34 })
```