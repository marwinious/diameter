class c {
  #e = {};
  #t = {};
  #s = {};
  constructor() {
  }
  getState(t) {
    return this.#e[t] || {};
  }
  setState(t, e) {
    this.initEvent(t);
    const s = this.#e[t];
    return this.#e[t] = { ...this.#e[t], ...e }, this.notify(t), {
      event: t,
      newState: e,
      previousState: s
    };
  }
  subscribe(t, e) {
    if (typeof e != "function")
      throw new Error("Subscriber callbacks must be functions");
    return this.initEvent(t), this.#t[t].push(e), {
      event: t,
      callback: e,
      unsubscribe: () => {
        this.unsubscribe(t, e);
      }
    };
  }
  initEvent(t) {
    this.#e[t] ? console.warn(`Event "${t}" already exists`) : (this.#e[t] = {}, this.#t[t] = []);
  }
  unsubscribe(t, e) {
    let s = !1;
    return this.#t[t] = this.#t[t].filter((r) => (r === e && (s = !0), r !== e)), s ? {
      event: t,
      unsubscribedCallback: e
    } : {
      event: t,
      unsubscribedCallback: "not found"
    };
  }
  addAction(t, e, s) {
    if (typeof s != "function")
      throw new Error("Action callbacks must be functions");
    return this.#s[t] || (this.#s[t] = {}), this.#s[t][e] = s, {
      event: t,
      actionName: e,
      mutator: s
    };
  }
  runAction(t, e, ...s) {
    const r = this.#s[t]?.[e];
    if (r) {
      const n = r(this.#e[t], ...s);
      if (n) {
        const u = this.getState(t);
        return this.setState(t, n), {
          newState: this.getState(t),
          previousState: u
        };
      }
    } else
      console.warn(`Action "${e}" for event "${t}" not found`);
  }
  notify(t) {
    const e = [], s = this.getState(t);
    return this.#t.hasOwnProperty(t) && this.#t[t].forEach((r) => {
      r(s), e.push(r);
    }), {
      event: t,
      notifiedSubscribers: e
    };
  }
}
class a extends c {
  constructor() {
    super();
  }
}
class o {
  #e = {};
  #t = {};
  constructor() {
    this.#e = new a();
  }
  addStore(t = "", e = {}) {
    t && !this.#t.hasOwnProperty(t) ? this.#t[t] = e : console.warn(`The store "${t}" already exists.`);
  }
  get radius() {
    return this.#e;
  }
  get stores() {
    return this.#t;
  }
}
class h extends o {
  constructor() {
    super();
  }
}
class b {
  #e = {};
  #t = {};
  constructor() {
    this.#e = new a();
  }
  baseAddGuestState(t, e) {
    this.#t[t] = e;
  }
  baseGetState(t) {
    return this.radius.getState(t);
  }
  baseAddAction(t, e, s) {
    this.#e.addAction(t, e, s);
  }
  baseRunAction(t, e, ...s) {
    this.radius.runAction(t, e, ...s);
  }
  baseSetState(t, e) {
    this.radius.setState(t, e);
  }
  baseSubscribe(t, e) {
    this.radius.subscribe(t, e);
  }
  baseUnsubscribe(t, e) {
    this.radius.unsubcribe(t, e);
  }
  get radius() {
    return this.#e;
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
class d extends b {
  constructor() {
    super();
  }
  addTangent(t, e) {
    super.baseAddGuestState(t, e);
  }
  getState(t) {
    return super.baseGetState(t);
  }
  getTangent(t) {
    return super.tangents[t];
  }
  addAction(t, e, s) {
    super.baseAddAction(t, e, s);
  }
  runAction(t, e, ...s) {
    super.baseRunAction(t, e, ...s);
  }
  setState(t, e) {
    super.baseSetState(t, e);
  }
  subscribe(t, e) {
    super.baseSubscribe(t, e);
  }
  unsubscribe(t, e) {
    super.baseUnsubscribe(t, e);
  }
}
export {
  h as Diameter,
  d as DiameterStore
};
//# sourceMappingURL=diameter.js.map
