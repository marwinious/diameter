//#region src/diameter.js
/**
* Creates a closure-based Diameter feature store
* @param {Object} options
* @param {string} options.name - Feature slice name in Radius & Vertex
* @param {Object} options.store - The Radius state instance
* @param {Object} [options.engine] - The Vertex engine instance (optional)
* @param {Object} [options.actions] - Custom UI-only actions/mutations
*/
function createFeatureStore({ name, store, engine, actions = {} }) {
	return {
		name,
		get state() {
			return store.getState(name);
		},
		subscribe(callback) {
			return store.watch(name, callback);
		},
		get actions() {
			if (engine) try {
				return engine.getActions(name);
			} catch {}
			return {};
		},
		...actions
	};
}
//#endregion
export { createFeatureStore };
