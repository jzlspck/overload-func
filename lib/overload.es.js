const y = {
  date: Date,
  map: Map,
  set: Set,
  weakmap: WeakMap,
  weakset: WeakSet,
  regexp: RegExp,
  promise: Promise,
  error: Error
};
function m(e, a) {
  if (Array.isArray(e))
    return "array";
  const t = { ...a, ...y };
  for (const r in t)
    if (e instanceof t[r])
      return r;
  const n = typeof e;
  return n === "object" && e === null ? "null" : n;
}
function d(e, a) {
  return e.map((t) => m(t, a));
}
const c = Symbol("extendType");
function w(e) {
  return Object.defineProperty(e, c, {
    enumerable: !1,
    configurable: !1,
    writable: !1,
    value: !0
  }), e;
}
function x(e = {}) {
  const { allowMultiple: a = !1, extendType: t } = e;
  t && !t[c] && console.warn("Warning: The extendType should be created using createExtendType for proper functionality.");
  const n = /* @__PURE__ */ new Map(), r = function(...i) {
    const o = d(i, t).join("-"), p = n.get(o);
    if (!p)
      throw new Error(`No implementation found for argument types: (${o.split("-").join(", ")})`);
    return p.apply(this, i);
  };
  return r.addImple = function(...i) {
    const o = i.pop();
    if (typeof o != "function")
      throw new Error("The last argument must be a function.");
    const p = i, s = p.join("-");
    if (n.has(s))
      if (a) {
        const u = n.get(s), f = function(...l) {
          return u.apply(this, l), o.apply(this, l);
        };
        return n.set(s, f), r;
      } else
        throw new Error(`Implementation for types (${p.join(", ")}) already exists.`);
    return n.set(s, o), r;
  }, r;
}
export {
  w as createExtendType,
  x as createOverloadedFunction
};
