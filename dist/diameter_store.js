//#region src/diameter.js
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
function createFeatureStore({ name, state = {}, subscribe, actions = {}, engine, ...meta } = {}) {
	if (!name) throw new Error("[Diameter] A store 'name' is required.");
	const getState = () => {
		if (typeof state === "function") return state();
		if (state && typeof state.getState === "function") return state.getState(name);
		return state;
	};
	const setupSubscription = (callback) => {
		if (typeof subscribe === "function") return subscribe(callback);
		if (state && typeof state.watch === "function") return state.watch(name, callback);
		if (state && typeof state.subscribe === "function") return state.subscribe(callback);
		return () => {};
	};
	const resolveActions = () => {
		let resolvedActions = {};
		if (engine && typeof engine.getActions === "function") try {
			resolvedActions = { ...engine.getActions(name) };
		} catch {}
		if (typeof actions === "function") {
			const factoryResult = actions({
				name,
				state: getState(),
				engine,
				...meta
			});
			resolvedActions = {
				...resolvedActions,
				...factoryResult
			};
		} else if (actions && typeof actions === "object") resolvedActions = {
			...resolvedActions,
			...actions
		};
		return resolvedActions;
	};
	return {
		name,
		get state() {
			return getState();
		},
		subscribe(callback) {
			return setupSubscription(callback);
		},
		get actions() {
			return resolveActions();
		},
		...meta
	};
}
//#endregion
export { createFeatureStore };
