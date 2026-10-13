/**
 * Creates a closure-based Diameter feature store
 * @param {Object} options
 * @param {string} options.name - Feature slice name in Radius & Vertex
 * @param {Object} options.store - The Radius state instance
 * @param {Object} [options.engine] - The Vertex engine instance (optional)
 * @param {Object} [options.actions] - Custom UI-only actions/mutations
 */
export function createFeatureStore({ name, store, engine, actions = {} }) {
    return {
        name,

        // 1. Reactive state reader
        get state() {
            return store.getState(name)
        },

        // 2. Watch feature slice for UI updates
        subscribe(callback) {
            return store.watch(name, callback)
        },

        // 3. Delegate to Vertex engine actions automatically
        get actions() {
            if (engine) {
                try {
                    return engine.getActions(name)
                } catch {
                    // Graceful fallback if controller isn't registered in Vertex
                }
            }
            return {}
        },

        // 4. Custom UI-specific mutations/actions
        ...actions,
    }
}
