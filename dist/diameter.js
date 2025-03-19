class f {
  #s = {};
  #t = {};
  #r = {};
  constructor() {
  }
  getState(t) {
    return typeof this.#s[t] < "u" ? this.#s[t] : {};
  }
  setState(t, s) {
    const r = this.setStateOnly(t, s), e = this.notify(t, r.newState, r.previousState);
    return { ...r, ...e };
  }
  setStateOnly(t, s) {
    this.initEvent(t);
    const r = structuredClone(this.#s[t]);
    return s.constructor === Object ? this.#s[t] = { ...this.#s[t], ...s } : (s.constructor === String || s.constructor === Array || s.constructor === Number || s.constructor === Boolean) && (this.#s[t] = s), {
      event: t,
      newState: s,
      previousState: r
    };
  }
  watch(t, s, r) {
    if (typeof r != "function")
      throw new Error("Subscriber callbacks must be functions");
    return this.initEvent(t), this.#t[t].watchers.properties[s] || (this.#t[t].watchers.properties[s] = []), this.#t[t].watchers.properties[s].push(r), {
      event: t,
      property: s,
      callback: r,
      unsubscribe: () => {
        this.stopWatcher(t, s, r);
      }
    };
  }
  subscribe(t, s) {
    if (typeof s != "function")
      throw new Error("Subscriber callbacks must be functions");
    return this.initEvent(t), this.#t[t].subscribers.push(s), {
      event: t,
      callback: s,
      unsubscribe: () => this.unsubscribe(t, s)
    };
  }
  initEvent(t) {
    typeof this.#s[t] > "u" && (this.#s[t] = {}, this.#t[t] = {
      subscribers: [],
      watchers: {
        properties: {}
      }
    });
  }
  unsubscribe(t, s) {
    let r = !1;
    return this.#t[t].subscribers = this.#t[t].subscribers.filter((e) => (e === s && (r = !0), e !== s)), r ? {
      event: t,
      unsubscribedCallback: s
    } : {
      event: t,
      unsubscribedCallback: "not found"
    };
  }
  stopWatcher(t, s, r) {
    let e = !1;
    return this.#t[t].watchers.properties[s] = this.#t[t].watchers.properties[s].filter((i) => (i === r && (e = !0), i !== r)), e ? {
      event: t,
      property: s,
      unsubscribedCallback: r
    } : {
      event: t,
      property: s,
      unsubscribedCallback: "not found"
    };
  }
  addAction(t, s, r) {
    if (typeof r != "function")
      throw new Error("Action callbacks must be functions");
    return this.#r[t] || (this.#r[t] = {}), this.#r[t][s] = r, {
      event: t,
      actionName: s,
      mutator: r
    };
  }
  runAction(t, s, ...r) {
    const e = this.#r[t]?.[s];
    if (e) {
      const i = e(structuredClone(this.#s[t]), ...r);
      if (i) {
        const u = this.setState(t, i);
        return {
          newState: u.newState,
          previousState: u.previousState
        };
      }
    } else
      console.warn(`Action "${s}" for event "${t}" not found`);
  }
  notify(t, s, r) {
    const e = [], i = this.getState(t);
    let u = {
      notifiedWatchers: [],
      changedProperties: []
    };
    return this.#t.hasOwnProperty(t) && (this.#t[t].subscribers.forEach((n) => {
      n(i), e.push(n);
    }), u = this.notifyWatchers(t, s, r)), {
      event: t,
      notifiedSubscribers: e,
      notifiedWatchers: u.notifiedWatchers,
      changedProperties: u.changedProperties
    };
  }
  notifyWatchers(t, s, r) {
    const e = [], i = [], u = this.#t[t].watchers;
    return Object.entries(r).forEach(([n, l]) => {
      if (u.properties.hasOwnProperty(n)) {
        const h = structuredClone(r[n]), b = structuredClone(s[n]);
        if (!(JSON.stringify(h) === JSON.stringify(b))) {
          const d = u.properties[n];
          i.push(n), d.forEach((o) => {
            o(s[n]), e.push(o);
          });
        }
      }
    }), {
      event: t,
      notifiedWatchers: e,
      changedProperties: i
    };
  }
}
class c extends f {
  constructor() {
    super();
  }
}
class p {
  #s = {};
  #t = {};
  constructor() {
    this.#s = new c();
  }
  addStore(t = "", s = {}) {
    t && !this.#t.hasOwnProperty(t) ? this.#t[t] = s : console.warn(`The store "${t}" already exists.`);
  }
  get radius() {
    return this.#s;
  }
  get state() {
    return this.#s;
  }
  get stores() {
    return this.#t;
  }
}
class w extends p {
  constructor() {
    super();
  }
}
class S {
  #s = {};
  #t = {};
  constructor() {
    this.#s = new c();
  }
  baseAddGuestState(t, s) {
    return this.#t[t] = s;
  }
  baseGetState(t) {
    return this.radius.getState(t);
  }
  baseAddAction(t, s, r) {
    return this.#s.addAction(t, s, r);
  }
  baseRunAction(t, s, ...r) {
    return this.radius.runAction(t, s, ...r);
  }
  baseSetState(t, s) {
    return this.radius.setState(t, s);
  }
  baseSetStateOnly(t, s) {
    return this.radius.setStateOnly(t, s);
  }
  baseSubscribe(t, s) {
    return this.radius.subscribe(t, s);
  }
  baseUnsubscribe(t, s) {
    return this.radius.unsubscribe(t, s);
  }
  baseWatch(t, s, r) {
    return this.radius.watch(t, s, r);
  }
  baseStopWatcher(t, s, r) {
    return this.radius.stopWatcher(t, s, r);
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
class y extends S {
  constructor() {
    super();
  }
  addTangent(t, s) {
    return super.baseAddGuestState(t, s);
  }
  getState(t) {
    return super.baseGetState(t);
  }
  getTangent(t) {
    return super.tangents[t];
  }
  addAction(t, s, r) {
    return super.baseAddAction(t, s, r);
  }
  runAction(t, s, ...r) {
    return super.baseRunAction(t, s, ...r);
  }
  setState(t, s) {
    return super.baseSetState(t, s);
  }
  setStateOnly(t, s) {
    return super.baseSetStateOnly(t, s);
  }
  subscribe(t, s) {
    return super.baseSubscribe(t, s);
  }
  unsubscribe(t, s) {
    return super.baseUnsubscribe(t, s);
  }
  watch(t, s, r) {
    return super.baseWatch(t, s, r);
  }
  stopWatcher(t, s, r) {
    return super.baseStopWatcher(t, s, r);
  }
}
export {
  w as Diameter,
  y as DiameterStore
};
//# sourceMappingURL=diameter.js.map
