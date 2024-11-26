class u {
  #s = {};
  #t = {};
  #e = {};
  constructor() {
  }
  getState(t) {
    return this.#s[t] || {};
  }
  setState(t, s) {
    this.initEvent(t), this.#s[t] = { ...this.#s[t], ...s }, this.notify(t);
  }
  subscribe(t, s) {
    if (typeof s != "function")
      throw new Error("Subscriber callbacks must be functions");
    this.initEvent(t), this.#t[t].push(s);
  }
  initEvent(t) {
    this.#s[t] || (this.#s[t] = {}, this.#t[t] = []);
  }
  unsubscribe(t, s) {
    this.#t[t] = this.#t[t].filter((e) => e !== s);
  }
  addAction(t, s, e) {
    if (typeof e != "function")
      throw new Error("Action callbacks must be functions");
    this.#e[t] || (this.#e[t] = {}), this.#e[t][s] = e;
  }
  runAction(t, s, ...e) {
    const r = this.#e[t]?.[s];
    if (r) {
      const n = r(this.#s[t], ...e);
      n && this.setState(t, n);
    } else
      console.warn(`Action "${s}" for event "${t}" not found`);
  }
  notify(t) {
    this.#t.hasOwnProperty(t) && this.#t[t].forEach((s) => {
      s(this.getState(t));
    });
  }
}
class a extends u {
  constructor() {
    super();
  }
}
class c {
  #s = {};
  #t = {};
  constructor() {
    this.#s = new a();
  }
  addStore(t = "", s = {}) {
    t && !this.#t.hasOwnProperty(t) ? this.#t[t] = s : console.warn(`The store "${t}" already exists.`);
  }
  get radius() {
    return this.#s;
  }
  get stores() {
    return this.#t;
  }
}
class h extends c {
  constructor() {
    super();
  }
}
class o {
  #s = {};
  #t = {};
  constructor() {
    this.#s = new a();
  }
  baseAddGuestState(t, s) {
    this.#t[t] = s;
  }
  baseGetState(t) {
    return this.radius.getState(t);
  }
  baseAddAction(t, s, e) {
    this.#s.addAction(t, s, e);
  }
  baseRunAction(t, s, ...e) {
    this.radius.runAction(t, s, ...e);
  }
  baseSetState(t, s) {
    this.radius.setState(t, s);
  }
  baseSubscribe(t, s) {
    this.radius.subscribe(t, s);
  }
  baseUnsubscribe(t, s) {
    this.radius.unsubcribe(t, s);
  }
  get radius() {
    return this.#s;
  }
  get guestStates() {
    return this.#t;
  }
  set guestStates(t) {
    this.#t = t;
  }
  get tangents() {
    return this.#t;
  }
  set tangents(t) {
    this.#t = t;
  }
}
class b extends o {
  constructor() {
    super();
  }
  addTangent(t, s) {
    super.baseAddGuestState(t, s);
  }
  getState(t) {
    return super.baseGetState(t);
  }
  getTangent(t) {
    return super.tangents[t];
  }
  addAction(t, s, e) {
    super.baseAddAction(t, s, e);
  }
  runAction(t, s, ...e) {
    super.baseRunAction(t, s, ...e);
  }
  setState(t, s) {
    super.baseSetState(t, s);
  }
  subscribe(t, s) {
    super.baseSubscribe(t, s);
  }
  unsubscribe(t, s) {
    super.baseUnsubscribe(t, s);
  }
}
export {
  h as Diameter,
  b as DiameterStore
};
//# sourceMappingURL=diameter.js.map
