/**
 * Creates a decoupled, framework-agnostic Diameter feature store.
 *
 * @param {Object} options
 * @param {string} options.name - Feature slice name
 * @param {Object|Function} [options.state] - Plain object state, state store instance, or custom getter function
 * @param {Function} [options.subscribe] - Optional subscription/watcher setup function `(callback) => cleanupFn`
 * @param {Object|Function} [options.actions] - Action Map, or factory function `(context) => actions` receiving optional context/engine
 * @param {Object} [options.engine] - Optional execution engine (e.g., Vertex) passed to action factories or resolved directly
 * @param {Object} [options.meta] - Optional extra metadata/context
 */
export function createFeatureStore({
    name,
    state = {},
    subscribe,
    actions = {},
    engine,
    ...meta
} = {}) {
    if (!name) {
        throw new Error("[Diameter] A store 'name' is required.")
    }

    // 1. Unified State Resolver
    // Supports: Radius/store instances (.getState), function getters, or static objects
    const getState = () => {
        if (typeof state === "function") {
            return state()
        }
        if (state && typeof state.getState === "function") {
            return state.getState(name)
        }
        return state
    }

    // 2. Unified Subscriber Resolver
    // Supports: explicitly passed subscribe handler, or Radius/store watch/subscribe API
    const setupSubscription = (callback) => {
        if (typeof subscribe === "function") {
            return subscribe(callback)
        }
        if (state && typeof state.watch === "function") {
            return state.watch(name, callback)
        }
        if (state && typeof state.subscribe === "function") {
            return state.subscribe(callback)
        }
        // Graceful no-op if state source doesn't support subscriptions
        return () => {}
    }

    // 3. Unified Actions Resolver
    // Resolves actions from: Vertex engine (if provided & registered), plain action object, or action factory function
    const resolveActions = () => {
        let resolvedActions = {}

        // Fallback or attempt to fetch actions from Vertex engine if provided
        if (engine && typeof engine.getActions === "function") {
            try {
                resolvedActions = { ...engine.getActions(name) }
            } catch {
                // Gracefully ignore if controller isn't registered in Vertex
            }
        }

        // Merge or execute passed action definitions
        if (typeof actions === "function") {
            const factoryResult = actions({
                name,
                state: getState(),
                engine,
                ...meta,
            })
            resolvedActions = { ...resolvedActions, ...factoryResult }
        } else if (actions && typeof actions === "object") {
            resolvedActions = { ...resolvedActions, ...actions }
        }

        return resolvedActions
    }

    return {
        name,

        // Reactive slice reader
        get state() {
            return getState()
        },

        // Subscribe to state updates
        subscribe(callback) {
            return setupSubscription(callback)
        },

        // Dynamically resolved or lazily evaluated actions
        get actions() {
            return resolveActions()
        },

        // Optional metadata escape hatch
        ...meta,
    }
}
