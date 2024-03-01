var Ce = Object.defineProperty;
var Se = (p, e, s) => e in p ? Ce(p, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[e] = s;
var fe = (p, e, s) => (Se(p, typeof e != "symbol" ? e + "" : e, s), s);
import { reactive as le, watch as ie, ref as b, computed as Q, inject as F, openBlock as n, createElementBlock as u, unref as a, createCommentVNode as E, normalizeClass as N, createElementVNode as t, createTextVNode as T, toDisplayString as v, customRef as Me, withModifiers as G, Fragment as U, renderList as q, withDirectives as R, withKeys as J, isRef as _e, vModelText as X, nextTick as de, createVNode as B, TransitionGroup as Ee, withCtx as A, onMounted as I, onUpdated as De, onBeforeUnmount as ke, vShow as oe, normalizeStyle as ye, vModelSelect as pe, provide as je, Transition as Ae, createBlock as L, resolveDynamicComponent as Le, renderSlot as ne, onUnmounted as Fe, vModelCheckbox as Te } from "vue";
import Oe from "mitt";
import Ve from "dragselect";
import Ne from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import Ue from "cropperjs";
import Be from "@uppy/core";
import ze from "@uppy/xhr-upload";
import "microtip/microtip.css";
var ge;
const me = (ge = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : ge.getAttribute("content");
class He {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    fe(this, "config");
    this.config = e;
  }
  /** @type {RequestConfig} */
  get config() {
    return this.config;
  }
  /**
   * Transform request params
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {Record<String,?String>|FormData=} input.body
   * @return {RequestTransformResultInternal}
   */
  transformRequestParams(e) {
    const s = this.config, r = {};
    me != null && me !== "" && (r[s.xsrfHeaderName] = me);
    const o = Object.assign({}, s.headers, r, e.headers), i = Object.assign({}, s.params, e.params), m = e.body, d = s.baseUrl + e.url, l = e.method;
    let c;
    l !== "get" && (m instanceof FormData ? (c = m, s.body != null && Object.entries(this.config.body).forEach(([_, S]) => {
      c.append(_, S);
    })) : (c = { ...m }, s.body != null && Object.assign(c, this.config.body)));
    const g = {
      url: d,
      method: l,
      headers: o,
      params: i,
      body: c
    };
    if (s.transformRequest != null) {
      const _ = s.transformRequest({
        url: d,
        method: l,
        headers: o,
        params: i,
        body: c
      });
      _.url != null && (g.url = _.url), _.method != null && (g.method = _.method), _.params != null && (g.params = _.params ?? {}), _.headers != null && (g.headers = _.headers ?? {}), _.body != null && (g.body = _.body);
    }
    return g;
  }
  /**
   * Get download url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getDownloadUrl(e, s) {
    if (s.url != null)
      return s.url;
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: s.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * Get preview url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getPreviewUrl(e, s) {
    if (s.url != null)
      return s.url;
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: s.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * Send request
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {(Record<String,?String>|FormData|null)=} input.body
   * @param {'arrayBuffer'|'blob'|'json'|'text'=} input.responseType
   * @param {AbortSignal=} input.abortSignal
   * @returns {Promise<(ArrayBuffer|Blob|Record<String,?String>|String|null)>}
   * @throws {Record<String,?String>|null} resp json error
   */
  async send(e) {
    if (this.config.customRequest)
      return this.config.customRequest(e);
    const s = this.transformRequestParams(e), r = e.responseType || "json", o = {
      method: e.method,
      headers: s.headers,
      signal: e.abortSignal
    }, i = s.url + "?" + new URLSearchParams(s.params);
    if (s.method !== "get" && s.body != null) {
      let d;
      s.body instanceof FormData ? d = e.body : (d = JSON.stringify(s.body), o.headers["Content-Type"] = "application/json"), o.body = d;
    }
    const m = await fetch(i, o);
    if (m.ok)
      return await m[r]();
    throw await m.json();
  }
}
function Re(p) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token",
    xhrOptions: {}
  };
  return typeof p == "string" ? Object.assign(e, { baseUrl: p }) : Object.assign(e, p), new He(e);
}
function qe(p) {
  let e = localStorage.getItem(p + "_storage");
  const s = le(JSON.parse(e ?? "{}"));
  ie(s, r);
  function r() {
    Object.keys(s).length ? localStorage.setItem(p + "_storage", JSON.stringify(s)) : localStorage.removeItem(p + "_storage");
  }
  function o(l, c) {
    s[l] = c;
  }
  function i(l) {
    delete s[l];
  }
  function m() {
    Object.keys(s).map((l) => i(l));
  }
  return { getStore: (l, c = null) => s.hasOwnProperty(l) ? s[l] : c, setStore: o, removeStore: i, clearStore: m };
}
async function Ie(p, e) {
  const s = e[p];
  return typeof s == "function" ? (await s()).default : s;
}
function Pe(p, e, s, r) {
  const { getStore: o, setStore: i } = p, m = b({}), d = b(o("locale", e)), l = (_, S = e) => {
    Ie(_, r).then((C) => {
      m.value = C, i("locale", _), d.value = _, i("translations", C), Object.values(r).length > 1 && (s.emit("vf-toast-push", { label: "The language is set to " + _ }), s.emit("vf-language-saved"));
    }).catch((C) => {
      S ? (s.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), l(S, null)) : s.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  !o("locale") && !r.length ? l(e) : m.value = o("translations");
  const c = (_, ...S) => S.length ? c(_ = _.replace("%s", S.shift()), ...S) : _;
  function g(_, ...S) {
    return m.value && m.value.hasOwnProperty(_) ? c(m.value[_], ...S) : c(_, ...S);
  }
  return { t: g, changeLocale: l, locale: d };
}
const V = {
  EDIT: "edit",
  NEW_FILE: "newfile",
  NEW_FOLDER: "newfolder",
  PREVIEW: "preview",
  ARCHIVE: "archive",
  UNARCHIVE: "unarchive",
  SEARCH: "search",
  RENAME: "rename",
  UPLOAD: "upload",
  DELETE: "delete",
  FULL_SCREEN: "fullscreen",
  DOWNLOAD: "download",
  LANGUAGE: "language"
}, We = Object.values(V), Ge = "2.2.1";
function be(p, e, s, r, o) {
  return (e = Math, s = e.log, r = 1024, o = s(p) / s(r) | 0, p / e.pow(r, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "iB" : "B");
}
function xe(p, e, s, r, o) {
  return (e = Math, s = e.log, r = 1e3, o = s(p) / s(r) | 0, p / e.pow(r, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "B" : "B");
}
function Ye(p) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, r = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(p);
  return r[1] * Math.pow(1024, e[r[2].toLowerCase()]);
}
const K = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Ke(p, e) {
  const s = b(K.SYSTEM), r = b(K.LIGHT);
  s.value = p.getStore("theme", e ?? K.SYSTEM);
  const o = window.matchMedia("(prefers-color-scheme: dark)"), i = (m) => {
    s.value === K.DARK || s.value === K.SYSTEM && m.matches ? r.value = K.DARK : r.value = K.LIGHT;
  };
  return i(o), o.addEventListener("change", i), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: s,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: r,
    /**
     * @param {Theme} value
     */
    set(m) {
      s.value = m, m !== K.SYSTEM ? p.setStore("theme", m) : p.removeStore("theme"), i(o);
    }
  };
}
const Je = (p, e) => {
  const s = qe(p.id), r = Oe(), o = s.getStore("metricUnits", !1), i = Ke(s, p.theme), m = e.i18n, d = p.locale ?? e.locale, l = Q(() => Pe(s, d, r, m)), c = (_) => Array.isArray(_) ? _ : We, g = p.persist ? s.getStore("path", p.path) : p.path;
  return le({
    // app version
    version: Ge,
    // root element
    root: null,
    // app id
    debug: p.debug,
    // Event Bus
    emitter: r,
    // active features
    features: c(p.features),
    // http object
    requester: Re(p.request),
    // theme state
    theme: i,
    // view state
    view: s.getStore("viewport", "grid"),
    // fullscreen state
    fullScreen: s.getStore("full-screen", p.fullScreen),
    // selectButton state
    selectButton: p.selectButton,
    // unit state - for example: GB or GiB
    metricUnits: o,
    // human readable file sizes
    filesize: o ? xe : be,
    // max file size
    maxFileSize: p.maxFileSize,
    // loading state
    loading: !1,
    // default locale
    i18n: l,
    // modal state
    modal: {
      active: !1,
      type: "delete",
      data: {}
    },
    // main storage adapter
    adapter: s.getStore("adapter"),
    // main storage adapter
    path: g,
    // persist state
    persist: p.persist,
    // storage
    storage: s,
    // fetched items
    data: { adapter: s.getStore("adapter"), storages: [], dirname: g, files: [] },
    // selected items
    selectedItems: []
  });
}, Xe = { class: "border-neutral-300 flex justify-between items-center py-1 text-sm" }, Qe = {
  key: 0,
  class: "flex text-center"
}, Ze = ["aria-label"], et = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
  })
], -1), tt = [
  et
], st = ["aria-label"], at = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
  })
], -1), ot = [
  at
], rt = ["aria-label"], nt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
}, null, -1), lt = [
  nt
], it = ["aria-label"], dt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
}, null, -1), ct = [
  dt
], ut = ["aria-label"], mt = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
  })
], -1), vt = [
  mt
], pt = ["aria-label"], ht = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
}, null, -1), ft = [
  ht
], gt = ["aria-label"], _t = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
}, null, -1), kt = [
  _t
], yt = {
  key: 1,
  class: "flex text-center"
}, bt = { class: "pl-2" }, xt = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, wt = {
  key: 0,
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, $t = /* @__PURE__ */ t("circle", {
  class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), Ct = /* @__PURE__ */ t("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), St = [
  $t,
  Ct
], Mt = { class: "flex text-center items-center justify-end" }, Et = ["aria-label"], Dt = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, jt = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
}, At = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
}, Lt = ["aria-label"], Ft = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
}, Tt = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
}, Ot = {
  name: "VFToolbar"
}, Vt = /* @__PURE__ */ Object.assign(Ot, {
  setup(p) {
    const e = F("ServiceContainer"), { setStore: s } = e.storage, { t: r } = e.i18n, o = b([]), i = b("");
    e.emitter.on("vf-search-query", ({ newQuery: l }) => {
      i.value = l;
    });
    const m = () => {
      e.fullScreen = !e.fullScreen, s("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    };
    e.emitter.on("vf-nodes-selected", (l) => {
      o.value = l;
    });
    const d = () => {
      e.view = e.view === "list" ? "grid" : "list", s("viewport", e.view);
    };
    return (l, c) => (n(), u("div", Xe, [
      i.value.length ? (n(), u("div", yt, [
        t("div", bt, [
          T(v(a(r)("Search results for")) + " ", 1),
          t("span", xt, v(i.value), 1)
        ]),
        a(e).loading ? (n(), u("svg", wt, St)) : E("", !0)
      ])) : (n(), u("div", Qe, [
        a(e).features.includes(a(V).NEW_FOLDER) ? (n(), u("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(r)("New Folder"),
          "data-microtip-position": "bottom-right",
          role: "tooltip",
          onClick: c[0] || (c[0] = (g) => a(e).emitter.emit("vf-modal-show", { type: "new-folder", items: o.value }))
        }, tt, 8, Ze)) : E("", !0),
        a(e).features.includes(a(V).NEW_FILE) ? (n(), u("div", {
          key: 1,
          class: "mx-1.5",
          "aria-label": a(r)("New File"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: c[1] || (c[1] = (g) => a(e).emitter.emit("vf-modal-show", { type: "new-file", items: o.value }))
        }, ot, 8, st)) : E("", !0),
        a(e).features.includes(a(V).RENAME) ? (n(), u("div", {
          key: 2,
          class: "mx-1.5",
          "aria-label": a(r)("Rename"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: c[2] || (c[2] = (g) => o.value.length != 1 || a(e).emitter.emit("vf-modal-show", { type: "rename", items: o.value }))
        }, [
          (n(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: N([o.value.length == 1 ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, lt, 2))
        ], 8, rt)) : E("", !0),
        a(e).features.includes(a(V).DELETE) ? (n(), u("div", {
          key: 3,
          class: "mx-1.5",
          "aria-label": a(r)("Delete"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: c[3] || (c[3] = (g) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "delete", items: o.value }))
        }, [
          (n(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: N([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ct, 2))
        ], 8, it)) : E("", !0),
        a(e).features.includes(a(V).UPLOAD) ? (n(), u("div", {
          key: 4,
          class: "mx-1.5",
          "aria-label": a(r)("Upload"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: c[4] || (c[4] = (g) => a(e).emitter.emit("vf-modal-show", { type: "upload", items: o.value }))
        }, vt, 8, ut)) : E("", !0),
        a(e).features.includes(a(V).UNARCHIVE) && o.value.length == 1 && o.value[0].mime_type == "application/zip" ? (n(), u("div", {
          key: 5,
          class: "mx-1.5",
          "aria-label": a(r)("Unarchive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: c[5] || (c[5] = (g) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "unarchive", items: o.value }))
        }, [
          (n(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: N([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ft, 2))
        ], 8, pt)) : E("", !0),
        a(e).features.includes(a(V).ARCHIVE) ? (n(), u("div", {
          key: 6,
          class: "mx-1.5",
          "aria-label": a(r)("Archive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: c[6] || (c[6] = (g) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "archive", items: o.value }))
        }, [
          (n(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: N([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, kt, 2))
        ], 8, gt)) : E("", !0)
      ])),
      t("div", Mt, [
        a(e).features.includes(a(V).FULL_SCREEN) ? (n(), u("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(r)("Toggle Full Screen"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: m
        }, [
          (n(), u("svg", Dt, [
            a(e).fullScreen ? (n(), u("path", jt)) : (n(), u("path", At))
          ]))
        ], 8, Et)) : E("", !0),
        t("div", {
          class: "mx-1.5",
          "aria-label": a(r)("Change View"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: c[7] || (c[7] = (g) => i.value.length || d())
        }, [
          (n(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: N([i.value.length ? "stroke-gray-200  dark:stroke-gray-700" : "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, [
            a(e).view === "grid" ? (n(), u("path", Ft)) : E("", !0),
            a(e).view === "list" ? (n(), u("path", Tt)) : E("", !0)
          ], 2))
        ], 8, Lt)
      ])
    ]));
  }
}), Nt = (p, e = 0, s = !1) => {
  let r;
  return (...o) => {
    s && !r && p(...o), clearTimeout(r), r = setTimeout(() => {
      p(...o);
    }, e);
  };
}, Ut = (p, e, s) => {
  const r = b(p);
  return Me((o, i) => ({
    get() {
      return o(), r.value;
    },
    set: Nt(
      (m) => {
        r.value = m, i();
      },
      e,
      s
    )
  }));
}, Bt = { class: "flex p-1.5 bg-neutral-100 dark:bg-gray-800 border-t border-b border-neutral-300 dark:border-gray-700/50 items-center select-none text-sm" }, zt = ["aria-label"], Ht = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z",
  "clip-rule": "evenodd"
}, null, -1), Rt = [
  Ht
], qt = ["aria-label"], It = /* @__PURE__ */ t("path", { d: "M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" }, null, -1), Pt = [
  It
], Wt = ["aria-label"], Gt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), Yt = [
  Gt
], Kt = /* @__PURE__ */ t("path", { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" }, null, -1), Jt = [
  Kt
], Xt = { class: "flex leading-6" }, Qt = /* @__PURE__ */ t("span", { class: "text-neutral-300 dark:text-gray-600 mx-0.5" }, "/", -1), Zt = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], es = {
  key: 0,
  class: "animate-spin p-1 h-6 w-6 text-white ml-auto",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, ts = /* @__PURE__ */ t("circle", {
  class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), ss = /* @__PURE__ */ t("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), as = [
  ts,
  ss
], os = {
  key: 3,
  class: "relative flex bg-white dark:bg-gray-700 justify-between items-center rounded p-1 ml-2 w-full"
}, rs = /* @__PURE__ */ t("div", null, [
  /* @__PURE__ */ t("svg", {
    class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    })
  ])
], -1), ns = ["placeholder"], ls = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), is = [
  ls
], ds = {
  name: "VFBreadcrumb"
}, cs = /* @__PURE__ */ Object.assign(ds, {
  setup(p) {
    const e = b(null), s = b([]), r = b(!1), o = b(null), i = F("ServiceContainer"), { t: m } = i.i18n;
    i.emitter.on("vf-explorer-update", () => {
      let M = [], h = [];
      e.value = i.data.dirname ?? i.adapter + "://", e.value.length == 0 && (s.value = []), e.value.replace(i.adapter + "://", "").split("/").forEach(function(f) {
        M.push(f), M.join("/") != "" && h.push({
          basename: f,
          name: f,
          path: i.adapter + "://" + M.join("/"),
          type: "dir"
        });
      }), h.length > 4 && (h = h.slice(-5), h[0].name = ".."), s.value = h;
    });
    const d = () => {
      r.value = !1, c.value = "";
    };
    i.emitter.on("vf-search-exit", () => {
      d();
    });
    const l = () => {
      i.features.includes(V.SEARCH) && (r.value = !0, de(() => o.value.focus()));
    }, c = Ut("", 400);
    ie(c, (M) => {
      i.emitter.emit("vf-toast-clear"), i.emitter.emit("vf-search-query", { newQuery: M });
    });
    const g = () => s.value.length && !r.value, _ = (M, h = null) => {
      M.preventDefault(), C(M), h ?? (h = s.value.length - 2);
      let f = JSON.parse(M.dataTransfer.getData("items"));
      if (f.find((O) => O.storage !== i.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      i.emitter.emit("vf-modal-show", {
        type: "move",
        items: { from: f, to: s.value[h] ?? { path: i.adapter + "://" } }
      });
    }, S = (M) => {
      M.preventDefault(), g() ? (M.dataTransfer.dropEffect = "copy", M.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-500")) : (M.dataTransfer.dropEffect = "none", M.dataTransfer.effectAllowed = "none");
    }, C = (M) => {
      M.preventDefault(), M.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500"), g() && M.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500");
    }, D = () => {
      c.value == "" && d();
    };
    return (M, h) => (n(), u("div", Bt, [
      t("span", {
        "aria-label": a(m)("Go up a directory"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (n(), u("svg", {
          onDragover: h[0] || (h[0] = (f) => S(f)),
          onDragleave: h[1] || (h[1] = (f) => C(f)),
          onDrop: h[2] || (h[2] = (f) => _(f)),
          onClick: h[3] || (h[3] = (f) => {
            var O;
            return !g() || a(i).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(i).data.adapter, path: ((O = s.value[s.value.length - 2]) == null ? void 0 : O.path) ?? a(i).adapter + "://" } });
          }),
          class: N(["h-6 w-6 p-0.5 rounded", g() ? "text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" : "text-gray-400 dark:text-neutral-500"]),
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Rt, 34))
      ], 8, zt),
      a(i).loading ? (n(), u("span", {
        key: 1,
        "aria-label": a(m)("Cancel"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (n(), u("svg", {
          onClick: h[5] || (h[5] = (f) => a(i).emitter.emit("vf-fetch-abort")),
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor",
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer"
        }, Yt))
      ], 8, Wt)) : (n(), u("span", {
        key: 0,
        "aria-label": a(m)("Refresh"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (n(), u("svg", {
          onClick: h[4] || (h[4] = (f) => {
            a(i).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(i).data.adapter, path: a(i).data.dirname } });
          }),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "-40 -40 580 580",
          fill: "currentColor"
        }, Pt))
      ], 8, qt)),
      r.value ? (n(), u("div", os, [
        rs,
        R(t("input", {
          ref_key: "searchInput",
          ref: o,
          onKeydown: J(d, ["esc"]),
          onBlur: D,
          "onUpdate:modelValue": h[10] || (h[10] = (f) => _e(c) ? c.value = f : null),
          placeholder: a(m)("Search anything.."),
          class: "w-full pb-0 px-1 border-0 text-base ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent",
          type: "text"
        }, null, 40, ns), [
          [X, a(c)]
        ]),
        (n(), u("svg", {
          class: "w-6 h-6 cursor-pointer",
          onClick: d,
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor"
        }, is))
      ])) : (n(), u("div", {
        key: 2,
        class: "group flex bg-white dark:bg-gray-700 items-center rounded p-1 ml-2 w-full",
        onClick: G(l, ["self"])
      }, [
        (n(), u("svg", {
          onDragover: h[6] || (h[6] = (f) => S(f)),
          onDragleave: h[7] || (h[7] = (f) => C(f)),
          onDrop: h[8] || (h[8] = (f) => _(f, -1)),
          onClick: h[9] || (h[9] = (f) => a(i).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(i).data.adapter } })),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Jt, 32)),
        t("div", Xt, [
          (n(!0), u(U, null, q(s.value, (f, O) => (n(), u("div", { key: O }, [
            Qt,
            t("span", {
              onDragover: (z) => O === s.value.length - 1 || S(z),
              onDragleave: (z) => O === s.value.length - 1 || C(z),
              onDrop: (z) => O === s.value.length - 1 || _(z, O),
              class: "px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer",
              title: f.basename,
              onClick: (z) => a(i).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(i).data.adapter, path: f.path } })
            }, v(f.name), 41, Zt)
          ]))), 128))
        ]),
        a(i).loading ? (n(), u("svg", es, as)) : E("", !0)
      ]))
    ]));
  }
}), we = (p, e = null) => new Date(p * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), us = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, ms = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
}, null, -1), vs = [
  ms
], ps = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, hs = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",
  "clip-rule": "evenodd"
}, null, -1), fs = [
  hs
], gs = {
  name: "VFSortIcon"
}, re = /* @__PURE__ */ Object.assign(gs, {
  props: { direction: String },
  setup(p) {
    return (e, s) => (n(), u("div", null, [
      p.direction === "down" ? (n(), u("svg", us, vs)) : E("", !0),
      p.direction === "up" ? (n(), u("svg", ps, fs)) : E("", !0)
    ]));
  }
}), _s = ["onClick"], ks = {
  name: "VFToast.vue"
}, ys = /* @__PURE__ */ Object.assign(ks, {
  setup(p) {
    const e = F("ServiceContainer"), { getStore: s } = e.storage, r = b(s("full-screen", !1)), o = b([]), i = (l) => l === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", m = (l) => {
      o.value.splice(l, 1);
    }, d = (l) => {
      let c = o.value.findIndex((g) => g.id === l);
      c !== -1 && m(c);
    };
    return e.emitter.on("vf-toast-clear", () => {
      o.value = [];
    }), e.emitter.on("vf-toast-push", (l) => {
      let c = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      l.id = c, o.value.push(l), setTimeout(() => {
        d(c);
      }, 5e3);
    }), (l, c) => (n(), u("div", {
      class: N([r.value.value ? "fixed" : "absolute", "bottom-0 max-w-fit flex flex-col bottom-0 left-1/2 -translate-x-1/2"])
    }, [
      B(Ee, {
        name: "vf-toast-item",
        "leave-active-class": "transition-all duration-1000",
        "leave-to-class": "opacity-0"
      }, {
        default: A(() => [
          (n(!0), u(U, null, q(o.value, (g, _) => (n(), u("div", {
            onClick: (S) => m(_),
            key: g,
            class: N([i(g.type), "inline-block mx-auto my-0.5 py-0.5 px-2 min-w-max bg-gray-50 dark:bg-gray-600 border text-xs sm:text-sm rounded cursor-pointer"])
          }, v(g.label), 11, _s))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
});
function he(p, e = 14) {
  let s = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return p.replace(new RegExp(s), "$2..$4");
}
const bs = { class: "relative flex-auto flex flex-col overflow-hidden" }, xs = {
  key: 0,
  class: "grid grid-cols-12 border-b border-neutral-300 border-gray-200 dark:border-gray-700 text-xs select-none"
}, ws = { class: "absolute" }, $s = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
  })
], -1), Cs = { class: "text-neutral-700 dark:text-neutral-300 p-1 absolute text-center top-4 right-[-2rem] md:top-5 md:right-[-2.4rem] z-20 text-xs" }, Ss = ["onDblclick", "onContextmenu", "data-type", "data-item", "data-index"], Ms = { class: "grid grid-cols-12 items-center" }, Es = { class: "flex col-span-7 items-center" }, Ds = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, js = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), As = [
  js
], Ls = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Fs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ts = [
  Fs
], Os = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, Vs = { class: "col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ns = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Us = { class: "grid grid-cols-12 items-center" }, Bs = { class: "flex col-span-7 items-center" }, zs = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Hs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Rs = [
  Hs
], qs = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Is = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ps = [
  Is
], Ws = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, Gs = { class: "col-span-2 text-center" }, Ys = { class: "col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ks = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Js = { class: "relative" }, Xs = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-10 w-10 md:h-12 md:w-12 m-auto fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Qs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Zs = [
  Qs
], ea = ["data-src", "alt"], ta = ["alt"], sa = ["src"], aa = {
  key: 3,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-10 w-10 md:h-12 md:w-12 m-auto text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, oa = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), ra = [
  oa
], na = {
  key: 4,
  class: "absolute hidden md:block top-1/2 w-full text-center text-neutral-500"
}, la = { class: "break-all" }, ia = {
  name: "VFExplorer"
}, da = /* @__PURE__ */ Object.assign(ia, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const r = (w) => w == null ? void 0 : w.substring(0, 3), o = b(null), i = b(null), m = b(0), d = b(null), l = Math.floor(Math.random() * 2 ** 32), c = b("");
    let g;
    e.emitter.on("vf-fullscreen-toggle", () => {
      o.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: w }) => {
      c.value = w, w ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.data.adapter,
          path: e.data.dirname,
          filter: w
        },
        onSuccess: (x) => {
          x.files.length || e.emitter.emit("vf-toast-push", { label: s("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: e.data.dirname } });
    });
    let _ = null;
    const S = () => {
      _ && clearTimeout(_);
    }, C = b(!0), D = (w) => {
      w.touches.length > 1 && (C.value ? (d.value.stop(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: off") })) : (d.value.start(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: on") }), e.emitter.emit("vf-explorer-update")), C.value = !C.value);
    }, M = (w) => {
      _ = setTimeout(() => {
        const x = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: w.target.getBoundingClientRect().x,
          clientY: w.target.getBoundingClientRect().y
        });
        w.target.dispatchEvent(x);
      }, 500);
    }, h = (w) => {
      w.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: w.path } })) : e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: w });
    }, f = le({ active: !1, column: "", order: "" }), O = (w = !0) => {
      let x = [...e.data.files], k = f.column, y = f.order == "asc" ? 1 : -1;
      if (!w)
        return x;
      const $ = (j, H) => typeof j == "string" && typeof H == "string" ? j.toLowerCase().localeCompare(H.toLowerCase()) : j < H ? -1 : j > H ? 1 : 0;
      return f.active && (x = x.slice().sort((j, H) => $(j[k], H[k]) * y)), x;
    }, z = (w) => {
      f.active && f.column == w ? (f.active = f.order == "asc", f.column = w, f.order = "desc") : (f.active = !0, f.column = w, f.order = "asc");
    }, Y = () => d.value.getSelection().map((w) => JSON.parse(w.dataset.item)), Z = (w, x) => {
      if (w.altKey || w.ctrlKey || w.metaKey)
        return w.preventDefault(), !1;
      w.dataTransfer.setDragImage(i.value, 0, 15), w.dataTransfer.effectAllowed = "all", w.dataTransfer.dropEffect = "copy", w.dataTransfer.setData("items", JSON.stringify(Y()));
    }, ee = (w, x) => {
      w.preventDefault();
      let k = JSON.parse(w.dataTransfer.getData("items"));
      if (k.find((y) => y.storage !== e.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.emitter.emit("vf-modal-show", { type: "move", items: { from: k, to: x } });
    }, te = (w, x) => {
      w.preventDefault(), !x || x.type !== "dir" || d.value.getSelection().find((k) => k == w.currentTarget) ? (w.dataTransfer.dropEffect = "none", w.dataTransfer.effectAllowed = "none") : w.dataTransfer.dropEffect = "copy";
    }, se = () => {
      d.value = new Ve({
        area: o.value,
        keyboardDrag: !1,
        selectedClass: "vf-explorer-selected",
        selectorClass: "vf-explorer-selector"
      }), e.emitter.on("vf-explorer-update", () => de(() => {
        d.value.clearSelection(), d.value.setSettings({
          selectables: document.getElementsByClassName("vf-item-" + l)
        });
      })), d.value.subscribe("predragstart", ({ event: w, isDragging: x }) => {
        if (x)
          m.value = d.value.getSelection().length, d.value.break();
        else {
          const k = w.target.offsetWidth - w.offsetX, y = w.target.offsetHeight - w.offsetY;
          k < 15 && y < 15 && (d.value.clearSelection(), d.value.break());
        }
      }), d.value.subscribe("predragmove", ({ isDragging: w }) => {
        w && d.value.break();
      }), d.value.subscribe("callback", ({ items: w, event: x, isDragging: k }) => {
        e.emitter.emit("vf-nodes-selected", Y()), m.value = d.value.getSelection().length;
      });
    };
    function ae(w) {
      console.log(w), w.target.play();
    }
    function ce(w) {
      console.log(w), w.target.pause(), w.target.currentTime = 0;
    }
    return I(() => {
      g = new Ne(o.value), se();
    }), De(() => {
      d.value.Area.reset(), d.value.SelectorArea.updatePos(), g.update();
    }), I(() => {
      ie(() => e.view, () => e.emitter.emit("vf-explorer-update"));
    }), ke(() => {
      g.destroy();
    }), (w, x) => (n(), u("div", bs, [
      a(e).view == "list" || c.value.length ? (n(), u("div", xs, [
        t("div", {
          onClick: x[0] || (x[0] = (k) => z("basename")),
          class: "col-span-7 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center pl-1"
        }, [
          T(v(a(s)("Name")) + " ", 1),
          R(B(re, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [oe, f.active && f.column == "basename"]
          ])
        ]),
        c.value.length ? E("", !0) : (n(), u("div", {
          key: 0,
          onClick: x[1] || (x[1] = (k) => z("file_size")),
          class: "col-span-2 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l border-r dark:border-gray-700"
        }, [
          T(v(a(s)("Size")) + " ", 1),
          R(B(re, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [oe, f.active && f.column == "file_size"]
          ])
        ])),
        c.value.length ? E("", !0) : (n(), u("div", {
          key: 1,
          onClick: x[2] || (x[2] = (k) => z("last_modified")),
          class: "col-span-3 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center"
        }, [
          T(v(a(s)("Date")) + " ", 1),
          R(B(re, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [oe, f.active && f.column == "last_modified"]
          ])
        ])),
        c.value.length ? (n(), u("div", {
          key: 2,
          onClick: x[3] || (x[3] = (k) => z("path")),
          class: "col-span-5 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l dark:border-gray-700"
        }, [
          T(v(a(s)("Filepath")) + " ", 1),
          R(B(re, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [oe, f.active && f.column == "path"]
          ])
        ])) : E("", !0)
      ])) : E("", !0),
      t("div", ws, [
        t("div", {
          ref_key: "dragImage",
          ref: i,
          class: "absolute -z-50 -top-96"
        }, [
          $s,
          t("div", Cs, v(m.value), 1)
        ], 512)
      ]),
      t("div", {
        onTouchstart: D,
        onContextmenu: x[10] || (x[10] = G((k) => a(e).emitter.emit("vf-contextmenu-show", { event: k, area: o.value, items: Y() }), ["self", "prevent"])),
        class: N([a(e).fullScreen ? "" : "resize-y", "h-full w-full text-xs vf-selector-area vf-scrollbar min-h-[150px] overflow-auto p-1 z-0"]),
        ref_key: "selectorArea",
        ref: o
      }, [
        c.value.length ? (n(!0), u(U, { key: 0 }, q(O(), (k, y) => (n(), u("div", {
          onDblclick: ($) => h(k),
          onTouchstart: x[4] || (x[4] = ($) => M($)),
          onTouchend: x[5] || (x[5] = ($) => S()),
          onContextmenu: G(($) => a(e).emitter.emit("vf-contextmenu-show", { event: $, area: o.value, items: Y(), target: k }), ["prevent"]),
          class: N(["vf-item-" + a(l), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": k.type,
          "data-item": JSON.stringify(k),
          "data-index": y
        }, [
          t("div", Ms, [
            t("div", Es, [
              k.type === "dir" ? (n(), u("svg", Ds, As)) : (n(), u("svg", Ls, Ts)),
              t("span", Os, v(k.basename), 1)
            ]),
            t("div", Vs, v(k.path), 1)
          ])
        ], 42, Ss))), 256)) : E("", !0),
        a(e).view === "list" && !c.value.length ? (n(!0), u(U, { key: 1 }, q(O(), (k, y) => (n(), u("div", {
          draggable: "true",
          onDblclick: ($) => h(k),
          onTouchstart: x[6] || (x[6] = ($) => M($)),
          onTouchend: x[7] || (x[7] = ($) => S()),
          onContextmenu: G(($) => a(e).emitter.emit("vf-contextmenu-show", { event: $, area: o.value, items: Y(), target: k }), ["prevent"]),
          onDragstart: ($) => Z($),
          onDragover: ($) => te($, k),
          onDrop: ($) => ee($, k),
          class: N(["vf-item-" + a(l), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": k.type,
          "data-item": JSON.stringify(k),
          "data-index": y
        }, [
          t("div", Us, [
            t("div", Bs, [
              k.type === "dir" ? (n(), u("svg", zs, Rs)) : (n(), u("svg", qs, Ps)),
              t("span", Ws, v(k.basename), 1)
            ]),
            t("div", Gs, v(k.file_size ? a(e).filesize(k.file_size) : ""), 1),
            t("div", Ys, v(a(we)(k.last_modified)), 1)
          ])
        ], 42, Ns))), 256)) : E("", !0),
        a(e).view === "grid" && !c.value.length ? (n(!0), u(U, { key: 2 }, q(O(!1), (k, y) => (n(), u("div", {
          draggable: "true",
          onDblclick: ($) => h(k),
          onTouchstart: x[8] || (x[8] = ($) => M($)),
          onTouchend: x[9] || (x[9] = ($) => S()),
          onContextmenu: G(($) => a(e).emitter.emit("vf-contextmenu-show", { event: $, area: o.value, items: Y(), target: k }), ["prevent"]),
          onDragstart: ($) => Z($),
          onDragover: ($) => te($, k),
          onDrop: ($) => ee($, k),
          class: N(["vf-item-" + a(l), "border border-transparent hover:bg-neutral-50 m-1 dark:hover:bg-gray-700 inline-flex w-[5.5rem] h-20 md:w-24 text-center justify-center select-none"]),
          "data-type": k.type,
          "data-item": JSON.stringify(k),
          "data-index": y
        }, [
          t("div", null, [
            t("div", Js, [
              k.type === "dir" ? (n(), u("svg", Xs, Zs)) : (k.mime_type ?? "").startsWith("image") ? (n(), u("img", {
                key: 1,
                class: "lazy h-10 md:h-12 m-auto",
                "data-src": a(e).requester.getPreviewUrl(a(e).adapter, k),
                alt: k.basename
              }, null, 8, ea)) : (k.mime_type ?? "").startsWith("video") ? (n(), u("video", {
                key: 2,
                muted: "",
                loop: "",
                class: "h-10 md:h-12 m-auto",
                onMouseenter: ae,
                onMouseleave: ce,
                alt: k.basename
              }, [
                t("source", {
                  src: a(e).requester.getPreviewUrl(a(e).adapter, k),
                  type: "video/mp4"
                }, null, 8, sa)
              ], 40, ta)) : (n(), u("svg", aa, ra)),
              !(k.mime_type ?? "").startsWith("image") && k.type != "dir" ? (n(), u("div", na, v(r(k.extension)), 1)) : E("", !0)
            ]),
            t("span", la, v(a(he)(k.basename)), 1)
          ])
        ], 42, Ks))), 256)) : E("", !0)
      ], 34),
      B(ys)
    ]));
  }
}), ca = ["onClick"], ua = ["href", "download"], ma = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), va = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), pa = {
  name: "VFContextMenu"
}, ha = /* @__PURE__ */ Object.assign(pa, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, r = b(null), o = b([]), i = b(""), m = le({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), d = Q(() => m.items.filter((_) => _.key == null || e.features.includes(_.key)));
    e.emitter.on("vf-context-selected", (_) => {
      o.value = _;
    });
    const l = {
      newfolder: {
        key: V.NEW_FOLDER,
        title: () => s("New Folder"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "new-folder" });
        }
      },
      delete: {
        key: V.DELETE,
        title: () => s("Delete"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "delete", items: o });
        }
      },
      refresh: {
        title: () => s("Refresh"),
        action: () => {
          e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: e.data.dirname } });
        }
      },
      preview: {
        key: V.PREVIEW,
        title: () => s("Preview"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: o.value[0] });
        }
      },
      open: {
        title: () => s("Open"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: o.value[0].path } });
        }
      },
      openDir: {
        title: () => s("Open containing folder"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: o.value[0].dir } });
        }
      },
      download: {
        key: V.DOWNLOAD,
        link: Q(() => e.requester.getDownloadUrl(e.data.adapter, o.value[0])),
        title: () => s("Download"),
        action: () => {
          const _ = e.requester.getDownloadUrl(e.data.adapter, o.value[0]);
          e.emitter.emit("vf-download", _);
        }
      },
      archive: {
        key: V.ARCHIVE,
        title: () => s("Archive"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "archive", items: o });
        }
      },
      unarchive: {
        key: V.UNARCHIVE,
        title: () => s("Unarchive"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "unarchive", items: o });
        }
      },
      rename: {
        key: V.RENAME,
        title: () => s("Rename"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "rename", items: o });
        }
      }
    }, c = (_) => {
      e.emitter.emit("vf-contextmenu-hide"), _.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: _ }) => {
      i.value = _;
    }), e.emitter.on("vf-contextmenu-show", ({ event: _, area: S, items: C, target: D = null }) => {
      if (m.items = [], i.value)
        if (D)
          m.items.push(l.openDir), e.emitter.emit("vf-context-selected", [D]);
        else
          return;
      else
        !D && !i.value ? (m.items.push(l.refresh), m.items.push(l.newfolder), e.emitter.emit("vf-context-selected", [])) : C.length > 1 && C.some((M) => M.path === D.path) ? (m.items.push(l.refresh), m.items.push(l.archive), m.items.push(l.delete), e.emitter.emit("vf-context-selected", C)) : (D.type == "dir" ? m.items.push(l.open) : (m.items.push(l.preview), m.items.push(l.download)), m.items.push(l.rename), D.mime_type == "application/zip" ? m.items.push(l.unarchive) : m.items.push(l.archive), m.items.push(l.delete), e.emitter.emit("vf-context-selected", [D]));
      g(_, S);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      m.active = !1;
    });
    const g = (_, S) => {
      m.active = !0, de(() => {
        const C = e.root.getBoundingClientRect(), D = S.getBoundingClientRect();
        let M = _.pageX - C.left, h = _.pageY - C.top, f = r.value.offsetHeight, O = r.value.offsetWidth;
        M = D.right - _.pageX + window.scrollX < O ? M - O : M, h = D.bottom - _.pageY + window.scrollY < f ? h - f : h, m.positions = {
          left: M + "px",
          top: h + "px"
        };
      });
    };
    return (_, S) => m.active ? (n(), u("ul", {
      key: 0,
      class: "z-30 absolute text-xs bg-neutral-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600 shadow rounded select-none",
      ref_key: "contextmenu",
      ref: r,
      style: ye(m.positions)
    }, [
      (n(!0), u(U, null, q(d.value, (C) => (n(), u("li", {
        class: "px-2 py-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-gray-700",
        key: C.title,
        onClick: (D) => c(C)
      }, [
        C.link ? (n(), u("a", {
          key: 0,
          target: "_blank",
          href: C.link,
          download: C.link
        }, [
          ma,
          t("span", null, v(C.title()), 1)
        ], 8, ua)) : (n(), u(U, { key: 1 }, [
          va,
          t("span", null, v(C.title()), 1)
        ], 64))
      ], 8, ca))), 128))
    ], 4)) : E("", !0);
  }
}), fa = { class: "p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none" }, ga = { class: "flex leading-5 items-center" }, _a = ["aria-label"], ka = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
  })
], -1), ya = [
  ka
], ba = ["value"], xa = { class: "ml-3" }, wa = { key: 0 }, $a = { class: "ml-1" }, Ca = { class: "flex leading-5 items-center justify-end" }, Sa = ["disabled"], Ma = ["aria-label"], Ea = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  })
], -1), Da = [
  Ea
], ja = {
  name: "VFStatusbar"
}, Aa = /* @__PURE__ */ Object.assign(ja, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, { setStore: r } = e.storage, o = b(0), i = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.adapter } }), r("adapter", e.adapter);
    };
    e.emitter.on("vf-nodes-selected", (l) => {
      o.value = l.length;
    });
    const m = b("");
    e.emitter.on("vf-search-query", ({ newQuery: l }) => {
      m.value = l;
    });
    const d = Q(() => {
      const l = e.selectButton.multiple ? e.selectedItems.length > 0 : e.selectedItems.length === 1;
      return e.selectButton.active && l;
    });
    return (l, c) => (n(), u("div", fa, [
      t("div", ga, [
        t("div", {
          class: "mx-2",
          "aria-label": a(s)("Storage"),
          "data-microtip-position": "top-right",
          role: "tooltip"
        }, ya, 8, _a),
        R(t("select", {
          "onUpdate:modelValue": c[0] || (c[0] = (g) => a(e).adapter = g),
          onChange: i,
          class: "py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8"
        }, [
          (n(!0), u(U, null, q(a(e).data.storages, (g) => (n(), u("option", { value: g }, v(g), 9, ba))), 256))
        ], 544), [
          [pe, a(e).adapter]
        ]),
        t("div", xa, [
          m.value.length ? (n(), u("span", wa, v(a(e).data.files.length) + " items found. ", 1)) : E("", !0),
          t("span", $a, v(o.value > 0 ? a(s)("%s item(s) selected.", o.value) : ""), 1)
        ])
      ]),
      t("div", Ca, [
        a(e).selectButton.active ? (n(), u("button", {
          key: 0,
          class: N(["vf-btn py-0 vf-btn-primary", { disabled: !d.value }]),
          disabled: !d.value,
          onClick: c[1] || (c[1] = (g) => a(e).selectButton.click(a(e).selectedItems, g))
        }, v(a(s)("Select")), 11, Sa)) : E("", !0),
        t("span", {
          class: "mr-1",
          "aria-label": a(s)("About"),
          "data-microtip-position": "top-left",
          role: "tooltip",
          onClick: c[2] || (c[2] = (g) => a(e).emitter.emit("vf-modal-show", { type: "about" }))
        }, Da, 8, Ma)
      ])
    ]));
  }
}), La = {
  name: "VueFinder"
}, Fa = /* @__PURE__ */ Object.assign(La, {
  props: {
    id: {
      type: String,
      default: "vf"
    },
    request: {
      type: [String, Object],
      required: !0
    },
    persist: {
      type: Boolean,
      default: !1
    },
    path: {
      type: String,
      default: "."
    },
    features: {
      type: [Array, Boolean],
      default: !0
    },
    debug: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String,
      default: "system"
    },
    locale: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: "600px"
    },
    maxFileSize: {
      type: String,
      default: "10mb"
    },
    fullScreen: {
      type: Boolean,
      default: !1
    },
    selectButton: {
      type: Object,
      default(p) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...p
        };
      }
    }
  },
  emits: ["select", "open"],
  setup(p, { emit: e }) {
    const s = e, o = Je(p, F("VueFinderOptions"));
    je("ServiceContainer", o);
    const { setStore: i } = o.storage, m = b(null);
    o.root = m, o.i18n, o.emitter.on("vf-modal-close", () => {
      o.modal.active = !1;
    }), o.emitter.on("vf-modal-show", (c) => {
      o.modal.active = !0, o.modal.type = c.type, o.modal.data = c;
    });
    const d = (c) => {
      Object.assign(o.data, c), o.emitter.emit("vf-nodes-selected", {}), o.emitter.emit("vf-explorer-update");
    };
    o.emitter.on("vf-nodes-selected", (c) => {
      o.selectedItems = c, s("select", c);
    });
    let l;
    return o.emitter.on("vf-fetch-abort", () => {
      l.abort(), o.loading = !1;
    }), o.emitter.on("vf-fetch", ({ params: c, body: g = null, onSuccess: _ = null, onError: S = null, noCloseModal: C = !1 }) => {
      ["index", "search"].includes(c.q) && (l && l.abort(), o.loading = !0), l = new AbortController();
      const D = l.signal;
      o.requester.send({
        url: "",
        method: c.m || "get",
        params: c,
        body: g,
        abortSignal: D
      }).then((M) => {
        o.adapter = M.adapter, o.persist && (o.path = M.dirname, i("path", o.path)), ["index", "search"].includes(c.q) && (o.loading = !1), C || o.emitter.emit("vf-modal-close"), d(M), s("open", M.dirname), _ && _(M);
      }).catch((M) => {
        S && S(M);
      });
    }), o.emitter.on("vf-download", (c) => {
      const g = document.createElement("a");
      g.style.display = "none", g.target = "_blank", g.href = c, g.download = c, o.root.appendChild(g), g.click(), g.remove();
    }), I(() => {
      let c = {};
      o.path.includes("://") && (c = {
        adapter: o.path.split("://")[0],
        path: o.path
      }), o.emitter.emit("vf-fetch", { params: { q: "index", adapter: o.adapter, ...c } });
    }), (c, g) => (n(), u("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: m
    }, [
      t("div", {
        class: N(a(o).theme.actualValue === "dark" ? "dark" : "")
      }, [
        t("div", {
          class: N([a(o).fullScreen ? "fixed w-screen inset-0 z-20" : "relative rounded-md", "border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"]),
          style: ye(a(o).fullScreen ? "" : "max-height: " + p.maxHeight),
          onMousedown: g[0] || (g[0] = (_) => a(o).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: g[1] || (g[1] = (_) => a(o).emitter.emit("vf-contextmenu-hide"))
        }, [
          B(Vt),
          B(cs),
          B(da),
          B(Aa)
        ], 38),
        B(Ae, { name: "fade" }, {
          default: A(() => [
            a(o).modal.active ? (n(), L(Le("v-f-modal-" + a(o).modal.type), { key: 0 })) : E("", !0)
          ]),
          _: 1
        }),
        B(ha)
      ], 2)
    ], 512));
  }
}), Ta = /* @__PURE__ */ t("div", { class: "fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity" }, null, -1), Oa = { class: "fixed z-10 inset-0 overflow-hidden" }, Va = { class: "relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl w-full" }, Na = { class: "bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, Ua = { class: "bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, P = {
  __name: "ModalLayout",
  setup(p) {
    const e = F("ServiceContainer");
    return I(() => {
      const s = document.querySelector(".v-f-modal input");
      s && s.focus();
    }), (s, r) => (n(), u("div", {
      class: "v-f-modal relative z-30",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: r[1] || (r[1] = J((o) => a(e).emitter.emit("vf-modal-close"), ["esc"])),
      tabindex: "0"
    }, [
      Ta,
      t("div", Oa, [
        t("div", {
          class: "flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0",
          onMousedown: r[0] || (r[0] = G((o) => a(e).emitter.emit("vf-modal-close"), ["self"]))
        }, [
          t("div", Va, [
            t("div", Na, [
              ne(s.$slots, "default")
            ]),
            t("div", Ua, [
              ne(s.$slots, "buttons")
            ])
          ])
        ], 32)
      ])
    ], 32));
  }
}, Ba = ["aria-label"], za = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  class: "w-5 h-5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  })
], -1), Ha = [
  za
], Ra = {
  name: "Message"
}, W = /* @__PURE__ */ Object.assign(Ra, {
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(p, { emit: e }) {
    var c;
    const s = e, r = F("ServiceContainer"), { t: o } = r.i18n, i = b(!1), m = b(null), d = b((c = m.value) == null ? void 0 : c.strMessage);
    ie(d, () => i.value = !1);
    const l = () => {
      s("hidden"), i.value = !0;
    };
    return (g, _) => (n(), u("div", null, [
      i.value ? E("", !0) : (n(), u("div", {
        key: 0,
        ref_key: "strMessage",
        ref: m,
        class: N(["flex mt-2 p-1 px-2 rounded text-sm break-all dark:opacity-75", p.error ? "bg-red-100 text-red-600 " : "bg-emerald-100 text-emerald-600"])
      }, [
        ne(g.$slots, "default"),
        t("div", {
          class: "ml-auto cursor-pointer",
          onClick: l,
          "aria-label": a(o)("Close"),
          "data-microtip-position": "top-left",
          role: "tooltip"
        }, Ha, 8, Ba)
      ], 2))
    ]));
  }
}), qa = { class: "sm:flex sm:items-start" }, Ia = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-red-600 dark:stroke-red-200",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    })
  ])
], -1), Pa = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Wa = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Ga = { class: "mt-2" }, Ya = { class: "text-sm text-gray-500" }, Ka = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, Ja = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Xa = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Qa = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Za = [
  Qa
], eo = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, to = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), so = [
  to
], ao = { class: "ml-1.5" }, oo = { class: "m-auto font-bold text-red-500 text-sm dark:text-red-200 text-center" }, ro = {
  name: "VFModalDelete"
}, no = /* @__PURE__ */ Object.assign(ro, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, r = b(e.modal.data.items), o = b(""), i = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: m, type: d }) => ({ path: m, type: d }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files deleted.") });
        },
        onError: (m) => {
          o.value = s(m.message);
        }
      });
    };
    return (m, d) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-danger"
        }, v(a(s)("Yes, Delete!")), 1),
        t("button", {
          type: "button",
          onClick: d[1] || (d[1] = (l) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1),
        t("div", oo, v(a(s)("This action cannot be undone.")), 1)
      ]),
      default: A(() => [
        t("div", qa, [
          Ia,
          t("div", Pa, [
            t("h3", Wa, v(a(s)("Delete files")), 1),
            t("div", Ga, [
              t("p", Ya, v(a(s)("Are you sure you want to delete these files?")), 1),
              t("div", Ka, [
                (n(!0), u(U, null, q(r.value, (l) => (n(), u("p", Ja, [
                  l.type === "dir" ? (n(), u("svg", Xa, Za)) : (n(), u("svg", eo, so)),
                  t("span", ao, v(l.basename), 1)
                ]))), 256))
              ]),
              o.value.length ? (n(), L(W, {
                key: 0,
                onHidden: d[0] || (d[0] = (l) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(o.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), lo = { class: "sm:flex sm:items-start" }, io = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "2"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    })
  ])
], -1), co = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, uo = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, mo = { class: "mt-2" }, vo = { class: "text-sm text-gray-500" }, po = {
  name: "VFModalMessage"
}, ho = /* @__PURE__ */ Object.assign(po, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n;
    return (r, o) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: o[0] || (o[0] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Close")), 1)
      ]),
      default: A(() => {
        var i, m;
        return [
          t("div", lo, [
            io,
            t("div", co, [
              t("h3", uo, v(((i = a(e).modal.data) == null ? void 0 : i.title) ?? "Title"), 1),
              t("div", mo, [
                t("p", vo, v(((m = a(e).modal.data) == null ? void 0 : m.message) ?? "Message"), 1)
              ])
            ])
          ])
        ];
      }),
      _: 1
    }));
  }
}), fo = { class: "sm:flex sm:items-start" }, go = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    })
  ])
], -1), _o = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, ko = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, yo = { class: "mt-2" }, bo = { class: "text-sm text-gray-500" }, xo = ["placeholder"], wo = {
  name: "VFModalNewFolder"
}, $o = /* @__PURE__ */ Object.assign(wo, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, r = b(""), o = b(""), i = () => {
      r.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is created.", r.value) });
        },
        onError: (m) => {
          o.value = s(m.message);
        }
      });
    };
    return (m, d) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: d[2] || (d[2] = (l) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", fo, [
          go,
          t("div", _o, [
            t("h3", ko, v(a(s)("New Folder")), 1),
            t("div", yo, [
              t("p", bo, v(a(s)("Create a new folder")), 1),
              R(t("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (l) => r.value = l),
                onKeyup: J(i, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Folder Name"),
                type: "text"
              }, null, 40, xo), [
                [X, r.value]
              ]),
              o.value.length ? (n(), L(W, {
                key: 0,
                onHidden: d[1] || (d[1] = (l) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(o.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Co = { class: "sm:flex sm:items-start" }, So = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    })
  ])
], -1), Mo = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Eo = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Do = { class: "mt-2" }, jo = { class: "text-sm text-gray-500" }, Ao = ["placeholder"], Lo = {
  name: "VFModalNewFile"
}, Fo = /* @__PURE__ */ Object.assign(Lo, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, r = b(""), o = b(""), i = () => {
      r.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is created.", r.value) });
        },
        onError: (m) => {
          o.value = s(m.message);
        }
      });
    };
    return (m, d) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: d[2] || (d[2] = (l) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", Co, [
          So,
          t("div", Mo, [
            t("h3", Eo, v(a(s)("New File")), 1),
            t("div", Do, [
              t("p", jo, v(a(s)("Create a new file")), 1),
              R(t("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (l) => r.value = l),
                onKeyup: J(i, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("File Name"),
                type: "text"
              }, null, 40, Ao), [
                [X, r.value]
              ]),
              o.value.length ? (n(), L(W, {
                key: 0,
                onHidden: d[1] || (d[1] = (l) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(o.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), To = { class: "flex" }, Oo = ["aria-label"], Vo = { class: "ml-auto mb-2" }, No = {
  key: 0,
  class: "p-2 border font-normal whitespace-pre-wrap border-gray-200 dark:border-gray-700/50 dark:text-gray-200 rounded min-h-[200px] max-h-[60vh] text-xs overflow-auto"
}, Uo = { key: 1 }, Bo = {
  __name: "Text",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, r = b(""), o = b(""), i = b(null), m = b(!1), d = b(""), l = b(!1), c = F("ServiceContainer"), { t: g } = c.i18n;
    I(() => {
      c.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: c.modal.data.adapter, path: c.modal.data.item.path },
        responseType: "text"
      }).then((C) => {
        r.value = C, s("success");
      });
    });
    const _ = () => {
      m.value = !m.value, o.value = r.value, m.value == !0 && de(() => {
        i.value.focus();
      });
    }, S = () => {
      d.value = "", l.value = !1, c.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: c.modal.data.adapter,
          path: c.modal.data.item.path
        },
        body: {
          content: o.value
        },
        responseType: "text"
      }).then((C) => {
        d.value = g("Updated."), r.value = C, s("success"), m.value = !m.value;
      }).catch((C) => {
        d.value = g(C.message), l.value = !0;
      });
    };
    return (C, D) => (n(), u(U, null, [
      t("div", To, [
        t("div", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(c).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, v(a(c).modal.data.item.basename), 9, Oo),
        t("div", Vo, [
          m.value ? (n(), u("button", {
            key: 0,
            onClick: S,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, v(a(g)("Save")), 1)) : E("", !0),
          a(c).features.includes(a(V).EDIT) ? (n(), u("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: D[0] || (D[0] = (M) => _())
          }, v(m.value ? a(g)("Cancel") : a(g)("Edit")), 1)) : E("", !0)
        ])
      ]),
      t("div", null, [
        m.value ? (n(), u("div", Uo, [
          R(t("textarea", {
            ref_key: "editInput",
            ref: i,
            "onUpdate:modelValue": D[1] || (D[1] = (M) => o.value = M),
            class: "w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh] text-xs",
            name: "text",
            id: "",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [X, o.value]
          ])
        ])) : (n(), u("pre", No, v(r.value), 1)),
        d.value.length ? (n(), L(W, {
          key: 2,
          onHidden: D[2] || (D[2] = (M) => d.value = ""),
          error: l.value
        }, {
          default: A(() => [
            T(v(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : E("", !0)
      ])
    ], 64));
  }
}, zo = { class: "flex" }, Ho = ["aria-label"], Ro = { class: "ml-auto mb-2" }, qo = { class: "w-full flex justify-center" }, Io = ["src"], Po = {
  __name: "Image",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, r = F("ServiceContainer"), { t: o } = r.i18n, i = b(null), m = b(null), d = b(!1), l = b(""), c = b(!1), g = () => {
      d.value = !d.value, d.value ? m.value = new Ue(i.value, {
        crop(S) {
        }
      }) : m.value.destroy();
    }, _ = () => {
      m.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (S) => {
          l.value = "", c.value = !1;
          const C = new FormData();
          C.set("file", S), r.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: r.modal.data.adapter,
              path: r.modal.data.item.path
            },
            body: C
          }).then((D) => {
            l.value = o("Updated."), i.value.src = r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item), g(), s("success");
          }).catch((D) => {
            l.value = o(D.message), c.value = !0;
          });
        }
      );
    };
    return I(() => {
      s("success");
    }), (S, C) => (n(), u(U, null, [
      t("div", zo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(r).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, v(a(r).modal.data.item.basename), 9, Ho),
        t("div", Ro, [
          d.value ? (n(), u("button", {
            key: 0,
            onClick: _,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, v(a(o)("Crop")), 1)) : E("", !0),
          a(r).features.includes(a(V).EDIT) ? (n(), u("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: C[0] || (C[0] = (D) => g())
          }, v(d.value ? a(o)("Cancel") : a(o)("Edit")), 1)) : E("", !0)
        ])
      ]),
      t("div", qo, [
        t("img", {
          ref_key: "image",
          ref: i,
          class: "max-w-[50vh] max-h-[50vh]",
          src: a(r).requester.getPreviewUrl(a(r).modal.data.adapter, a(r).modal.data.item),
          alt: ""
        }, null, 8, Io)
      ]),
      l.value.length ? (n(), L(W, {
        key: 0,
        onHidden: C[1] || (C[1] = (D) => l.value = ""),
        error: c.value
      }, {
        default: A(() => [
          T(v(l.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : E("", !0)
    ], 64));
  }
}, Wo = { class: "flex" }, Go = ["aria-label"], Yo = /* @__PURE__ */ t("div", null, null, -1), Ko = {
  __name: "Default",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = F("ServiceContainer"), r = e;
    return I(() => {
      r("success");
    }), (o, i) => (n(), u(U, null, [
      t("div", Wo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(s).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, v(a(s).modal.data.item.basename), 9, Go)
      ]),
      Yo
    ], 64));
  }
}, Jo = ["aria-label"], Xo = {
  class: "w-full",
  preload: "",
  controls: ""
}, Qo = ["src"], Zo = {
  __name: "Video",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = F("ServiceContainer"), r = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return I(() => {
      r("success");
    }), (i, m) => (n(), u("div", null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, v(a(s).modal.data.item.basename), 9, Jo),
      t("div", null, [
        t("video", Xo, [
          t("source", {
            src: o(),
            type: "video/mp4"
          }, null, 8, Qo),
          T(" Your browser does not support the video tag. ")
        ])
      ])
    ]));
  }
}, er = ["aria-label"], tr = {
  class: "w-full",
  controls: ""
}, sr = ["src"], ar = {
  __name: "Audio",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, r = F("ServiceContainer"), o = () => r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item);
    return I(() => {
      s("success");
    }), (i, m) => (n(), u(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(r).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, v(a(r).modal.data.item.basename), 9, er),
      t("div", null, [
        t("audio", tr, [
          t("source", {
            src: o(),
            type: "audio/mpeg"
          }, null, 8, sr),
          T(" Your browser does not support the audio element. ")
        ])
      ])
    ], 64));
  }
}, or = ["aria-label"], rr = ["data"], nr = ["src"], lr = /* @__PURE__ */ t("p", null, [
  /* @__PURE__ */ T(" Your browser does not support PDFs. "),
  /* @__PURE__ */ t("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
  /* @__PURE__ */ T(" . ")
], -1), ir = [
  lr
], dr = {
  __name: "Pdf",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = F("ServiceContainer"), r = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return I(() => {
      r("success");
    }), (i, m) => (n(), u(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, v(a(s).modal.data.item.basename), 9, or),
      t("div", null, [
        t("object", {
          class: "h-[60vh]",
          data: o(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          t("iframe", {
            class: "border-0",
            src: o(),
            width: "100%",
            height: "100%"
          }, ir, 8, nr)
        ], 8, rr)
      ])
    ], 64));
  }
}, cr = { class: "sm:flex sm:items-start" }, ur = { class: "mt-3 text-center sm:mt-0 sm:text-left w-full" }, mr = { key: 0 }, vr = { class: "text-gray-700 dark:text-gray-200 text-sm" }, pr = {
  key: 0,
  class: "flex leading-5"
}, hr = /* @__PURE__ */ t("svg", {
  class: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ t("circle", {
    class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    "stroke-width": "4"
  }),
  /* @__PURE__ */ t("path", {
    class: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })
], -1), fr = { class: "py-2 flex font-normal break-all dark:text-gray-200 rounded text-xs" }, gr = { class: "font-bold" }, _r = { class: "font-bold pl-2" }, kr = {
  key: 0,
  class: "text-xs text-gray-600 dark:text-gray-400"
}, yr = ["download", "href"], br = {
  name: "VFModalPreview"
}, xr = /* @__PURE__ */ Object.assign(br, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, r = b(!1), o = (m) => (e.modal.data.item.mime_type ?? "").startsWith(m), i = e.features.includes(V.PREVIEW);
    return i || (r.value = !0), (m, d) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d[6] || (d[6] = (l) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Close")), 1),
        a(e).features.includes(a(V).DOWNLOAD) ? (n(), u("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: a(e).requester.getDownloadUrl(a(e).modal.data.adapter, a(e).modal.data.item),
          href: a(e).requester.getDownloadUrl(a(e).modal.data.adapter, a(e).modal.data.item)
        }, v(a(s)("Download")), 9, yr)) : E("", !0)
      ]),
      default: A(() => [
        t("div", cr, [
          t("div", ur, [
            a(i) ? (n(), u("div", mr, [
              o("text") ? (n(), L(Bo, {
                key: 0,
                onSuccess: d[0] || (d[0] = (l) => r.value = !0)
              })) : o("image") ? (n(), L(Po, {
                key: 1,
                onSuccess: d[1] || (d[1] = (l) => r.value = !0)
              })) : o("video") ? (n(), L(Zo, {
                key: 2,
                onSuccess: d[2] || (d[2] = (l) => r.value = !0)
              })) : o("audio") ? (n(), L(ar, {
                key: 3,
                onSuccess: d[3] || (d[3] = (l) => r.value = !0)
              })) : o("application/pdf") ? (n(), L(dr, {
                key: 4,
                onSuccess: d[4] || (d[4] = (l) => r.value = !0)
              })) : (n(), L(Ko, {
                key: 5,
                onSuccess: d[5] || (d[5] = (l) => r.value = !0)
              }))
            ])) : E("", !0),
            t("div", vr, [
              r.value === !1 ? (n(), u("div", pr, [
                hr,
                t("span", null, v(a(s)("Loading")), 1)
              ])) : E("", !0)
            ])
          ])
        ]),
        t("div", fr, [
          t("div", null, [
            t("span", gr, v(a(s)("File Size")) + ": ", 1),
            T(v(a(e).filesize(a(e).modal.data.item.file_size)), 1)
          ]),
          t("div", null, [
            t("span", _r, v(a(s)("Last Modified")) + ": ", 1),
            T(" " + v(a(we)(a(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        a(e).features.includes(a(V).DOWNLOAD) ? (n(), u("div", kr, [
          t("span", null, v(a(s)(`Download doesn't work? You can try right-click "Download" button, select "Save link as...".`)), 1)
        ])) : E("", !0)
      ]),
      _: 1
    }));
  }
}), wr = { class: "sm:flex sm:items-start" }, $r = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    })
  ])
], -1), Cr = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Sr = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Mr = { class: "mt-2" }, Er = { class: "flex text-sm text-gray-800 dark:text-gray-400 py-2" }, Dr = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, jr = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Ar = [
  jr
], Lr = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Fr = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Tr = [
  Fr
], Or = { class: "ml-1.5" }, Vr = {
  name: "VFModalRename"
}, Nr = /* @__PURE__ */ Object.assign(Vr, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, r = b(e.modal.data.items[0]), o = b(e.modal.data.items[0].basename), i = b(""), m = () => {
      o.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          item: r.value.path,
          name: o.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is renamed.", o.value) });
        },
        onError: (d) => {
          i.value = s(d.message);
        }
      });
    };
    return (d, l) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: m,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Rename")), 1),
        t("button", {
          type: "button",
          onClick: l[2] || (l[2] = (c) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", wr, [
          $r,
          t("div", Cr, [
            t("h3", Sr, v(a(s)("Rename")), 1),
            t("div", Mr, [
              t("p", Er, [
                r.value.type === "dir" ? (n(), u("svg", Dr, Ar)) : (n(), u("svg", Lr, Tr)),
                t("span", Or, v(r.value.basename), 1)
              ]),
              R(t("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (c) => o.value = c),
                onKeyup: J(m, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [X, o.value]
              ]),
              i.value.length ? (n(), L(W, {
                key: 0,
                onHidden: l[1] || (l[1] = (c) => i.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(i.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Ur = { class: "sm:flex sm:items-start" }, Br = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    })
  ])
], -1), zr = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Hr = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Rr = { class: "mt-2" }, qr = {
  key: 0,
  class: "pointer-events-none"
}, Ir = {
  key: 1,
  class: "pointer-events-none"
}, Pr = ["disabled"], Wr = ["disabled"], Gr = { class: "text-gray-500 text-sm mb-1 pr-1 max-h-[200px] overflow-y-auto vf-scrollbar" }, Yr = { class: "rounded flex flex-shrink-0 w-6 h-6 border bg-gray-50 text-xs cursor-default dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50" }, Kr = ["textContent"], Jr = { class: "ml-1 w-full h-fit" }, Xr = { class: "text-left hidden md:block" }, Qr = { class: "text-left md:hidden" }, Zr = {
  key: 0,
  class: "ml-auto"
}, en = ["title", "disabled", "onClick"], tn = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  class: "w-5 h-5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  })
], -1), sn = [
  tn
], an = {
  key: 0,
  class: "py-2"
}, on = ["disabled"], rn = {
  name: "VFModalUpload"
}, nn = /* @__PURE__ */ Object.assign(rn, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, r = s("uppy"), o = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, i = b({ QUEUE_ENTRY_STATUS: o }), m = b(null), d = b(null), l = b(null), c = b(null), g = b(null), _ = b(null), S = b([]), C = b(""), D = b(!1), M = b(!1);
    let h;
    function f(x) {
      return S.value.findIndex((k) => k.id === x);
    }
    function O(x, k = null) {
      k = k ?? (x.webkitRelativePath || x.name), h.addFile({
        name: k,
        type: x.type,
        data: x,
        source: "Local"
      });
    }
    function z(x) {
      switch (x.status) {
        case o.DONE:
          return "text-green-600";
        case o.ERROR:
          return "text-red-600";
        case o.CANCELED:
          return "text-red-600";
        case o.PENDING:
        default:
          return "";
      }
    }
    const Y = (x) => {
      switch (x.status) {
        case o.DONE:
          return "✓";
        case o.ERROR:
        case o.CANCELED:
          return "!";
        case o.PENDING:
        default:
          return "...";
      }
    };
    function Z() {
      c.value.click();
    }
    function ee() {
      if (!D.value) {
        if (!S.value.filter((x) => x.status !== o.DONE).length) {
          C.value = s("Please select file to upload first.");
          return;
        }
        C.value = "", h.retryAll(), h.upload();
      }
    }
    function te() {
      h.cancelAll({ reason: "user" }), S.value.forEach((x) => {
        x.status !== o.DONE && (x.status = o.CANCELED, x.statusName = s("Canceled"));
      }), D.value = !1;
    }
    function se(x) {
      D.value || (h.removeFile(x.id, "removed-by-user"), S.value.splice(f(x.id), 1));
    }
    function ae(x) {
      if (!D.value) {
        if (h.cancelAll({ reason: "user" }), x) {
          const k = [];
          S.value.forEach((y) => {
            y.status !== o.DONE && k.push(y);
          }), S.value = [], k.forEach((y) => {
            O(y.originalFile, y.name);
          });
          return;
        }
        S.value.splice(0);
      }
    }
    function ce() {
      e.emitter.emit("vf-modal-close");
    }
    function w() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.data.adapter, path: e.data.dirname }
      });
    }
    return I(async () => {
      h = new Be({
        debug: e.debug,
        restrictions: {
          maxFileSize: Ye(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: r,
        onBeforeFileAdded(y, $) {
          if ($[y.id] != null) {
            const H = f(y.id);
            S.value[H].status === o.PENDING && (C.value = h.i18n("noDuplicates", { fileName: y.name })), S.value = S.value.filter((ue) => ue.id !== y.id);
          }
          return S.value.push({
            id: y.id,
            name: y.name,
            size: e.filesize(y.size),
            status: o.PENDING,
            statusName: s("Pending upload"),
            percent: null,
            originalFile: y.data
          }), !0;
        }
      }), h.use(ze, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(y, $) {
          let j;
          try {
            j = JSON.parse(y).message;
          } catch {
            j = s("Cannot parse server response.");
          }
          return new Error(j);
        },
        ...e.requester.config.xhrOptions
      }), h.on("restriction-failed", (y, $) => {
        const j = S.value[f(y.id)];
        se(j), C.value = $.message;
      }), h.on("upload", async () => {
        const y = w();
        h.setMeta({ ...y.body }), e.requester.config.xhrOptions.setUploadFileState && h.getFiles().forEach((j) => {
          h.setFileState(j.id, e.requester.config.xhrOptions.setUploadFileState(j, y));
        });
        const $ = h.getPlugin("XHRUpload");
        $.opts.method = y.method, $.opts.endpoint = y.url + "?" + new URLSearchParams(y.params), $.opts.headers = y.headers, D.value = !0, S.value.forEach((j) => {
          j.status !== o.DONE && (j.percent = null, j.status = o.UPLOADING, j.statusName = s("Pending upload"));
        });
      }), h.on("upload-progress", (y, $) => {
        const j = Math.floor($.bytesUploaded / $.bytesTotal * 100);
        S.value[f(y.id)].percent = `${j}%`;
      }), h.on("upload-success", (y) => {
        const $ = S.value[f(y.id)];
        $.status = o.DONE, $.statusName = s("Done");
      }), h.on("upload-error", (y, $) => {
        const j = S.value[f(y.id)];
        j.percent = null, j.status = o.ERROR, $.isNetworkError ? j.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : j.statusName = $ ? $.message : s("Unknown Error");
      }), h.on("error", (y) => {
        C.value = y.message, D.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), h.on("complete", () => {
        D.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), c.value.addEventListener("click", () => {
        d.value.click();
      }), g.value.addEventListener("click", () => {
        l.value.click();
      }), _.value.addEventListener("dragover", (y) => {
        y.preventDefault(), M.value = !0;
      }), _.value.addEventListener("dragleave", (y) => {
        y.preventDefault(), M.value = !1;
      });
      function x(y, $) {
        $.isFile && $.file((j) => y($, j)), $.isDirectory && $.createReader().readEntries((j) => {
          j.forEach((H) => {
            x(y, H);
          });
        });
      }
      _.value.addEventListener("drop", (y) => {
        y.preventDefault(), M.value = !1;
        const $ = /^[/\\](.+)/;
        [...y.dataTransfer.items].forEach((j) => {
          j.kind === "file" && x((H, ue) => {
            const $e = $.exec(H.fullPath);
            O(ue, $e[1]);
          }, j.webkitGetAsEntry());
        });
      });
      const k = ({ target: y }) => {
        const $ = y.files;
        for (const j of $)
          O(j);
        y.value = "";
      };
      d.value.addEventListener("change", k), l.value.addEventListener("change", k);
    }), ke(() => {
      h == null || h.close({ reason: "unmount" });
    }), (x, k) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          class: N(["vf-btn vf-btn-primary", D.value ? "bg-blue-200 hover:bg-blue-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 dark:text-gray-500" : "bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-500"]),
          disabled: D.value,
          onClick: G(ee, ["prevent"])
        }, v(a(s)("Upload")), 11, on),
        D.value ? (n(), u("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: G(te, ["prevent"])
        }, v(a(s)("Cancel")), 1)) : (n(), u("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: G(ce, ["prevent"])
        }, v(a(s)("Close")), 1))
      ]),
      default: A(() => [
        t("div", Ur, [
          Br,
          t("div", zr, [
            t("h3", Hr, v(a(s)("Upload Files")), 1),
            t("div", Rr, [
              t("div", {
                ref_key: "dropArea",
                ref: _,
                class: "flex items-center justify-center text-lg mb-4 text-gray-500 border-2 border-gray-300 rounded border-dashed select-none cursor-pointer dark:border-gray-600 h-[120px]",
                onClick: Z
              }, [
                M.value ? (n(), u("div", qr, v(a(s)("Release to drop these files.")), 1)) : (n(), u("div", Ir, v(a(s)("Drag and drop the files/folders to here or click here.")), 1))
              ], 512),
              t("div", {
                ref_key: "container",
                ref: m,
                class: "text-gray-500 mb-1"
              }, [
                t("button", {
                  ref_key: "pickFiles",
                  ref: c,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, v(a(s)("Select Files")), 513),
                t("button", {
                  ref_key: "pickFolders",
                  ref: g,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, v(a(s)("Select Folders")), 513),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: D.value,
                  onClick: k[0] || (k[0] = (y) => ae(!1))
                }, v(a(s)("Clear all")), 9, Pr),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: D.value,
                  onClick: k[1] || (k[1] = (y) => ae(!0))
                }, v(a(s)("Clear only successful")), 9, Wr)
              ], 512),
              t("div", Gr, [
                (n(!0), u(U, null, q(S.value, (y) => (n(), u("div", {
                  class: "flex hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  key: y.id
                }, [
                  t("span", Yr, [
                    t("span", {
                      class: N(["text-base m-auto", z(y)]),
                      textContent: v(Y(y))
                    }, null, 10, Kr)
                  ]),
                  t("div", Jr, [
                    t("div", Xr, v(a(he)(y.name, 40)) + " (" + v(y.size) + ")", 1),
                    t("div", Qr, v(a(he)(y.name, 16)) + " (" + v(y.size) + ")", 1),
                    t("div", {
                      class: N(["flex break-all text-left", z(y)])
                    }, [
                      T(v(y.statusName) + " ", 1),
                      y.status === i.value.QUEUE_ENTRY_STATUS.UPLOADING ? (n(), u("b", Zr, v(y.percent), 1)) : E("", !0)
                    ], 2)
                  ]),
                  t("button", {
                    type: "button",
                    class: N(["rounded w-5 h-5 border-1 text-base leading-none font-medium focus:outline-none dark:border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-600 ml-auto sm:text-xs hover:text-red-600", D.value ? "disabled:bg-gray-100 text-white text-opacity-50" : "bg-gray-100"]),
                    title: a(s)("Delete"),
                    disabled: D.value,
                    onClick: ($) => se(y)
                  }, sn, 10, en)
                ]))), 128)),
                S.value.length ? E("", !0) : (n(), u("div", an, v(a(s)("No files selected!")), 1))
              ]),
              C.value.length ? (n(), L(W, {
                key: 0,
                onHidden: k[2] || (k[2] = (y) => C.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(C.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ]),
        t("input", {
          ref_key: "internalFileInput",
          ref: d,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        t("input", {
          ref_key: "internalFolderInput",
          ref: l,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }));
  }
}), ln = { class: "sm:flex sm:items-start" }, dn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    })
  ])
], -1), cn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, un = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, mn = { class: "mt-2" }, vn = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, pn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, hn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, fn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), gn = [
  fn
], _n = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, kn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), yn = [
  kn
], bn = { class: "ml-1.5" }, xn = ["placeholder"], wn = {
  name: "VFModalArchive"
}, $n = /* @__PURE__ */ Object.assign(wn, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, r = b(""), o = b(""), i = b(e.modal.data.items), m = () => {
      i.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: i.value.map(({ path: d, type: l }) => ({ path: d, type: l })),
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file(s) archived.") });
        },
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, l) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: m,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Archive")), 1),
        t("button", {
          type: "button",
          onClick: l[2] || (l[2] = (c) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", ln, [
          dn,
          t("div", cn, [
            t("h3", un, v(a(s)("Archive the files")), 1),
            t("div", mn, [
              t("div", vn, [
                (n(!0), u(U, null, q(i.value, (c) => (n(), u("p", pn, [
                  c.type === "dir" ? (n(), u("svg", hn, gn)) : (n(), u("svg", _n, yn)),
                  t("span", bn, v(c.basename), 1)
                ]))), 256))
              ]),
              R(t("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (c) => r.value = c),
                onKeyup: J(m, ["enter"]),
                class: "my-1 px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, xn), [
                [X, r.value]
              ]),
              o.value.length ? (n(), L(W, {
                key: 0,
                onHidden: l[1] || (l[1] = (c) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(o.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Cn = { class: "sm:flex sm:items-start" }, Sn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    })
  ])
], -1), Mn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, En = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Dn = { class: "mt-2" }, jn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, An = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ln = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Fn = [
  Ln
], Tn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, On = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Vn = [
  On
], Nn = { class: "ml-1.5" }, Un = { class: "my-1 text-sm text-gray-500" }, Bn = {
  name: "VFModalUnarchive"
}, zn = /* @__PURE__ */ Object.assign(Bn, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n;
    b("");
    const r = b(e.modal.data.items[0]), o = b(""), i = b([]), m = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          item: r.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file unarchived.") });
        },
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, l) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: m,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Unarchive")), 1),
        t("button", {
          type: "button",
          onClick: l[1] || (l[1] = (c) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", Cn, [
          Sn,
          t("div", Mn, [
            t("h3", En, v(a(s)("Unarchive")), 1),
            t("div", Dn, [
              (n(!0), u(U, null, q(i.value, (c) => (n(), u("p", jn, [
                c.type === "dir" ? (n(), u("svg", An, Fn)) : (n(), u("svg", Tn, Vn)),
                t("span", Nn, v(c.basename), 1)
              ]))), 256)),
              t("p", Un, v(a(s)("The archive will be unarchived at")) + " (" + v(d.current.dirname) + ")", 1),
              o.value.length ? (n(), L(W, {
                key: 0,
                onHidden: l[0] || (l[0] = (c) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  T(v(o.value), 1)
                ]),
                _: 1
              })) : E("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Hn = { class: "sm:flex sm:items-start" }, Rn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "2",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    })
  ])
], -1), qn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, In = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Pn = { class: "text-sm text-gray-500 pb-1" }, Wn = { class: "max-h-[200px] overflow-y-auto vf-scrollbar text-left" }, Gn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Yn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Kn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Jn = [
  Kn
], Xn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Qn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Zn = [
  Qn
], el = { class: "ml-1.5" }, tl = { class: "font-bold text-xs text-gray-700 dark:text-gray-500 mt-3 tracking-wider" }, sl = { class: "flex text-sm text-gray-800 dark:text-gray-400 border dark:border-gray-700 p-1 rounded" }, al = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
  })
], -1), ol = { class: "ml-1.5 overflow-auto" }, rl = { class: "m-1 mr-auto font-bold text-gray-500 text-sm dark:text-gray-200 self-center" }, nl = {
  name: "VFModalMove"
}, ll = /* @__PURE__ */ Object.assign(nl, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const r = b(e.modal.data.items.from), o = b(""), i = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: m, type: d }) => ({ path: m, type: d })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (m) => {
          o.value = s(m.message);
        }
      });
    };
    return (m, d) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Yes, Move!")), 1),
        t("button", {
          type: "button",
          onClick: d[1] || (d[1] = (l) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1),
        t("div", rl, v(a(s)("%s item(s) selected.", r.value.length)), 1)
      ]),
      default: A(() => [
        t("div", Hn, [
          Rn,
          t("div", qn, [
            t("h3", In, v(a(s)("Move files")), 1),
            t("p", Pn, v(a(s)("Are you sure you want to move these files?")), 1),
            t("div", Wn, [
              (n(!0), u(U, null, q(r.value, (l) => (n(), u("div", Gn, [
                t("div", null, [
                  l.type === "dir" ? (n(), u("svg", Yn, Jn)) : (n(), u("svg", Xn, Zn))
                ]),
                t("div", el, v(l.path), 1)
              ]))), 256))
            ]),
            t("h4", tl, v(a(s)("Target Directory")), 1),
            t("p", sl, [
              al,
              t("span", ol, v(a(e).modal.data.items.to.path), 1)
            ]),
            o.value.length ? (n(), L(W, {
              key: 0,
              onHidden: d[0] || (d[0] = (l) => o.value = ""),
              error: ""
            }, {
              default: A(() => [
                T(v(o.value), 1)
              ]),
              _: 1
            })) : E("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), il = (p, e) => {
  const s = p.__vccOpts || p;
  for (const [r, o] of e)
    s[r] = o;
  return s;
}, dl = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(p, { emit: e, slots: s }) {
    const r = F("ServiceContainer"), o = b(!1), { t: i } = r.i18n;
    let m = null;
    const d = () => {
      clearTimeout(m), o.value = !0, m = setTimeout(() => {
        o.value = !1;
      }, 2e3);
    };
    return I(() => {
      r.emitter.on(p.on, d);
    }), Fe(() => {
      clearTimeout(m);
    }), {
      shown: o,
      t: i
    };
  }
}, cl = { key: 1 };
function ul(p, e, s, r, o, i) {
  return n(), u("div", {
    class: N(["text-sm text-green-600 dark:text-green-600 transition-opacity duration-500 ease-out", [{ "opacity-0": !r.shown }]])
  }, [
    p.$slots.default ? ne(p.$slots, "default", { key: 0 }) : (n(), u("span", cl, v(r.t("Saved.")), 1))
  ], 2);
}
const ve = /* @__PURE__ */ il(dl, [["render", ul]]), ml = { class: "sm:flex sm:items-start" }, vl = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "currentColor"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    }),
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    })
  ])
], -1), pl = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, hl = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, fl = { class: "mt-2" }, gl = { class: "text-sm text-gray-500" }, _l = { class: "text-sm font-semibold mt-5 text-gray-900 dark:text-gray-400 tracking-wider" }, kl = { class: "mt-3 text-left" }, yl = { class: "space-y-2" }, bl = { class: "flex relative gap-x-3" }, xl = { class: "h-6 items-center" }, wl = { class: "flex-1 block text-sm" }, $l = {
  for: "metric_unit",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400"
}, Cl = { class: "flex relative gap-x-3" }, Sl = { class: "h-6 items-center" }, Ml = {
  for: "theme",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm"
}, El = { class: "flex text-sm" }, Dl = ["label"], jl = ["value"], Al = {
  key: 0,
  class: "flex relative gap-x-3"
}, Ll = { class: "h-6 items-center" }, Fl = {
  for: "language",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm text-nowrap"
}, Tl = { class: "flex text-sm" }, Ol = ["label"], Vl = ["value"], Nl = {
  name: "VFModalAbout"
}, Ul = /* @__PURE__ */ Object.assign(Nl, {
  setup(p) {
    const e = F("ServiceContainer"), { getStore: s, setStore: r, clearStore: o } = e.storage, { t: i, changeLocale: m, locale: d } = e.i18n;
    b(""), b("");
    const l = async () => {
      o(), location.reload();
    }, c = (M) => {
      e.theme.set(M), e.emitter.emit("vf-theme-saved");
    }, g = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? xe : be, r("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, { i18n: _ } = F("VueFinderOptions"), C = Object.fromEntries(
      Object.entries({
        en: "English",
        fr: "French (Français)",
        de: "German (Deutsch)",
        fa: "Persian (فارسی)",
        he: "Hebrew (עִברִית)",
        hi: "Hindi (हिंदी)",
        ru: "Russian (Pусский)",
        sv: "Swedish (Svenska)",
        tr: "Turkish (Türkçe)",
        zhCN: "Simplified Chinese (简体中文)",
        zhTW: "Traditional Chinese (繁體中文)"
      }).filter(([M]) => Object.keys(_).includes(M))
    ), D = Q(() => ({
      system: i("System"),
      light: i("Light"),
      dark: i("Dark")
    }));
    return (M, h) => (n(), L(P, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: h[5] || (h[5] = (f) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(i)("Close")), 1)
      ]),
      default: A(() => [
        t("div", ml, [
          vl,
          t("div", pl, [
            t("h3", hl, v(a(i)("About %s", "Vuefinder " + a(e).version)), 1),
            t("div", fl, [
              t("p", gl, v(a(i)("Vuefinder is a file manager component for vue 3.")), 1),
              t("div", null, [
                t("h3", _l, v(a(i)("Settings")), 1)
              ]),
              t("div", kl, [
                t("fieldset", null, [
                  t("div", yl, [
                    t("div", bl, [
                      t("div", xl, [
                        R(t("input", {
                          id: "metric_unit",
                          name: "metric_unit",
                          type: "checkbox",
                          "onUpdate:modelValue": h[0] || (h[0] = (f) => a(e).metricUnits = f),
                          onClick: g,
                          class: "h-4 w-4 rounded border-gray-300 text-indigo-600 dark:accent-slate-400 focus:ring-indigo-600"
                        }, null, 512), [
                          [Te, a(e).metricUnits]
                        ])
                      ]),
                      t("div", wl, [
                        t("label", $l, [
                          T(v(a(i)("Use Metric Units")) + " ", 1),
                          B(ve, {
                            class: "ms-3",
                            on: "vf-metric-units-saved"
                          }, {
                            default: A(() => [
                              T(v(a(i)("Saved.")), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    t("div", Cl, [
                      t("div", Sl, [
                        t("label", Ml, v(a(i)("Theme")), 1)
                      ]),
                      t("div", El, [
                        R(t("select", {
                          id: "theme",
                          "onUpdate:modelValue": h[1] || (h[1] = (f) => a(e).theme.value = f),
                          onChange: h[2] || (h[2] = (f) => c(f.target.value)),
                          class: "flex-shrink-0 w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(i)("Theme")
                          }, [
                            (n(!0), u(U, null, q(D.value, (f, O) => (n(), u("option", { value: O }, v(f), 9, jl))), 256))
                          ], 8, Dl)
                        ], 544), [
                          [pe, a(e).theme.value]
                        ]),
                        B(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-theme-saved"
                        }, {
                          default: A(() => [
                            T(v(a(i)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    a(e).features.includes(a(V).LANGUAGE) && Object.keys(a(C)).length > 1 ? (n(), u("div", Al, [
                      t("div", Ll, [
                        t("label", Fl, v(a(i)("Language")), 1)
                      ]),
                      t("div", Tl, [
                        R(t("select", {
                          id: "language",
                          "onUpdate:modelValue": h[3] || (h[3] = (f) => _e(d) ? d.value = f : null),
                          onChange: h[4] || (h[4] = (f) => a(m)(f.target.value)),
                          class: "flex-shrink-0 w-1/2 sm:w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(i)("Language")
                          }, [
                            (n(!0), u(U, null, q(a(C), (f, O) => (n(), u("option", { value: O }, v(f), 9, Vl))), 256))
                          ], 8, Ol)
                        ], 544), [
                          [pe, a(d)]
                        ]),
                        B(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-language-saved"
                        }, {
                          default: A(() => [
                            T(v(a(i)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])) : E("", !0),
                    t("button", {
                      onClick: l,
                      type: "button",
                      class: "vf-btn vf-btn-secondary"
                    }, v(a(i)("Reset Settings")), 1)
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ModalAbout: Ul,
  ModalArchive: $n,
  ModalDelete: no,
  ModalMessage: ho,
  ModalMove: ll,
  ModalNewFile: Fo,
  ModalNewFolder: $o,
  ModalPreview: xr,
  ModalRename: Nr,
  ModalUnarchive: zn,
  ModalUpload: nn
}, Symbol.toStringTag, { value: "Module" })), Jl = {
  /** @param {import('vue').App} app
   * @param options
   */
  install(p, e = {}) {
    p.component("VueFinder", Fa);
    for (const r of Object.values(Bl))
      p.component(r.name, r);
    e.i18n = e.i18n ?? {};
    let [s] = Object.keys(e.i18n);
    e.locale = e.locale ?? s ?? "en", p.provide("VueFinderOptions", e);
  }
};
export {
  Jl as default
};
