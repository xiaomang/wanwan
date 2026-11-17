const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./De33VE6A.js","./pages.BEIu9Gik.css","./WuKY5LNJ.js","./default.RZkpv5y3.css"])))=>i.map(i=>d[i]);
// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// node_modules/nostics/dist/index.mjs
var captureStackTrace = Error.captureStackTrace;
var Diagnostic = class Diagnostic extends Error {
	/**
	* Alias for {@link Error.message}: the reason this diagnostic was raised.
	*/
	get why() {
		return this.message;
	}
	/**
	* @param init        structured initializer; `why` is required
	* @param captureFrom V8 stack-cutoff frame. Defaults to {@link Diagnostic}
	* so the top of the trace is the `new Diagnostic(...)` call site.
	* `defineDiagnostics` passes its action method to strip its own frames too.
	* Ignored on engines without `Error.captureStackTrace`.
	*/
	constructor(init, captureFrom = Diagnostic) {
		super(init.why, { cause: init.cause });
		this.code = this.name = init.code;
		this.docs = init.docs;
		this.fix = init.fix;
		this.sources = init.sources;
		this.data = init.data;
		captureStackTrace?.(this, captureFrom);
	}
	/**
	* Converts the diagnostic into a serializable structured object.
	*/
	toJSON() {
		return {
			name: this.name,
			why: this.why,
			fix: this.fix,
			docs: this.docs,
			sources: this.sources,
			cause: this.cause,
			data: this.data,
			stack: this.stack
		};
	}
};
/**
* Resolves the docs URL for a code from a `docsBase` (string template or
* resolver function). Shared by {@link defineDiagnostics} and
* {@link defineProdDiagnostics}. Per-code `docs` overrides are handled by the
* caller; this only covers the `docsBase`-derived case.
*
* @internal
*/
function deriveDocs(docsBase, code) {
	return typeof docsBase === "string" ? `${docsBase}/${code.toLowerCase()}` : docsBase?.(code);
}
/**
* Runtime of {@link Diagnostics.is}: matches diagnostics tagged with `id`.
*
* @internal
*/
var createRegistryIs = (id) => (error) => error instanceof Diagnostic && id in error;
/**
* Production counterpart to {@link defineDiagnostics}. Returns a `Proxy` that
* builds a minimal {@link Diagnostic} for any accessed code: the code becomes
* the instance `name`, `docs` is derived from `docsBase`, and `why` points to
* the docs URL when one exists (empty otherwise, so the thrown header is just
* the code). It carries no catalog text or data, so it stays tiny in a bundle.
*
* The strip plugin (`@nostics/unplugin`) can rewrite a `defineDiagnostics()`
* call into a `process.env.NODE_ENV === 'production'` ternary that selects this
* factory in production, dropping every `why`/`fix` string from the bundle.
*
* @example
* ```ts
* const diagnostics = defineProdDiagnostics({ docsBase: 'https://docs.example.com' })
* throw diagnostics.NUXT_B2011() // NUXT_B2011: https://docs.example.com/nuxt_b2011
* ```
*/
/* @__NO_SIDE_EFFECTS__ */
function defineProdDiagnostics(options = {}) {
	const { docsBase, reporters = [] } = options;
	const id = Symbol();
	const is = createRegistryIs(id);
	const target = Object.defineProperty({}, "is", { value: is });
	return new Proxy(target, { get(_target, code) {
		if (typeof code !== "string" || code === "toJSON") return void 0;
		if (code === "is") return is;
		const handle = (params = {}, reporterOptions = {}) => {
			const docs = deriveDocs(docsBase, code);
			const diagnostic = new Diagnostic({
				code,
				why: docs ?? "",
				docs,
				cause: params.cause,
				sources: params.sources
			}, handle);
			diagnostic[id] = 1;
			for (const reporter of reporters) reporter(diagnostic, reporterOptions);
			return diagnostic;
		};
		handle.is = (err) => is(err) && err.code === code;
		return handle;
	} });
}
// node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
// node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/nuxt/dist/app/internal/context.js
var clientContexts = globalThis.__nuxt_app_ctx__ ||= {};
/** Singleton stand-in for `unctx` in the browser, which has no `AsyncLocalStorage`. */
function getClientContext(key) {
	return clientContexts[key] ||= (() => {
		let instance;
		return {
			use: () => {
				if (instance === void 0) throw new Error("Context is not available");
				return instance;
			},
			tryUse: () => instance ?? null,
			set: (newInstance) => {
				instance = newInstance;
			},
			unset: () => {
				instance = void 0;
			},
			call: (newInstance, callback) => {
				instance = newInstance;
				return callback();
			},
			callAsync: (newInstance, callback) => {
				instance = newInstance;
				return Promise.resolve(callback());
			}
		};
	})();
}
function getContext(key, opts) {
	return getClientContext(key);
}
// node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var NOOP = () => {};
var NO = () => false;
var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
var isModelListener = (key) => key.startsWith("onUpdate:");
var extend = Object.assign;
var remove = (arr, el) => {
	const i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
};
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
var isArray$1 = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isSet = (val) => toTypeString(val) === "[object Set]";
var isDate = (val) => toTypeString(val) === "[object Date]";
var isRegExp = (val) => toTypeString(val) === "[object RegExp]";
var isFunction = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
	return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
var isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
var cacheStringFunction = (fn) => {
	const cache = /* @__PURE__ */ Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
};
var camelizeRE = /-\w/g;
var camelize = /* @__PURE__ */ cacheStringFunction((str) => {
	return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = /* @__PURE__ */ cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = /* @__PURE__ */ cacheStringFunction((str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});
var toHandlerKey = /* @__PURE__ */ cacheStringFunction((str) => {
	return str ? `on${capitalize(str)}` : ``;
});
var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
var invokeArrayFns = (fns, ...arg) => {
	for (let i = 0; i < fns.length; i++) fns[i](...arg);
};
var def = (obj, key, value, writable = false) => {
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: false,
		writable,
		value
	});
};
var looseToNumber = (val) => {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
};
var toNumber = (val) => {
	const n = isString(val) ? Number(val) : NaN;
	return isNaN(n) ? val : n;
};
var _globalThis$1;
var getGlobalThis = () => {
	return _globalThis$1 || (_globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
	if (isArray$1(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) for (const key in normalized) res[key] = normalized[key];
		}
		return res;
	} else if (isString(value) || isObject(value)) return value;
}
var listDelimiterRE = /;(?![^(]*\))/g;
var propertyDelimiterRE = /:([^]+)/;
var styleCommentRE = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, (match) => match.startsWith("/*") ? "" : match).split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString(value)) res = value;
	else if (isArray$1(value)) for (let i = 0; i < value.length; i++) {
		const normalized = normalizeClass(value[i]);
		if (normalized) res += normalized + " ";
	}
	else if (isObject(value)) {
		for (const name in value) if (value[name]) res += name + " ";
	}
	return res.trim();
}
var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(`itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly`);
function includeBooleanAttr(value) {
	return !!value || value === "";
}
function looseCompareArrays(a, b, seen) {
	if (a.length !== b.length) return false;
	let equal = true;
	for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i], seen);
	return equal;
}
function looseCompareCollections(a, b, seen) {
	if (a.size !== b.size) return false;
	const candidates = Array.from(b);
	const matched = new Uint8Array(candidates.length);
	for (const item of a) {
		let index = -1;
		for (let i = 0; i < candidates.length; i++) if (!matched[i] && looseEqual(item, candidates[i], seen)) {
			index = i;
			break;
		}
		if (index < 0) return false;
		matched[index] = 1;
	}
	return true;
}
function looseCompareObjects(a, b, seen) {
	let aValidType = isMap(a);
	let bValidType = isMap(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareCollections(a, b, seen) : false;
	aValidType = isSet(a);
	bValidType = isSet(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareCollections(a, b, seen) : false;
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) {
		const aHasKey = a.hasOwnProperty(key);
		const bHasKey = b.hasOwnProperty(key);
		if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key], seen)) return false;
	}
	return String(a) === String(b);
}
function looseCompareNested(a, b, seen, compare) {
	if (!seen) seen = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	const [seenA, seenB] = seen;
	if (seenA.has(a) || seenB.has(b)) return seenA.get(a) === b && seenB.get(b) === a;
	seenA.set(a, b);
	seenB.set(b, a);
	const equal = compare(a, b, seen);
	seenA.delete(a);
	seenB.delete(b);
	return equal;
}
function looseEqual(a, b, seen) {
	if (a === b) return true;
	let aValidType = isDate(a);
	let bValidType = isDate(b);
	if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
	aValidType = isSymbol(a);
	bValidType = isSymbol(b);
	if (aValidType || bValidType) return a === b;
	aValidType = isArray$1(a);
	bValidType = isArray$1(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareNested(a, b, seen, looseCompareArrays) : false;
	aValidType = isObject(a);
	bValidType = isObject(b);
	if (aValidType || bValidType) {
		if (!aValidType || !bValidType) return false;
		return looseCompareNested(a, b, seen, looseCompareObjects);
	}
	return String(a) === String(b);
}
var isRef$1 = (val) => {
	return !!(val && val["__v_isRef"] === true);
};
var toDisplayString = (val) => {
	return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
var replacer = (_key, val) => {
	if (isRef$1(val)) return replacer(_key, val.value);
	else if (isMap(val)) return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
		entries[stringifySymbol(key, i) + " =>"] = val2;
		return entries;
	}, {}) };
	else if (isSet(val)) return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
	else if (isSymbol(val)) return stringifySymbol(val);
	else if (isObject(val) && !isArray$1(val) && !isPlainObject$1(val)) return String(val);
	return val;
};
var stringifySymbol = (v, i = "") => {
	var _a;
	return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
/**
* @vue/reactivity v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var activeEffectScope;
var EffectScope = class {
	constructor(detached = false) {
		this.detached = detached;
		/**
		* @internal
		*/
		this._active = true;
		/**
		* @internal track `on` calls, allow `on` call multiple times
		*/
		this._on = 0;
		/**
		* @internal
		*/
		this.effects = [];
		/**
		* @internal
		*/
		this.cleanups = [];
		this._isPaused = false;
		this._warnOnRun = true;
		this.__v_skip = true;
		if (!detached && activeEffectScope) {
			if (activeEffectScope.active) {
				this.parent = activeEffectScope;
				this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
			} else {
				this._active = false;
				this._warnOnRun = false;
			}
		}
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = true;
			let i, l;
			if (this.scopes) {
				const scopes = this.scopes.slice();
				for (i = 0, l = scopes.length; i < l; i++) scopes[i].pause();
			}
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
		}
	}
	/**
	* Resumes the effect scope, including all child scopes and effects.
	*/
	resume() {
		if (this._active) {
			if (this._isPaused) {
				this._isPaused = false;
				let i, l;
				if (this.scopes) {
					const scopes = this.scopes.slice();
					for (i = 0, l = scopes.length; i < l; i++) scopes[i].resume();
				}
				const effects = this.effects.slice();
				for (i = 0, l = effects.length; i < l; i++) effects[i].resume();
			}
		}
	}
	run(fn) {
		if (this._active) {
			const currentEffectScope = activeEffectScope;
			try {
				activeEffectScope = this;
				return fn();
			} finally {
				activeEffectScope = currentEffectScope;
			}
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	on() {
		if (++this._on === 1) {
			this.prevScope = activeEffectScope;
			activeEffectScope = this;
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (activeEffectScope === this) activeEffectScope = this.prevScope;
			else {
				let current = activeEffectScope;
				while (current) {
					if (current.prevScope === this) {
						current.prevScope = this.prevScope;
						break;
					}
					current = current.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(fromParent) {
		if (this._active) {
			this._active = false;
			let i, l;
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
			this.effects.length = 0;
			for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
			this.cleanups.length = 0;
			if (this.scopes) {
				const scopes = this.scopes.slice();
				for (i = 0, l = scopes.length; i < l; i++) scopes[i].stop(true);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !fromParent) {
				const last = this.parent.scopes.pop();
				if (last && last !== this) {
					this.parent.scopes[this.index] = last;
					last.index = this.index;
				}
			}
			this.parent = void 0;
		}
	}
};
function effectScope(detached) {
	return new EffectScope(detached);
}
function getCurrentScope() {
	return activeEffectScope;
}
function onScopeDispose(fn, failSilently = false) {
	if (activeEffectScope) {
		if (activeEffectScope.active) activeEffectScope.cleanups.push(fn);
		else fn();
	}
}
var activeSub;
var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
var ReactiveEffect = class {
	constructor(fn) {
		this.fn = fn;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 5;
		/**
		* @internal
		*/
		this.next = void 0;
		/**
		* @internal
		*/
		this.cleanup = void 0;
		this.scheduler = void 0;
		if (activeEffectScope) {
			if (activeEffectScope.active) activeEffectScope.effects.push(this);
			else this.flags &= -2;
		}
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		if (this.flags & 64) {
			this.flags &= -65;
			if (pausedQueueEffects.has(this)) {
				pausedQueueEffects.delete(this);
				this.trigger();
			}
		}
	}
	/**
	* @internal
	*/
	notify() {
		if (this.flags & 2 && !(this.flags & 32)) return;
		if (!(this.flags & 8)) batch(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2;
		cleanupEffect(this);
		prepareDeps(this);
		const prevEffect = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = this;
		shouldTrack = true;
		try {
			return this.fn();
		} finally {
			cleanupDeps(this);
			activeSub = prevEffect;
			shouldTrack = prevShouldTrack;
			this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let link = this.deps; link; link = link.nextDep) removeSub(link);
			this.deps = this.depsTail = void 0;
			cleanupEffect(this);
			this.onStop && this.onStop();
			this.flags &= -2;
		}
	}
	trigger() {
		if (this.flags & 64) pausedQueueEffects.add(this);
		else if (this.scheduler) this.scheduler();
		else this.runIfDirty();
	}
	/**
	* @internal
	*/
	runIfDirty() {
		if (isDirty(this)) this.run();
	}
	get dirty() {
		return isDirty(this);
	}
};
var batchDepth = 0;
var batchedSub;
var batchedComputed;
function batch(sub, isComputed = false) {
	sub.flags |= 8;
	if (isComputed) {
		sub.next = batchedComputed;
		batchedComputed = sub;
		return;
	}
	sub.next = batchedSub;
	batchedSub = sub;
}
function startBatch() {
	batchDepth++;
}
function endBatch() {
	if (--batchDepth > 0) return;
	if (batchedComputed) {
		let e = batchedComputed;
		batchedComputed = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			e = next;
		}
	}
	let error;
	while (batchedSub) {
		let e = batchedSub;
		batchedSub = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			if (e.flags & 1) try {
				e.trigger();
			} catch (err) {
				if (!error) error = err;
			}
			e = next;
		}
	}
	if (error) throw error;
}
function prepareDeps(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		link.version = -1;
		link.prevActiveLink = link.dep.activeLink;
		link.dep.activeLink = link;
	}
}
function cleanupDeps(sub) {
	let head;
	let tail = sub.depsTail;
	let link = tail;
	while (link) {
		const prev = link.prevDep;
		if (link.version === -1) {
			if (link === tail) tail = prev;
			removeSub(link);
			removeDep(link);
		} else head = link;
		link.dep.activeLink = link.prevActiveLink;
		link.prevActiveLink = void 0;
		link = prev;
	}
	sub.deps = head;
	sub.depsTail = tail;
}
function isDirty(sub) {
	for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
	if (sub._dirty) return true;
	return false;
}
function refreshComputed(computed) {
	if (computed.flags & 4 && !(computed.flags & 16)) return;
	computed.flags &= -17;
	if (computed.globalVersion === globalVersion) return;
	computed.globalVersion = globalVersion;
	if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
	computed.flags |= 2;
	const dep = computed.dep;
	const prevSub = activeSub;
	const prevShouldTrack = shouldTrack;
	activeSub = computed;
	shouldTrack = true;
	try {
		prepareDeps(computed);
		const value = computed.fn(computed._value);
		if (dep.version === 0 || hasChanged(value, computed._value)) {
			computed.flags |= 128;
			computed._value = value;
			dep.version++;
		}
	} catch (err) {
		dep.version++;
		throw err;
	} finally {
		activeSub = prevSub;
		shouldTrack = prevShouldTrack;
		cleanupDeps(computed);
		computed.flags &= -3;
	}
}
function removeSub(link, soft = false) {
	const { dep, prevSub, nextSub } = link;
	if (prevSub) {
		prevSub.nextSub = nextSub;
		link.prevSub = void 0;
	}
	if (nextSub) {
		nextSub.prevSub = prevSub;
		link.nextSub = void 0;
	}
	if (dep.subs === link) {
		dep.subs = prevSub;
		if (!prevSub && dep.computed) {
			dep.computed.flags &= -5;
			for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
		}
	}
	if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
}
function removeDep(link) {
	const { prevDep, nextDep } = link;
	if (prevDep) {
		prevDep.nextDep = nextDep;
		link.prevDep = void 0;
	}
	if (nextDep) {
		nextDep.prevDep = prevDep;
		link.nextDep = void 0;
	}
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
	const { cleanup } = e;
	e.cleanup = void 0;
	if (cleanup) {
		const prevSub = activeSub;
		activeSub = void 0;
		try {
			cleanup();
		} finally {
			activeSub = prevSub;
		}
	}
}
var globalVersion = 0;
var Link = class {
	constructor(sub, dep) {
		this.sub = sub;
		this.dep = dep;
		this.version = dep.version;
		this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
};
var Dep = class {
	constructor(computed) {
		this.computed = computed;
		this.version = 0;
		/**
		* Link between this dep and the current active effect
		*/
		this.activeLink = void 0;
		/**
		* Doubly linked list representing the subscribing effects (tail)
		*/
		this.subs = void 0;
		/**
		* For object property deps cleanup
		*/
		this.map = void 0;
		this.key = void 0;
		/**
		* Subscriber counter
		*/
		this.sc = 0;
		/**
		* @internal
		*/
		this.__v_skip = true;
	}
	track(debugInfo) {
		if (!activeSub || !shouldTrack || activeSub === this.computed) return;
		let link = this.activeLink;
		if (link === void 0 || link.sub !== activeSub) {
			link = this.activeLink = new Link(activeSub, this);
			if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
			else {
				link.prevDep = activeSub.depsTail;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
			}
			addSub(link);
		} else if (link.version === -1) {
			link.version = this.version;
			if (link.nextDep) {
				const next = link.nextDep;
				next.prevDep = link.prevDep;
				if (link.prevDep) link.prevDep.nextDep = next;
				link.prevDep = activeSub.depsTail;
				link.nextDep = void 0;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
				if (activeSub.deps === link) activeSub.deps = next;
			}
		}
		return link;
	}
	trigger(debugInfo) {
		this.version++;
		globalVersion++;
		this.notify(debugInfo);
	}
	notify(debugInfo) {
		startBatch();
		try {
			for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
		} finally {
			endBatch();
		}
	}
};
function addSub(link) {
	link.dep.sc++;
	if (link.sub.flags & 4) {
		const computed = link.dep.computed;
		if (computed && !link.dep.subs) {
			computed.flags |= 20;
			for (let l = computed.deps; l; l = l.nextDep) addSub(l);
		}
		const currentTail = link.dep.subs;
		if (currentTail !== link) {
			link.prevSub = currentTail;
			if (currentTail) currentTail.nextSub = link;
		}
		link.dep.subs = link;
	}
}
var targetMap = /* @__PURE__ */ new WeakMap();
var ITERATE_KEY = /* @__PURE__ */ Symbol("");
var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
function track(target, type, key) {
	if (shouldTrack && activeSub) {
		let depsMap = targetMap.get(target);
		if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
		let dep = depsMap.get(key);
		if (!dep) {
			depsMap.set(key, dep = new Dep());
			dep.map = depsMap;
			dep.key = key;
		}
		dep.track();
	}
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		globalVersion++;
		return;
	}
	const run = (dep) => {
		if (dep) dep.trigger();
	};
	startBatch();
	if (type === "clear") depsMap.forEach(run);
	else {
		const targetIsArray = isArray$1(target);
		const isArrayIndex = targetIsArray && isIntegerKey(key);
		if (targetIsArray && key === "length") {
			const newLength = Number(newValue);
			depsMap.forEach((dep, key2) => {
				if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) run(dep);
			});
		} else {
			if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
			if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
			switch (type) {
				case "add":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					} else if (isArrayIndex) run(depsMap.get("length"));
					break;
				case "delete":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					}
					break;
				case "set": if (isMap(target)) run(depsMap.get(ITERATE_KEY));
			}
		}
	}
	endBatch();
}
function getDepFromReactive(object, key) {
	const depMap = targetMap.get(object);
	return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
	const raw = /* @__PURE__ */ toRaw(array);
	if (raw === array) return raw;
	track(raw, "iterate", ARRAY_ITERATE_KEY);
	if (/* @__PURE__ */ isShallow(array)) return raw;
	if (!/* @__PURE__ */ isReadonly(array)) return raw.map(toReactive);
	return /* @__PURE__ */ isReactive(array) ? raw.map((item) => toReadonly(toReactive(item))) : raw.map(toReadonly);
}
function shallowReadArray(arr) {
	track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
	return arr;
}
function toWrapped(target, item) {
	if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
	return toReactive(item);
}
var arrayInstrumentations = {
	__proto__: null,
	[Symbol.iterator]() {
		return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
	},
	concat(...args) {
		return reactiveReadArray(this).concat(...args.map((x) => isArray$1(x) ? reactiveReadArray(x) : x));
	},
	entries() {
		return iterator(this, "entries", (value) => {
			value[1] = toWrapped(this, value[1]);
			return value;
		});
	},
	every(fn, thisArg) {
		return apply(this, "every", fn, thisArg, void 0, arguments);
	},
	filter(fn, thisArg) {
		return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
	},
	find(fn, thisArg) {
		return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findIndex(fn, thisArg) {
		return apply(this, "findIndex", fn, thisArg, void 0, arguments);
	},
	findLast(fn, thisArg) {
		return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findLastIndex(fn, thisArg) {
		return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
	},
	forEach(fn, thisArg) {
		return apply(this, "forEach", fn, thisArg, void 0, arguments);
	},
	includes(...args) {
		return searchProxy(this, "includes", args);
	},
	indexOf(...args) {
		return searchProxy(this, "indexOf", args);
	},
	join(separator) {
		return reactiveReadArray(this).join(separator);
	},
	lastIndexOf(...args) {
		return searchProxy(this, "lastIndexOf", args);
	},
	map(fn, thisArg) {
		return apply(this, "map", fn, thisArg, void 0, arguments);
	},
	pop() {
		return noTracking(this, "pop");
	},
	push(...args) {
		return noTracking(this, "push", args);
	},
	reduce(fn, ...args) {
		return reduce(this, "reduce", fn, args);
	},
	reduceRight(fn, ...args) {
		return reduce(this, "reduceRight", fn, args);
	},
	shift() {
		return noTracking(this, "shift");
	},
	some(fn, thisArg) {
		return apply(this, "some", fn, thisArg, void 0, arguments);
	},
	splice(...args) {
		return noTracking(this, "splice", args);
	},
	toReversed() {
		return reactiveReadArray(this).toReversed();
	},
	toSorted(comparer) {
		return reactiveReadArray(this).toSorted(comparer);
	},
	toSpliced(...args) {
		return reactiveReadArray(this).toSpliced(...args);
	},
	unshift(...args) {
		return noTracking(this, "unshift", args);
	},
	values() {
		return iterator(this, "values", (item) => toWrapped(this, item));
	}
};
function iterator(self, method, wrapValue) {
	const arr = shallowReadArray(self);
	const methodFn = arr[method];
	const iter = methodFn.call(arr);
	if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
		if (iter[Symbol.toStringTag] === "Array Iterator") {
			const wrapped = Object.create(Object.getPrototypeOf(iter));
			wrapped.next = () => wrapResult(iter.next(), wrapValue);
			if (methodFn !== arrayProto[method]) Object.defineProperties(wrapped, {
				return: { get() {
					const fn = iter.return;
					return typeof fn === "function" ? fn.bind(iter) : fn;
				} },
				throw: { get() {
					const fn = iter.throw;
					return typeof fn === "function" ? fn.bind(iter) : fn;
				} }
			});
			return wrapped;
		}
		iter._next = iter.next;
		iter.next = () => wrapResult(iter._next(), wrapValue);
	}
	return iter;
}
function wrapResult(result, wrapValue) {
	if (!result.done) result.value = wrapValue(result.value);
	return result;
}
var arrayProto = Array.prototype;
function apply(self, method, fn, thisArg, wrappedRetFn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	const methodFn = arr[method];
	if (methodFn !== arrayProto[method]) {
		const result2 = methodFn.apply(self, args);
		return needsWrap ? toReactive(result2) : result2;
	}
	let wrappedFn = fn;
	if (arr !== self) {
		if (needsWrap) wrappedFn = function(item, index) {
			return fn.call(this, toWrapped(self, item), index, self);
		};
		else if (fn.length > 2) wrappedFn = function(item, index) {
			return fn.call(this, item, index, self);
		};
	}
	const result = methodFn.call(arr, wrappedFn, thisArg);
	return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self, method, fn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	let wrappedFn = fn;
	let wrapInitialAccumulator = false;
	if (arr !== self) {
		if (needsWrap) {
			wrapInitialAccumulator = args.length === 0;
			wrappedFn = function(acc, item, index) {
				if (wrapInitialAccumulator) {
					wrapInitialAccumulator = false;
					acc = toWrapped(self, acc);
				}
				return fn.call(this, acc, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
			return fn.call(this, acc, item, index, self);
		};
	}
	const result = arr[method](wrappedFn, ...args);
	return wrapInitialAccumulator ? toWrapped(self, result) : result;
}
function searchProxy(self, method, args) {
	const arr = /* @__PURE__ */ toRaw(self);
	track(arr, "iterate", ARRAY_ITERATE_KEY);
	const res = arr[method](...args);
	if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
		args[0] = /* @__PURE__ */ toRaw(args[0]);
		return arr[method](...args);
	}
	return res;
}
function noTracking(self, method, args = []) {
	pauseTracking();
	startBatch();
	const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
	endBatch();
	resetTracking();
	return res;
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = /* @__PURE__ */ new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
function hasOwnProperty(key) {
	if (!isSymbol(key)) key = String(key);
	const obj = /* @__PURE__ */ toRaw(this);
	track(obj, "has", key);
	return obj.hasOwnProperty(key);
}
var BaseReactiveHandler = class {
	constructor(_isReadonly = false, _isShallow = false) {
		this._isReadonly = _isReadonly;
		this._isShallow = _isShallow;
	}
	get(target, key, receiver) {
		if (key === "__v_skip") return target["__v_skip"];
		const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_isShallow") return isShallow2;
		else if (key === "__v_raw") {
			if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
			return;
		}
		const targetIsArray = isArray$1(target);
		if (!isReadonly2) {
			let fn;
			if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
			if (key === "hasOwnProperty") return hasOwnProperty;
		}
		const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
		if (!isReadonly2) track(target, "get", key);
		if (isShallow2) return res;
		if (/* @__PURE__ */ isRef(res)) {
			const value = targetIsArray && isIntegerKey(key) ? res : res.value;
			return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
		}
		if (isObject(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
		return res;
	}
};
var MutableReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(false, isShallow2);
	}
	set(target, key, value, receiver) {
		let oldValue = target[key];
		const isArrayWithIntegerKey = isArray$1(target) && isIntegerKey(key);
		if (!this._isShallow) {
			const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
			if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
				oldValue = /* @__PURE__ */ toRaw(oldValue);
				value = /* @__PURE__ */ toRaw(value);
			}
			if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
				if (isOldValueReadonly) return true;
				else {
					oldValue.value = value;
					return true;
				}
			}
		}
		const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (target === /* @__PURE__ */ toRaw(receiver) && result) {
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
		}
		return result;
	}
	deleteProperty(target, key) {
		const hadKey = hasOwn(target, key);
		const oldValue = target[key];
		const result = Reflect.deleteProperty(target, key);
		if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
		return result;
	}
	has(target, key) {
		const result = Reflect.has(target, key);
		if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
		return result;
	}
	ownKeys(target) {
		track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
		return Reflect.ownKeys(target);
	}
};
var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(true, isShallow2);
	}
	set(target, key) {
		return true;
	}
	deleteProperty(target, key) {
		return true;
	}
};
var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = /* @__PURE__ */ toRaw(target);
		const targetIsMap = isMap(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
		!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return extend(Object.create(innerIterator), { next() {
			const { value, done } = innerIterator.next();
			return done ? {
				value,
				done
			} : {
				value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
				done
			};
		} });
	};
}
function createReadonlyMethod(type) {
	return function(...args) {
		return type === "delete" ? false : type === "clear" ? void 0 : this;
	};
}
function createInstrumentations(readonly, shallow) {
	const instrumentations = {
		get(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
				track(rawTarget, "get", rawKey);
			}
			const { has } = getProto(rawTarget);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			if (has.call(rawTarget, key)) return wrap(target.get(key));
			else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
			else if (target !== rawTarget) target.get(key);
		},
		get size() {
			const target = this["__v_raw"];
			!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
			return target.size;
		},
		has(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
				track(rawTarget, "has", rawKey);
			}
			return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
		},
		forEach(callback, thisArg) {
			const observed = this;
			const target = observed["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			!readonly && track(rawTarget, "iterate", ITERATE_KEY);
			return target.forEach((value, key) => {
				return callback.call(thisArg, wrap(value), wrap(key), observed);
			});
		}
	};
	extend(instrumentations, readonly ? {
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear")
	} : {
		add(value) {
			const target = /* @__PURE__ */ toRaw(this);
			const proto = getProto(target);
			const rawValue = /* @__PURE__ */ toRaw(value);
			const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
			if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
				target.add(valueToAdd);
				trigger(target, "add", valueToAdd, valueToAdd);
			}
			return this;
		},
		set(key, value) {
			if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get.call(target, key);
			target.set(key, value);
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			return this;
		},
		delete(key) {
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get ? get.call(target, key) : void 0;
			const result = target.delete(key);
			if (hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		},
		clear() {
			const target = /* @__PURE__ */ toRaw(this);
			const hadItems = target.size !== 0;
			const oldTarget = void 0;
			const result = target.clear();
			if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
			return result;
		}
	});
	[
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((method) => {
		instrumentations[method] = createIterableMethod(method, readonly, shallow);
	});
	return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
	const instrumentations = createInstrumentations(isReadonly2, shallow);
	return (target, key, receiver) => {
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_isShallow") return shallow;
		else if (key === "__v_raw") return target;
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
	if (/* @__PURE__ */ isReadonly(target)) return target;
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
	return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject(target)) return target;
	if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
	if (target["__v_skip"] || !Object.isExtensible(target)) return target;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) return existingProxy;
	const targetType = targetTypeMap(toRawType(target));
	if (targetType === 0) return target;
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
	if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
	return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
	return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
	return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
	return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
	const raw = observed && observed["__v_raw"];
	return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
	if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
	return value;
}
var toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
var toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
	return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
	return createRef(value, false);
}
// @__NO_SIDE_EFFECTS__
function shallowRef(value) {
	return createRef(value, true);
}
function createRef(rawValue, shallow) {
	if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
	return new RefImpl(rawValue, shallow);
}
var RefImpl = class {
	constructor(value, isShallow2) {
		this.dep = new Dep();
		this["__v_isRef"] = true;
		this["__v_isShallow"] = false;
		this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
		this._value = isShallow2 ? value : toReactive(value);
		this["__v_isShallow"] = isShallow2;
	}
	get value() {
		this.dep.track();
		return this._value;
	}
	set value(newValue) {
		const oldValue = this._rawValue;
		const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
		newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
		if (hasChanged(newValue, oldValue)) {
			this._rawValue = newValue;
			this._value = useDirectValue ? newValue : toReactive(newValue);
			this.dep.trigger();
		}
	}
};
function unref(ref2) {
	return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
function toValue(source) {
	return isFunction(source) ? source() : unref(source);
}
var shallowUnwrapHandlers = {
	get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
	set: (target, key, value, receiver) => {
		const oldValue = target[key];
		if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
			oldValue.value = value;
			return true;
		} else return Reflect.set(target, key, value, receiver);
	}
};
function proxyRefs(objectWithRefs) {
	return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var ObjectRefImpl = class {
	constructor(_object, key, _defaultValue) {
		this._object = _object;
		this._defaultValue = _defaultValue;
		this["__v_isRef"] = true;
		this._value = void 0;
		this._key = isSymbol(key) ? key : String(key);
		this._raw = /* @__PURE__ */ toRaw(_object);
		let shallow = true;
		let obj = _object;
		if (!isArray$1(_object) || isSymbol(this._key) || !isIntegerKey(this._key)) do
			shallow = !/* @__PURE__ */ isProxy(obj) || /* @__PURE__ */ isShallow(obj);
		while (shallow && (obj = obj["__v_raw"]));
		this._shallow = shallow;
	}
	get value() {
		let val = this._object[this._key];
		if (this._shallow) val = unref(val);
		return this._value = val === void 0 ? this._defaultValue : val;
	}
	set value(newVal) {
		if (this._shallow && /* @__PURE__ */ isRef(this._raw[this._key])) {
			const nestedRef = this._object[this._key];
			if (/* @__PURE__ */ isRef(nestedRef)) {
				nestedRef.value = newVal;
				return;
			}
		}
		this._object[this._key] = newVal;
	}
	get dep() {
		return getDepFromReactive(this._raw, this._key);
	}
};
var GetterRefImpl = class {
	constructor(_getter) {
		this._getter = _getter;
		this["__v_isRef"] = true;
		this["__v_isReadonly"] = true;
		this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function toRef(source, key, defaultValue) {
	if (/* @__PURE__ */ isRef(source)) return source;
	else if (isFunction(source)) return new GetterRefImpl(source);
	else if (isObject(source) && arguments.length > 1) return propertyToRef(source, key, defaultValue);
	else return /* @__PURE__ */ ref(source);
}
function propertyToRef(source, key, defaultValue) {
	return new ObjectRefImpl(source, key, defaultValue);
}
var ComputedRefImpl = class {
	constructor(fn, setter, isSSR) {
		this.fn = fn;
		this.setter = setter;
		/**
		* @internal
		*/
		this._value = void 0;
		/**
		* @internal
		*/
		this.dep = new Dep(this);
		/**
		* @internal
		*/
		this.__v_isRef = true;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 16;
		/**
		* @internal
		*/
		this.globalVersion = globalVersion - 1;
		/**
		* @internal
		*/
		this.next = void 0;
		this.effect = this;
		this["__v_isReadonly"] = !setter;
		this.isSSR = isSSR;
	}
	/**
	* @internal
	*/
	notify() {
		this.flags |= 16;
		if (!(this.flags & 8) && activeSub !== this) {
			batch(this, true);
			return true;
		}
	}
	get value() {
		const link = this.dep.track();
		refreshComputed(this);
		if (link) link.version = this.dep.version;
		return this._value;
	}
	set value(newValue) {
		if (this.setter) this.setter(newValue);
	}
};
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
	let getter;
	let setter;
	if (isFunction(getterOrOptions)) getter = getterOrOptions;
	else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}
	return new ComputedRefImpl(getter, setter, isSSR);
}
var INITIAL_WATCHER_VALUE = {};
var cleanupMap = /* @__PURE__ */ new WeakMap();
var activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
	if (owner) {
		let cleanups = cleanupMap.get(owner);
		if (!cleanups) cleanupMap.set(owner, cleanups = []);
		cleanups.push(cleanupFn);
	}
}
function watch$1(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, once, scheduler, augmentJob, call } = options;
	const reactiveGetter = (source2) => {
		if (deep) return source2;
		if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
		return traverse(source2);
	};
	let effect;
	let getter;
	let cleanup;
	let boundCleanup;
	let forceTrigger = false;
	let isMultiSource = false;
	if (/* @__PURE__ */ isRef(source)) {
		getter = () => source.value;
		forceTrigger = /* @__PURE__ */ isShallow(source);
	} else if (/* @__PURE__ */ isReactive(source)) {
		getter = () => reactiveGetter(source);
		forceTrigger = true;
	} else if (isArray$1(source)) {
		isMultiSource = true;
		forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
		getter = () => source.map((s) => {
			if (/* @__PURE__ */ isRef(s)) return s.value;
			else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
			else if (isFunction(s)) return call ? call(s, 2) : s();
		});
	} else if (isFunction(source)) {
		if (cb) getter = call ? () => call(source, 2) : source;
		else getter = () => {
			if (cleanup) {
				pauseTracking();
				try {
					cleanup();
				} finally {
					resetTracking();
				}
			}
			const currentEffect = activeWatcher;
			activeWatcher = effect;
			try {
				return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
			} finally {
				activeWatcher = currentEffect;
			}
		};
	} else getter = NOOP;
	if (cb && deep) {
		const baseGetter = getter;
		const depth = deep === true ? Infinity : deep;
		getter = () => traverse(baseGetter(), depth);
	}
	const scope = getCurrentScope();
	const watchHandle = () => {
		effect.stop();
		if (scope && scope.active) remove(scope.effects, effect);
	};
	if (once && cb) {
		const _cb = cb;
		cb = (...args) => {
			try {
				return _cb(...args);
			} finally {
				watchHandle();
			}
		};
	}
	let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
	const job = (immediateFirstRun) => {
		if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
		if (cb) {
			const newValue = effect.run();
			if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
				const currentWatcher = activeWatcher;
				pauseTracking();
				try {
					if (cleanup) cleanup();
					activeWatcher = effect;
					const args = [
						newValue,
						oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
						boundCleanup
					];
					oldValue = newValue;
					call ? call(cb, 3, args) : cb(...args);
				} finally {
					activeWatcher = currentWatcher;
					resetTracking();
				}
			}
		} else effect.run();
	};
	if (augmentJob) augmentJob(job);
	effect = new ReactiveEffect(getter);
	effect.scheduler = scheduler ? () => scheduler(job, false) : job;
	boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
	cleanup = effect.onStop = () => {
		const cleanups = cleanupMap.get(effect);
		if (cleanups) {
			if (call) call(cleanups, 4);
			else for (const cleanup2 of cleanups) cleanup2();
			cleanupMap.delete(effect);
		}
	};
	if (cb) {
		if (immediate) job(true);
		else oldValue = effect.run();
	} else if (scheduler) scheduler(job.bind(null, true), true);
	else effect.run();
	watchHandle.pause = effect.pause.bind(effect);
	watchHandle.resume = effect.resume.bind(effect);
	watchHandle.stop = watchHandle;
	return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
	if (depth <= 0 || !isObject(value) || value["__v_skip"]) return value;
	seen = seen || /* @__PURE__ */ new Map();
	if ((seen.get(value) || 0) >= depth) return value;
	seen.set(value, depth);
	depth--;
	if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
	else if (isArray$1(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
	else if (isSet(value) || isMap(value)) value.forEach((v) => {
		traverse(v, depth, seen);
	});
	else if (isPlainObject$1(value)) {
		for (const key in value) traverse(value[key], depth, seen);
		for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
	}
	return value;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
/**
* @vue/runtime-core v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function callWithErrorHandling(fn, instance, type, args) {
	try {
		return args ? fn(...args) : fn();
	} catch (err) {
		handleError(err, instance, type);
	}
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
	if (isFunction(fn)) {
		const res = callWithErrorHandling(fn, instance, type, args);
		if (res && isPromise(res)) res.catch((err) => {
			handleError(err, instance, type, void 0, true);
		});
		return res;
	}
	if (isArray$1(fn)) {
		const values = [];
		for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
		return values;
	}
}
function handleError(err, instance, type, throwInDev = true, isAsyncError = false) {
	const contextVNode = instance ? instance.vnode : null;
	const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
	if (instance) {
		let cur = instance.parent;
		const exposedInstance = instance.proxy;
		const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
		while (cur) {
			const errorCapturedHooks = cur.ec;
			if (errorCapturedHooks && !cur.isUnmounted && (!isAsyncError || cur.scope.active)) {
				for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
			}
			cur = cur.parent;
		}
		if (errorHandler) {
			pauseTracking();
			callWithErrorHandling(errorHandler, null, 10, [
				err,
				exposedInstance,
				errorInfo
			]);
			resetTracking();
			return;
		}
	}
	logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
	if (throwInProd) throw err;
	else console.error(err);
}
var queue = [];
var flushIndex = -1;
var pendingPostFlushCbs = [];
var activePostFlushCbs = null;
var postFlushIndex = 0;
var resolvedPromise = /* @__PURE__ */ Promise.resolve();
var currentFlushPromise = null;
function nextTick(fn) {
	const p = currentFlushPromise || resolvedPromise;
	return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex$1(id) {
	let start = flushIndex + 1;
	let end = queue.length;
	while (start < end) {
		const middle = start + end >>> 1;
		const middleJob = queue[middle];
		const middleJobId = getId(middleJob);
		if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
		else end = middle;
	}
	return start;
}
function queueJob(job) {
	if (!(job.flags & 1)) {
		const jobId = getId(job);
		const lastJob = queue[queue.length - 1];
		if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
		else queue.splice(findInsertionIndex$1(jobId), 0, job);
		job.flags |= 1;
		queueFlush();
	}
}
function queueFlush() {
	if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
}
function queuePostFlushCb(cb) {
	if (!isArray$1(cb)) {
		if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
		else if (!(cb.flags & 1)) {
			pendingPostFlushCbs.push(cb);
			cb.flags |= 1;
		}
	} else for (let i = 0; i < cb.length; i++) pendingPostFlushCbs.push(cb[i]);
	queueFlush();
}
function flushPreFlushCbs(instance, minUid, seen, i = flushIndex + 1) {
	for (; i < queue.length; i++) {
		const cb = queue[i];
		if (cb && cb.flags & 2) {
			if (instance && cb.id !== instance.uid || minUid !== void 0 && !(cb.id >= minUid)) continue;
			queue.splice(i, 1);
			i = instance ? i - 1 : flushIndex;
			if (cb.flags & 4) cb.flags &= -2;
			cb();
			if (!(cb.flags & 4)) cb.flags &= -2;
		}
	}
}
function flushPostFlushCbs(seen, skip, minUid = 0) {
	if (pendingPostFlushCbs.length) {
		let cbs = pendingPostFlushCbs;
		let kept = 0;
		if (skip) {
			cbs = [];
			for (let i = 0; i < pendingPostFlushCbs.length; i++) {
				const cb = pendingPostFlushCbs[i];
				if (cb.i !== void 0 ? !cb.i || cb.i.uid < minUid : skip.has(cb)) pendingPostFlushCbs[kept++] = cb;
				else cbs.push(cb);
			}
		}
		const deduped = [...new Set(cbs)].sort((a, b) => getId(a) - getId(b));
		pendingPostFlushCbs.length = kept;
		if (activePostFlushCbs) {
			for (let i = 0; i < deduped.length; i++) activePostFlushCbs.push(deduped[i]);
			return;
		}
		activePostFlushCbs = deduped;
		for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
			const cb = activePostFlushCbs[postFlushIndex];
			if (cb.flags & 4) cb.flags &= -2;
			if (!(cb.flags & 8)) cb();
			cb.flags &= -2;
		}
		activePostFlushCbs = null;
		postFlushIndex = 0;
	}
}
var isFlushing = false;
function flushOnAppMount(fn, minUid) {
	if (isFlushing) {
		fn();
		return;
	}
	const queued = minUid === void 0 ? void 0 : new Set(pendingPostFlushCbs);
	fn();
	isFlushing = true;
	try {
		flushPreFlushCbs(void 0, minUid);
		flushPostFlushCbs(void 0, queued, minUid);
	} finally {
		isFlushing = false;
	}
}
var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
	try {
		for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job && !(job.flags & 8)) {
				if (job.flags & 4) job.flags &= -2;
				callWithErrorHandling(job, job.i, job.i ? 15 : 14);
				if (!(job.flags & 4)) job.flags &= -2;
			}
		}
	} finally {
		for (; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job) job.flags &= -2;
		}
		flushIndex = -1;
		queue.length = 0;
		flushPostFlushCbs(seen);
		currentFlushPromise = null;
		if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
	}
}
var currentRenderingInstance = null;
var currentScopeId = null;
function setCurrentRenderingInstance(instance) {
	const prev = currentRenderingInstance;
	currentRenderingInstance = instance;
	currentScopeId = instance && instance.type.__scopeId || null;
	return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
	if (!ctx) return fn;
	if (fn._n) return fn;
	const renderFnWithContext = (...args) => {
		if (renderFnWithContext._d) setBlockTracking(-1);
		const prevInstance = setCurrentRenderingInstance(ctx);
		const prevStackSize = blockStack.length;
		let res;
		try {
			res = fn(...args);
		} finally {
			for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
			setCurrentRenderingInstance(prevInstance);
			if (renderFnWithContext._d) setBlockTracking(1);
		}
		return res;
	};
	renderFnWithContext._n = true;
	renderFnWithContext._c = true;
	renderFnWithContext._d = true;
	return renderFnWithContext;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
	let hookVNode = vnode;
	if (name === "beforeMount") vnode._mount = vnode;
	else if (name === "beforeUpdate") {
		const mount = prevVNode && prevVNode._mount;
		if (mount) {
			mount._latest = vnode;
			vnode._mount = mount;
		}
	} else if (name === "mounted") {
		const latest = vnode._latest;
		vnode._mount = vnode._latest = void 0;
		if (latest) {
			hookVNode = latest;
			latest._mount = void 0;
		}
	}
	const bindings = hookVNode.dirs;
	const oldBindings = prevVNode && prevVNode.dirs;
	for (let i = 0; i < bindings.length; i++) {
		let binding = bindings[i];
		if (oldBindings) binding.oldValue = oldBindings[i].value;
		else if (name === "mounted" && binding.oldValue !== void 0) binding = extend({}, binding, { oldValue: void 0 });
		let hook = binding.dir[name];
		if (hook) {
			pauseTracking();
			callWithAsyncErrorHandling(hook, instance, 8, [
				vnode.el,
				binding,
				hookVNode,
				prevVNode
			]);
			resetTracking();
		}
	}
}
function provide(key, value) {
	if (currentInstance) {
		let provides = currentInstance.provides;
		const parentProvides = currentInstance.parent && currentInstance.parent.provides;
		if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
		provides[key] = value;
	}
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
	const instance = getCurrentInstance();
	if (instance || currentApp) {
		let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
		if (provides && key in provides) return provides[key];
		else if (arguments.length > 1) return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
	}
}
function hasInjectionContext() {
	return !!(getCurrentInstance() || currentApp);
}
var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
var useSSRContext = () => {
	{
		const ctx = inject(ssrContextKey);
		if (!ctx) {}
		return ctx;
	}
};
function watchEffect(effect, options) {
	return doWatch(effect, null, options);
}
function watch(source, cb, options) {
	return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, flush, once } = options;
	const baseWatchOptions = extend({}, options);
	const runsImmediately = cb && immediate || !cb && flush !== "post";
	let ssrCleanup;
	if (isInSSRComponentSetup) {
		if (flush === "sync") {
			const ctx = useSSRContext();
			ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
		} else if (!runsImmediately) {
			const watchStopHandle = () => {};
			watchStopHandle.stop = NOOP;
			watchStopHandle.resume = NOOP;
			watchStopHandle.pause = NOOP;
			return watchStopHandle;
		}
	}
	const instance = currentInstance;
	baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
	let isPre = false;
	if (flush === "post") baseWatchOptions.scheduler = (job) => {
		job.i = instance;
		queuePostRenderEffect(job, instance && instance.suspense);
	};
	else if (flush !== "sync") {
		isPre = true;
		baseWatchOptions.scheduler = (job, isFirstRun) => {
			if (isFirstRun) job();
			else queueJob(job);
		};
	}
	baseWatchOptions.augmentJob = (job) => {
		if (cb) job.flags |= 4;
		if (isPre) {
			job.flags |= 2;
			if (instance) {
				job.id = instance.uid;
				job.i = instance;
			}
		}
	};
	const watchHandle = watch$1(source, cb, baseWatchOptions);
	if (isInSSRComponentSetup) {
		if (ssrCleanup) ssrCleanup.push(watchHandle);
		else if (runsImmediately) watchHandle();
	}
	return watchHandle;
}
function instanceWatch(source, value, options) {
	const publicThis = this.proxy;
	const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
	let cb;
	if (isFunction(value)) cb = value;
	else {
		cb = value.handler;
		options = value;
	}
	const reset = setCurrentInstance(this);
	const res = doWatch(getter, cb.bind(publicThis), options);
	reset();
	return res;
}
function createPathGetter(ctx, path) {
	const segments = path.split(".");
	return () => {
		let cur = ctx;
		for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
		return cur;
	};
}
var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
var isTeleport = (type) => type.__isTeleport;
var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
var enterCbKey = /* @__PURE__ */ Symbol("_enterCb");
function useTransitionState() {
	const state = {
		isMounted: false,
		isLeaving: false,
		isUnmounting: false,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	onMounted(() => {
		state.isMounted = true;
	});
	onBeforeUnmount(() => {
		state.isUnmounting = true;
	});
	return state;
}
var TransitionHookValidator = [Function, Array];
var BaseTransitionPropsValidators = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: TransitionHookValidator,
	onEnter: TransitionHookValidator,
	onAfterEnter: TransitionHookValidator,
	onEnterCancelled: TransitionHookValidator,
	onBeforeLeave: TransitionHookValidator,
	onLeave: TransitionHookValidator,
	onAfterLeave: TransitionHookValidator,
	onLeaveCancelled: TransitionHookValidator,
	onBeforeAppear: TransitionHookValidator,
	onAppear: TransitionHookValidator,
	onAfterAppear: TransitionHookValidator,
	onAppearCancelled: TransitionHookValidator
};
var BaseTransitionImpl = {
	name: `BaseTransition`,
	props: BaseTransitionPropsValidators,
	setup(props, { slots }) {
		const instance = getCurrentInstance();
		const state = useTransitionState();
		return () => {
			const children = slots.default && getTransitionRawChildren(slots.default(), true);
			const child = children && children.length ? findNonCommentChild(children) : instance.subTree ? createCommentVNode() : void 0;
			if (!child) return;
			const rawProps = /* @__PURE__ */ toRaw(props);
			const { mode } = rawProps;
			if (state.isLeaving) return emptyPlaceholder(child);
			const innerChild = getInnerChild$1(child);
			if (!innerChild) return emptyPlaceholder(child);
			const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
			if (innerChild.type !== Comment) setTransitionHooks(innerChild, enterHooks);
			let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
			if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && getTransitionRoot(instance.subTree)) {
				let leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
				setTransitionHooks(oldInnerChild, leavingHooks);
				if (mode === "out-in" && innerChild.type !== Comment) {
					state.isLeaving = true;
					leavingHooks.afterLeave = () => {
						state.isLeaving = false;
						if (!(instance.job.flags & 8)) {
							if (instance.effect.flags & 2) {
								const job = () => {
									if (!(instance.job.flags & 8)) instance.update();
								};
								job.i = instance;
								queueJob(job);
							} else instance.update();
						}
						delete leavingHooks.afterLeave;
						oldInnerChild = void 0;
					};
					return emptyPlaceholder(child);
				} else if (mode === "in-out" && innerChild.type !== Comment) leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
					const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
					leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
					el[leaveCbKey] = () => {
						earlyRemove();
						el[leaveCbKey] = void 0;
						delete enterHooks.delayedLeave;
						oldInnerChild = void 0;
					};
					enterHooks.delayedLeave = () => {
						delayedLeave();
						delete enterHooks.delayedLeave;
						oldInnerChild = void 0;
					};
				};
				else oldInnerChild = void 0;
			} else if (oldInnerChild) oldInnerChild = void 0;
			return child;
		};
	}
};
function findNonCommentChild(children) {
	let child = children[0];
	if (children.length > 1) {
		for (const c of children) if (c.type !== Comment) {
			child = c;
			break;
		}
	}
	return child;
}
var BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
	const { leavingVNodes } = state;
	let leavingVNodesCache = leavingVNodes.get(vnode.type);
	if (!leavingVNodesCache) {
		leavingVNodesCache = /* @__PURE__ */ Object.create(null);
		leavingVNodes.set(vnode.type, leavingVNodesCache);
	}
	return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
	const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
	const key = String(vnode.key);
	const leavingVNodesCache = getLeavingNodesForType(state, vnode);
	const callHook = (hook, args) => {
		hook && callWithAsyncErrorHandling(hook, instance, 9, args);
	};
	const callAsyncHook = (hook, args) => {
		const done = args[1];
		callHook(hook, args);
		if (isArray$1(hook)) {
			if (hook.every((hook2) => hook2.length <= 1)) done();
		} else if (hook.length <= 1) done();
	};
	const hooks = {
		mode,
		persisted,
		beforeEnter(el) {
			let hook = onBeforeEnter;
			if (!state.isMounted) {
				if (appear) hook = onBeforeAppear || onBeforeEnter;
				else return;
			}
			if (el[leaveCbKey]) el[leaveCbKey](true);
			const leavingVNode = leavingVNodesCache[key];
			if (leavingVNode && isSameVNodeType(vnode, leavingVNode)) {
				let leavingCb = leavingVNode.el[leaveCbKey];
				if (!leavingCb) {
					const leavingRoot = getTransitionRoot(leavingVNode);
					leavingCb = leavingRoot && leavingRoot.el[leaveCbKey];
				}
				if (leavingCb) leavingCb();
			}
			callHook(hook, [el]);
		},
		enter(el) {
			if (leavingVNodesCache[key] === vnode) return;
			let hook = onEnter;
			let afterHook = onAfterEnter;
			let cancelHook = onEnterCancelled;
			if (!state.isMounted) {
				if (appear) {
					hook = onAppear || onEnter;
					afterHook = onAfterAppear || onAfterEnter;
					cancelHook = onAppearCancelled || onEnterCancelled;
				} else return;
			}
			let called = false;
			el[enterCbKey] = (cancelled) => {
				if (called) return;
				called = true;
				if (cancelled) callHook(cancelHook, [el]);
				else callHook(afterHook, [el]);
				if (hooks.delayedLeave) hooks.delayedLeave();
				el[enterCbKey] = void 0;
			};
			const done = el[enterCbKey].bind(null, false);
			if (hook) callAsyncHook(hook, [el, done]);
			else done();
		},
		leave(el, remove) {
			const key2 = String(vnode.key);
			if (el[enterCbKey]) el[enterCbKey](true);
			if (state.isUnmounting) return remove();
			callHook(onBeforeLeave, [el]);
			let called = false;
			el[leaveCbKey] = (cancelled) => {
				if (called) return;
				called = true;
				remove();
				if (cancelled) callHook(onLeaveCancelled, [el]);
				else callHook(onAfterLeave, [el]);
				el[leaveCbKey] = void 0;
				if (leavingVNodesCache[key2] === vnode) delete leavingVNodesCache[key2];
			};
			const done = el[leaveCbKey].bind(null, false);
			leavingVNodesCache[key2] = vnode;
			if (onLeave) callAsyncHook(onLeave, [el, done]);
			else done();
		},
		clone(vnode2) {
			const cloned = resolveTransitionHooks(vnode2, props, state, instance);
			cloned.afterLeave = () => {
				if (hooks.afterLeave) hooks.afterLeave();
			};
			cloned.delayLeave = (el, earlyRemove, delayedLeave) => {
				if (hooks.delayLeave) hooks.delayLeave(el, earlyRemove, delayedLeave);
				else delayedLeave();
			};
			cloned.delayedLeave = () => {
				if (hooks.delayedLeave) hooks.delayedLeave();
			};
			return cloned;
		}
	};
	return hooks;
}
function emptyPlaceholder(vnode) {
	if (isKeepAlive(vnode)) {
		vnode = cloneVNode(vnode);
		vnode.children = null;
		return vnode;
	}
}
function getInnerChild$1(vnode) {
	if (!isKeepAlive(vnode)) {
		if (isTeleport(vnode.type) && vnode.children) return findNonCommentChild(vnode.children);
		return vnode;
	}
	if (vnode.component) return vnode.component.subTree;
	const { shapeFlag, children } = vnode;
	if (children) {
		if (shapeFlag & 16) return children[0];
		if (shapeFlag & 32 && isFunction(children.default)) return children.default();
	}
}
function setTransitionHooks(vnode, hooks) {
	if (vnode.shapeFlag & 6 && vnode.component) {
		vnode.transition = hooks;
		const subTree = vnode.component.subTree;
		setTransitionHooks(isTeleport(subTree.type) ? getInnerChild$1(subTree) || subTree : subTree, hooks);
	} else if (vnode.shapeFlag & 128) {
		const suspense = vnode.suspense;
		if (suspense) {
			const branch = suspense.isHydrating ? suspense.pendingBranch : suspense.activeBranch;
			if (branch) setTransitionHooks(branch, hooks.clone(branch));
		} else {
			vnode.ssContent.transition = hooks.clone(vnode.ssContent);
			vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
		}
	} else {
		vnode.transition = hooks;
		if (vnode.type === Fragment && isArray$1(vnode.children)) {
			const child = filterSingleRoot(vnode.children, false);
			if (child) setTransitionHooks(child, hooks);
		}
	}
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
	let ret = [];
	let keyedFragmentCount = 0;
	for (let i = 0; i < children.length; i++) {
		let child = children[i];
		const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
		if (child.type === Fragment) {
			if (child.patchFlag & 128) keyedFragmentCount++;
			ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
		} else if (keepComment || child.type !== Comment) ret.push(key != null ? cloneVNode(child, { key }) : child);
	}
	if (keyedFragmentCount > 1) for (let i = 0; i < ret.length; i++) ret[i].patchFlag = -2;
	return ret;
}
function getTransitionRoot(vnode) {
	if (vnode.component) return getTransitionRoot(vnode.component.subTree);
	if (vnode.type === Fragment) {
		const child = isArray$1(vnode.children) && filterSingleRoot(vnode.children, false);
		return child ? getTransitionRoot(child) : void 0;
	}
	if (vnode.type !== Comment) return vnode;
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
	return isFunction(options) ? /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))() : options;
}
function markAsyncBoundary(instance) {
	instance.ids = [
		instance.ids[0] + instance.ids[2]++ + "-",
		0,
		0
	];
}
function isTemplateRefKey(refs, key) {
	let desc;
	return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
	if (isArray$1(rawRef)) {
		rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
		return;
	}
	if (isAsyncWrapper(vnode) && !isUnmount) {
		if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
		return;
	}
	const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
	const value = isUnmount ? null : refValue;
	const { i: owner, r: ref } = rawRef;
	const oldRef = oldRawRef && oldRawRef.r;
	const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
	const setupState = owner.setupState;
	const rawSetupState = /* @__PURE__ */ toRaw(setupState);
	const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
		if (isTemplateRefKey(refs, key)) return false;
		return hasOwn(rawSetupState, key);
	};
	const canSetRef = (ref2, key) => {
		if (key && isTemplateRefKey(refs, key)) return false;
		return true;
	};
	if (oldRef != null && oldRef !== ref) {
		invalidatePendingSetRef(oldRawRef);
		if (isString(oldRef)) {
			refs[oldRef] = null;
			if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
		} else if (/* @__PURE__ */ isRef(oldRef)) {
			const oldRawRefAtom = oldRawRef;
			if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
			if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
		}
	}
	if (isFunction(ref)) callWithErrorHandling(ref, owner, 12, [value, refs]);
	else {
		const _isString = isString(ref);
		const _isRef = /* @__PURE__ */ isRef(ref);
		if (_isString || _isRef) {
			const doSet = () => {
				if (rawRef.f) {
					const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
					if (isUnmount) isArray$1(existing) && remove(existing, refValue);
					else if (!isArray$1(existing)) {
						if (_isString) {
							refs[ref] = [refValue];
							if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
						} else {
							const newVal = [refValue];
							if (canSetRef(ref, rawRef.k)) ref.value = newVal;
							if (rawRef.k) refs[rawRef.k] = newVal;
						}
					} else if (!existing.includes(refValue)) existing.push(refValue);
				} else if (_isString) {
					refs[ref] = value;
					if (canSetSetupRef(ref)) setupState[ref] = value;
				} else if (_isRef) {
					if (canSetRef(ref, rawRef.k)) ref.value = value;
					if (rawRef.k) refs[rawRef.k] = value;
				}
			};
			if (value) {
				const job = () => {
					doSet();
					pendingSetRefMap.delete(rawRef);
				};
				job.id = -1;
				pendingSetRefMap.set(rawRef, job);
				queuePostRenderEffect(job, parentSuspense);
			} else {
				invalidatePendingSetRef(rawRef);
				doSet();
			}
		}
	}
}
function invalidatePendingSetRef(rawRef) {
	const pendingSetRef = pendingSetRefMap.get(rawRef);
	if (pendingSetRef) {
		pendingSetRef.flags |= 8;
		pendingSetRefMap.delete(rawRef);
	}
}
var hasLoggedMismatchError = false;
var logMismatchError = () => {
	if (hasLoggedMismatchError) return;
	console.error("Hydration completed but contains mismatches.");
	hasLoggedMismatchError = true;
};
var isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
var isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
var getContainerType = (container) => {
	if (container.nodeType !== 1) return void 0;
	if (isSVGContainer(container)) return "svg";
	if (isMathMLContainer(container)) return "mathml";
};
var isComment = (node) => node.nodeType === 8;
function createHydrationFunctions(rendererInternals) {
	const { mt: mountComponent, p: patch, o: { patchProp, createText, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
	const hydrate = (vnode, container) => {
		if (!container.hasChildNodes()) {
			patch(null, vnode, container);
			flushPostFlushCbs();
			container._vnode = vnode;
			return;
		}
		hydrateNode(container.firstChild, vnode, null, null, null);
		flushPostFlushCbs();
		container._vnode = vnode;
	};
	const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
		optimized = optimized || !!vnode.dynamicChildren;
		const isFragmentStart = isComment(node) && node.data === "[";
		const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
		const { type, ref, shapeFlag, patchFlag } = vnode;
		let domType = node.nodeType;
		vnode.el = node;
		if (patchFlag === -2) {
			optimized = false;
			vnode.dynamicChildren = null;
		}
		let nextNode = null;
		switch (type) {
			case Text:
				if (domType !== 3) {
					if (vnode.children === "") {
						insert(vnode.el = createText(""), parentNode(node), node);
						nextNode = node;
					} else nextNode = onMismatch();
				} else {
					if (node.data !== vnode.children) {
						logMismatchError();
						node.data = vnode.children;
					}
					nextNode = nextSibling(node);
				}
				break;
			case Comment:
				if (isTemplateNode(node)) {
					nextNode = nextSibling(node);
					replaceNode(vnode.el = node.content.firstChild, node, parentComponent);
				} else if (domType !== 8 || isFragmentStart) nextNode = onMismatch();
				else nextNode = nextSibling(node);
				break;
			case Static:
				if (isFragmentStart) {
					node = nextSibling(node);
					domType = node.nodeType;
				}
				if (domType === 1 || domType === 3) {
					nextNode = node;
					const needToAdoptContent = !vnode.children.length;
					for (let i = 0; i < vnode.staticCount; i++) {
						if (needToAdoptContent) vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
						if (i === vnode.staticCount - 1) vnode.anchor = nextNode;
						nextNode = nextSibling(nextNode);
					}
					return isFragmentStart ? nextSibling(nextNode) : nextNode;
				} else onMismatch();
				break;
			case Fragment:
				if (!isFragmentStart) nextNode = onMismatch();
				else nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) {
				if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) nextNode = onMismatch();
				else nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
			} else if (shapeFlag & 6) {
				vnode.slotScopeIds = slotScopeIds;
				const container = parentNode(node);
				if (isFragmentStart) nextNode = locateClosingAnchor(node);
				else if (isComment(node) && node.data === "teleport start") nextNode = locateClosingAnchor(node, node.data, "teleport end");
				else nextNode = nextSibling(node);
				mountComponent(vnode, container, null, parentComponent, parentSuspense, getContainerType(container), optimized);
				if ((isAsyncWrapper(vnode) || vnode.component.asyncDep) && !vnode.component.subTree) {
					let subTree;
					if (isFragmentStart) {
						subTree = createVNode(Static);
						subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
					} else subTree = node.nodeType === 3 ? createTextVNode("") : createVNode(node.nodeType === 8 ? Comment : "div");
					subTree.el = node;
					vnode.component.subTree = subTree;
				}
			} else if (shapeFlag & 64) {
				if (domType !== 8) nextNode = onMismatch();
				else nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
			} else if (shapeFlag & 128) nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, getContainerType(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
		}
		if (ref != null) setRef(ref, null, parentSuspense, vnode);
		return nextNode;
	};
	const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
		optimized = optimized || !!vnode.dynamicChildren;
		const { type, dynamicProps, props, patchFlag, shapeFlag, dirs, transition } = vnode;
		const forcePatch = type === "input" || type === "option";
		const hasDynamicProps = !!dynamicProps;
		if (forcePatch || hasDynamicProps || patchFlag !== -1) {
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
			let needCallTransitionHooks = false;
			if (isTemplateNode(el)) {
				needCallTransitionHooks = needTransition(null, transition) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
				const content = el.content.firstChild;
				if (needCallTransitionHooks) {
					const cls = content.getAttribute("class");
					if (cls) content.$cls = cls;
					transition.beforeEnter(content);
				}
				replaceNode(content, el, parentComponent);
				vnode.el = el = content;
			}
			if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
				let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
				if (next && !isMismatchAllowed(el, 1)) logMismatchError();
				while (next) {
					const cur = next;
					next = next.nextSibling;
					remove(cur);
				}
			} else if (shapeFlag & 8) {
				let clientText = vnode.children;
				if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) clientText = clientText.slice(1);
				const { textContent } = el;
				if (textContent !== clientText && textContent !== clientText.replace(/\r\n|\r/g, "\n")) {
					if (!isMismatchAllowed(el, 0)) logMismatchError();
					el.textContent = vnode.children;
				}
			}
			if (props) {
				if (forcePatch || hasDynamicProps || !optimized || patchFlag & 48) {
					const isCustomElement = el.tagName.includes("-");
					const namespace = el.namespaceURI.includes("svg") ? "svg" : el.namespaceURI.includes("MathML") ? "mathml" : void 0;
					for (const key in props) if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || key[0] === "." || isCustomElement && !isReservedProp(key) || dynamicProps && dynamicProps.includes(key)) {
						if (isUnchangedResourceProp(el, key, props[key])) continue;
						patchProp(el, key, null, props[key], namespace, parentComponent);
					}
				} else if (props.onClick) patchProp(el, "onClick", null, props.onClick, void 0, parentComponent);
				else if (patchFlag & 4 && /* @__PURE__ */ isReactive(props.style)) for (const key in props.style) props.style[key];
			}
			let vnodeHooks;
			if (vnodeHooks = props && props.onVnodeBeforeMount) invokeVNodeHook(vnodeHooks, parentComponent, vnode);
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
			if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) queueEffectWithSuspense(() => {
				vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			}, parentSuspense);
		}
		return el.nextSibling;
	};
	const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
		optimized = optimized || !!parentVNode.dynamicChildren;
		const children = parentVNode.children;
		const l = children.length;
		let hasCheckedMismatch = false;
		for (let i = 0; i < l; i++) {
			const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
			const isText = vnode.type === Text;
			if (node) {
				if (isText && !optimized) {
					if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
						insert(createText(node.data.slice(vnode.children.length)), container, nextSibling(node));
						node.data = vnode.children;
					}
				}
				node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
			} else if (isText && !vnode.children) insert(vnode.el = createText(""), container);
			else {
				if (!hasCheckedMismatch) {
					hasCheckedMismatch = true;
					if (!isMismatchAllowed(container, 1)) logMismatchError();
				}
				patch(null, vnode, container, null, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
			}
		}
		return node;
	};
	const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
		const { slotScopeIds: fragmentSlotScopeIds } = vnode;
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		const container = parentNode(node);
		const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
		if (next && isComment(next) && next.data === "]") return nextSibling(vnode.anchor = next);
		else {
			logMismatchError();
			insert(vnode.anchor = createComment(`]`), container, next);
			return next;
		}
	};
	const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
		if (!isNodeMismatchAllowed(node, vnode)) logMismatchError();
		vnode.el = null;
		if (isFragment) {
			const end = locateClosingAnchor(node);
			while (true) {
				const next2 = nextSibling(node);
				if (next2 && next2 !== end) remove(next2);
				else break;
			}
		}
		const next = nextSibling(node);
		const container = parentNode(node);
		remove(node);
		patch(null, vnode, container, next, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
		if (parentComponent && parentComponent.vnode.el === node) {
			parentComponent.vnode.el = vnode.el;
			updateHOCHostEl(parentComponent, vnode.el);
		}
		return next;
	};
	const locateClosingAnchor = (node, open = "[", close = "]") => {
		let match = 0;
		while (node) {
			node = nextSibling(node);
			if (node && isComment(node)) {
				if (node.data === open) match++;
				if (node.data === close) {
					if (match === 0) return nextSibling(node);
					else match--;
				}
			}
		}
		return node;
	};
	const replaceNode = (newNode, oldNode, parentComponent) => {
		const parentNode2 = oldNode.parentNode;
		if (parentNode2) parentNode2.replaceChild(newNode, oldNode);
		let parent = parentComponent;
		while (parent) {
			if (parent.vnode.el === oldNode) parent.vnode.el = parent.subTree.el = newNode;
			parent = parent.parent;
		}
	};
	const isTemplateNode = (node) => {
		return node.nodeType === 1 && node.tagName === "TEMPLATE";
	};
	return [hydrate, hydrateNode];
}
var resourceProps = /* @__PURE__ */ new Set([
	"src",
	"srcset",
	"href",
	"poster"
]);
function isUnchangedResourceProp(el, key, clientValue) {
	if (!resourceProps.has(key)) return false;
	return el.getAttribute(key) === (clientValue == null ? null : `${clientValue}`);
}
var allowMismatchAttr = "data-allow-mismatch";
var MismatchTypeString = {
	[0]: "text",
	[1]: "children",
	[2]: "class",
	[3]: "style",
	[4]: "attribute"
};
function isMismatchAllowed(el, allowedType) {
	if (allowedType === 0 || allowedType === 1) while (el && !el.hasAttribute(allowMismatchAttr)) el = el.parentElement;
	return isMismatchAllowedByAttr(el && el.getAttribute(allowMismatchAttr), allowedType);
}
function isMismatchAllowedByAttr(allowedAttr, allowedType) {
	if (allowedAttr == null) return false;
	else if (allowedAttr === "") return true;
	else {
		const list = allowedAttr.split(",");
		if (allowedType === 0 && list.includes("children")) return true;
		return list.includes(MismatchTypeString[allowedType]);
	}
}
function isNodeMismatchAllowed(node, vnode) {
	return isMismatchAllowed(node.parentElement, 1) || isMismatchAllowedByNode(node) || isMismatchAllowedByVNode(vnode);
}
function isMismatchAllowedByNode(node) {
	return node.nodeType === 1 && isMismatchAllowedByAttr(node.getAttribute(allowMismatchAttr), 1);
}
function isMismatchAllowedByVNode({ props }) {
	const allowedAttr = props && props[allowMismatchAttr];
	return typeof allowedAttr === "string" && isMismatchAllowedByAttr(allowedAttr, 1);
}
getGlobalThis().requestIdleCallback;
getGlobalThis().cancelIdleCallback;
function forEachElement(node, cb) {
	if (isComment(node) && node.data === "[") {
		let depth = 1;
		let next = node.nextSibling;
		while (next) {
			if (next.nodeType === 1) {
				if (cb(next) === false) break;
			} else if (isComment(next)) {
				if (next.data === "]") {
					if (--depth === 0) break;
				} else if (next.data === "[") depth++;
			}
			next = next.nextSibling;
		}
	} else cb(node);
}
var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
// @__NO_SIDE_EFFECTS__
function defineAsyncComponent(source) {
	if (isFunction(source)) source = { loader: source };
	const { loader, loadingComponent, errorComponent, delay = 200, hydrate: hydrateStrategy, timeout, suspensible = true, onError: userOnError } = source;
	let pendingRequest = null;
	let resolvedComp;
	let retries = 0;
	const retry = () => {
		retries++;
		pendingRequest = null;
		return load();
	};
	const load = () => {
		let thisRequest;
		return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
			err = err instanceof Error ? err : new Error(String(err));
			if (userOnError) return new Promise((resolve, reject) => {
				const userRetry = () => resolve(retry());
				const userFail = () => reject(err);
				userOnError(err, userRetry, userFail, retries + 1);
			});
			else throw err;
		}).then((comp) => {
			if (thisRequest !== pendingRequest && pendingRequest) return pendingRequest;
			if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) comp = comp.default;
			resolvedComp = comp;
			return comp;
		}));
	};
	return /* @__PURE__ */ defineComponent({
		name: "AsyncComponentWrapper",
		__asyncLoader: load,
		__asyncHydrate(el, instance, hydrate) {
			const wasConnected = el.isConnected;
			let patched = false;
			(instance.bu || (instance.bu = [])).push(() => patched = true);
			const performHydrate = () => {
				if (patched) return;
				if (!el.parentNode || wasConnected && !el.isConnected) return;
				hydrate();
			};
			const doHydrate = hydrateStrategy ? () => {
				const teardown = hydrateStrategy(performHydrate, (cb) => forEachElement(el, cb));
				if (teardown) (instance.bum || (instance.bum = [])).push(teardown);
			} : performHydrate;
			if (resolvedComp) doHydrate();
			else load().then(() => !instance.isUnmounted && doHydrate());
		},
		get __asyncResolved() {
			return resolvedComp;
		},
		setup() {
			const instance = currentInstance;
			markAsyncBoundary(instance);
			if (resolvedComp) return () => createInnerComp(resolvedComp, instance);
			const onError = (err) => {
				pendingRequest = null;
				handleError(err, instance, 13, !errorComponent, true);
			};
			if (suspensible && instance.suspense || isInSSRComponentSetup) return load().then((comp) => {
				return () => createInnerComp(comp, instance);
			}).catch((err) => {
				onError(err);
				return () => errorComponent ? createVNode(errorComponent, { error: err }) : null;
			});
			const loaded = /* @__PURE__ */ ref(false);
			const error = /* @__PURE__ */ ref();
			const delayed = /* @__PURE__ */ ref(!!delay);
			let timeoutTimer;
			let delayTimer;
			onScopeDispose(() => {
				if (timeoutTimer != null) clearTimeout(timeoutTimer);
				if (delayTimer != null) clearTimeout(delayTimer);
			});
			if (delay) delayTimer = setTimeout(() => {
				if (instance.isUnmounted) return;
				delayed.value = false;
			}, delay);
			if (timeout != null) timeoutTimer = setTimeout(() => {
				if (instance.isUnmounted) return;
				if (!loaded.value && !error.value) {
					const err = /* @__PURE__ */ new Error(`Async component timed out after ${timeout}ms.`);
					onError(err);
					error.value = err;
				}
			}, timeout);
			load().then(() => {
				if (instance.isUnmounted) return;
				loaded.value = true;
				if (instance.parent && isKeepAlive(instance.parent.vnode)) instance.parent.update();
			}).catch((err) => {
				if (instance.isUnmounted) {
					pendingRequest = null;
					return;
				}
				onError(err);
				error.value = err;
			});
			return () => {
				if (loaded.value && resolvedComp) return createInnerComp(resolvedComp, instance);
				else if (error.value && errorComponent) return createVNode(errorComponent, { error: error.value });
				else if (loadingComponent && !delayed.value) return createInnerComp(loadingComponent, instance);
			};
		}
	});
}
function createInnerComp(comp, parent) {
	const { ref: ref2, props, children, ce } = parent.vnode;
	const vnode = createVNode(comp, props, children);
	vnode.ref = ref2;
	vnode.ce = ce;
	delete parent.vnode.ce;
	return vnode;
}
var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
var KeepAlive = {
	name: `KeepAlive`,
	__isKeepAlive: true,
	props: {
		include: [
			String,
			RegExp,
			Array
		],
		exclude: [
			String,
			RegExp,
			Array
		],
		max: [String, Number]
	},
	setup(props, { slots }) {
		const instance = getCurrentInstance();
		const sharedContext = instance.ctx;
		if (!sharedContext.renderer) return () => {
			const children = slots.default && slots.default();
			return children && children.length === 1 ? children[0] : children;
		};
		const cache = /* @__PURE__ */ new Map();
		const keys = /* @__PURE__ */ new Set();
		let current = null;
		const parentSuspense = instance.suspense;
		const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
		const storageContainer = createElement("div");
		sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
			const instance2 = vnode.component;
			move(vnode, container, anchor, 0, parentSuspense);
			patch(instance2.vnode, vnode, container, anchor, instance2, parentSuspense, namespace, vnode.slotScopeIds, optimized);
			queuePostRenderEffect(() => {
				instance2.isDeactivated = false;
				if (instance2.a) invokeArrayFns(instance2.a);
				const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
				if (vnodeHook) invokeVNodeHook(vnodeHook, instance2.parent, vnode);
			}, parentSuspense);
		};
		sharedContext.deactivate = (vnode) => {
			const cached = cache.get(vnode.key == null ? vnode.type : vnode.key);
			if (!cached || cached.component !== vnode.component) return false;
			const instance2 = vnode.component;
			invalidateMount(instance2.m);
			invalidateMount(instance2.a);
			move(vnode, storageContainer, null, 1, parentSuspense);
			queuePostRenderEffect(() => {
				if (instance2.da) invokeArrayFns(instance2.da);
				const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
				if (vnodeHook) invokeVNodeHook(vnodeHook, instance2.parent, vnode);
				instance2.isDeactivated = true;
			}, parentSuspense);
			return true;
		};
		function unmount(vnode) {
			resetShapeFlag(vnode);
			_unmount(vnode, instance, parentSuspense, true);
		}
		function pruneCache(filter) {
			cache.forEach((vnode, key) => {
				const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : vnode.type);
				if (name && !filter(name)) pruneCacheEntry(key);
			});
		}
		function pruneCacheEntry(key) {
			const cached = cache.get(key);
			if (cached && (!current || !isSameVNodeType(cached, current))) unmount(cached);
			else if (current) {
				resetShapeFlag(current);
				if (cached) resetShapeFlag(cached);
			}
			cache.delete(key);
			keys.delete(key);
		}
		watch(() => [props.include, props.exclude], ([include, exclude]) => {
			include && pruneCache((name) => matches(include, name));
			exclude && pruneCache((name) => !matches(exclude, name));
		}, {
			flush: "post",
			deep: true
		});
		let pendingCacheKey = null;
		const cacheSubtree = () => {
			if (pendingCacheKey != null) {
				if (isSuspense(instance.subTree.type)) {
					const cacheInnerChild = () => {
						const vnode = getInnerChild(instance.subTree);
						if (vnode.component) cache.set(pendingCacheKey, vnode);
					};
					if (instance.subTree.suspense.pendingBranch) queuePostRenderEffect(cacheInnerChild, instance.subTree.suspense);
					else cacheInnerChild();
				} else cache.set(pendingCacheKey, getInnerChild(instance.subTree));
			}
		};
		onMounted(cacheSubtree);
		onUpdated(cacheSubtree);
		onBeforeUnmount(() => {
			cache.forEach((cached) => {
				const { subTree, suspense } = instance;
				const vnode = getInnerChild(subTree);
				if (cached.type === vnode.type && cached.key === vnode.key) {
					resetShapeFlag(vnode);
					const da = vnode.component.da;
					da && queuePostRenderEffect(da, suspense);
					return;
				}
				unmount(cached);
			});
		});
		return () => {
			pendingCacheKey = null;
			if (!slots.default) return current = null;
			const children = slots.default();
			const rawVNode = children[0];
			if (children.length > 1) {
				current = null;
				return children;
			} else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
				current = null;
				return rawVNode;
			}
			let vnode = getInnerChild(rawVNode);
			if (vnode.type === Comment) {
				current = null;
				return vnode;
			}
			const comp = vnode.type;
			const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
			const { include, exclude, max } = props;
			if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
				vnode.shapeFlag &= -257;
				current = vnode;
				return rawVNode;
			}
			const key = vnode.key == null ? comp : vnode.key;
			const cachedVNode = cache.get(key);
			if (vnode.el) {
				vnode = cloneVNode(vnode);
				if (rawVNode.shapeFlag & 128) rawVNode.ssContent = vnode;
			}
			pendingCacheKey = key;
			if (cachedVNode) {
				vnode.el = cachedVNode.el;
				vnode.component = cachedVNode.component;
				if (vnode.transition) setTransitionHooks(vnode, vnode.transition);
				vnode.shapeFlag |= 512;
				keys.delete(key);
				keys.add(key);
			} else {
				keys.add(key);
				if (max && keys.size > parseInt(max, 10)) pruneCacheEntry(keys.values().next().value);
			}
			vnode.shapeFlag |= 256;
			current = vnode;
			return isSuspense(rawVNode.type) ? rawVNode : vnode;
		};
	}
};
function matches(pattern, name) {
	if (isArray$1(pattern)) return pattern.some((p) => matches(p, name));
	else if (isString(pattern)) return pattern.split(",").includes(name);
	else if (isRegExp(pattern)) {
		pattern.lastIndex = 0;
		return pattern.test(name);
	}
	return false;
}
function onActivated(hook, target) {
	registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
	registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
	const wrappedHook = hook.__wdc || (hook.__wdc = () => {
		let current = target;
		while (current) {
			if (current.isDeactivated) return;
			current = current.parent;
		}
		return hook();
	});
	injectHook(type, wrappedHook, target);
	if (target) {
		let current = target.parent;
		while (current && current.parent) {
			if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
			current = current.parent;
		}
	}
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
	const injected = injectHook(type, hook, keepAliveRoot, true);
	const removal = injectHook("um", () => remove(keepAliveRoot[type], injected), target);
	removal.flags = 16;
}
function resetShapeFlag(vnode) {
	vnode.shapeFlag &= -257;
	vnode.shapeFlag &= -513;
}
function getInnerChild(vnode) {
	return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
	if (target) {
		const hooks = target[type] || (target[type] = []);
		const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
			pauseTracking();
			const reset = setCurrentInstance(target);
			const res = callWithAsyncErrorHandling(hook, target, type, args);
			reset();
			resetTracking();
			return res;
		});
		if (prepend) hooks.unshift(wrappedHook);
		else hooks.push(wrappedHook);
		return wrappedHook;
	}
}
var createHook = (lifecycle) => (hook, target = currentInstance) => {
	if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
};
var onBeforeMount = createHook("bm");
var onMounted = createHook("m");
var onBeforeUpdate = createHook("bu");
var onUpdated = createHook("u");
var onBeforeUnmount = createHook("bum");
var onUnmounted = createHook("um");
var onServerPrefetch$1 = createHook("sp");
var onRenderTriggered = createHook("rtg");
var onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
	injectHook("ec", hook, target);
}
var COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
	return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
	if (isString(component)) return resolveAsset(COMPONENTS, component, false) || component;
	else return component || NULL_DYNAMIC_COMPONENT;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
	const instance = currentRenderingInstance || currentInstance;
	if (instance) {
		const Component = instance.type;
		if (type === COMPONENTS) {
			const selfName = getComponentName(Component, false);
			if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) return Component;
		}
		const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
		if (!res && maybeSelfReference) return Component;
		return res;
	}
}
function resolve(registry, name) {
	return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderSlot(slots, name, props, fallback, noSlotted, branchKey) {
	if (props == null) props = {};
	if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
		const slotProps = branchKey != null && props.key == null ? extend({}, props, { key: branchKey }) : props;
		const hasProps = Object.keys(slotProps).length > 0;
		if (name !== "default") slotProps.name = name;
		return openBlock(), createBlock(Fragment, null, [createVNode("slot", slotProps, fallback && fallback())], hasProps ? -2 : 64);
	}
	let slot = slots[name];
	if (slot && slot._c) slot._d = false;
	const prevStackSize = blockStack.length;
	openBlock();
	let rendered;
	try {
		const validSlotContent = slot && ensureValidVNode(slot(props));
		const slotKey = props.key || branchKey || validSlotContent && validSlotContent.key;
		rendered = createBlock(Fragment, { key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + (!validSlotContent && fallback ? "_fb" : "") }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
	} catch (err) {
		for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
		throw err;
	} finally {
		if (slot && slot._c) slot._d = true;
	}
	if (!noSlotted && rendered.scopeId) rendered.slotScopeIds = [rendered.scopeId + "-s"];
	return rendered;
}
function ensureValidVNode(vnodes) {
	return vnodes.some((child) => {
		if (!isVNode(child)) return true;
		if (child.type === Comment) return false;
		if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
		return true;
	}) ? vnodes : null;
}
var getPublicInstance = (i) => {
	if (!i) return null;
	if (isStatefulComponent(i)) return getComponentPublicInstance(i);
	return getPublicInstance(i.parent);
};
var publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
	$: (i) => i,
	$el: (i) => i.vnode.el,
	$data: (i) => i.data,
	$props: (i) => i.props,
	$attrs: (i) => i.attrs,
	$slots: (i) => i.slots,
	$refs: (i) => i.refs,
	$parent: (i) => getPublicInstance(i.parent),
	$root: (i) => getPublicInstance(i.root),
	$host: (i) => i.ce,
	$emit: (i) => i.emit,
	$options: (i) => resolveMergedOptions(i),
	$forceUpdate: (i) => i.f || (i.f = () => {
		queueJob(i.update);
	}),
	$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
	$watch: (i) => instanceWatch.bind(i)
});
var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
var PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		if (key === "__v_skip") return true;
		const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
		if (key[0] !== "$") {
			const n = accessCache[key];
			if (n !== void 0) switch (n) {
				case 1: return setupState[key];
				case 2: return data[key];
				case 4: return ctx[key];
				case 3: return props[key];
			}
			else if (hasSetupBinding(setupState, key)) {
				accessCache[key] = 1;
				return setupState[key];
			} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
				accessCache[key] = 2;
				return data[key];
			} else if (hasOwn(props, key)) {
				accessCache[key] = 3;
				return props[key];
			} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (shouldCacheAccess) accessCache[key] = 0;
		}
		const publicGetter = publicPropertiesMap[key];
		let cssModule, globalProperties;
		if (publicGetter) {
			if (key === "$attrs") track(instance.attrs, "get", "");
			return publicGetter(instance);
		} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
		else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
			accessCache[key] = 4;
			return ctx[key];
		} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
	},
	set({ _: instance }, key, value) {
		const { data, setupState, ctx } = instance;
		if (hasSetupBinding(setupState, key)) {
			setupState[key] = value;
			return true;
		} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
			data[key] = value;
			return true;
		} else if (hasOwn(instance.props, key)) return false;
		if (key[0] === "$" && key.slice(1) in instance) return false;
		else ctx[key] = value;
		return true;
	},
	has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
		let cssModules;
		return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
	},
	defineProperty(target, key, descriptor) {
		if (descriptor.get != null) target._.accessCache[key] = 0;
		else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
		return Reflect.defineProperty(target, key, descriptor);
	}
};
function normalizePropsOrEmits(props) {
	return isArray$1(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
}
var shouldCacheAccess = true;
function applyOptions(instance) {
	const options = resolveMergedOptions(instance);
	const publicThis = instance.proxy;
	const ctx = instance.ctx;
	shouldCacheAccess = false;
	if (options.beforeCreate) callHook$2(options.beforeCreate, instance, "bc");
	const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
	const checkDuplicateProperties = null;
	if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
	if (methods) for (const key in methods) {
		const methodHandler = methods[key];
		if (isFunction(methodHandler)) ctx[key] = methodHandler.bind(publicThis);
	}
	if (dataOptions) {
		const data = dataOptions.call(publicThis, publicThis);
		if (!isObject(data)) {} else instance.data = /* @__PURE__ */ reactive(data);
	}
	shouldCacheAccess = true;
	if (computedOptions) for (const key in computedOptions) {
		const opt = computedOptions[key];
		const c = computed({
			get: isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP,
			set: !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP
		});
		Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => c.value,
			set: (v) => c.value = v
		});
	}
	if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
	if (provideOptions) {
		const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
		Reflect.ownKeys(provides).forEach((key) => {
			provide(key, provides[key]);
		});
	}
	if (created) callHook$2(created, instance, "c");
	function registerLifecycleHook(register, hook) {
		if (isArray$1(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
		else if (hook) register(hook.bind(publicThis));
	}
	registerLifecycleHook(onBeforeMount, beforeMount);
	registerLifecycleHook(onMounted, mounted);
	registerLifecycleHook(onBeforeUpdate, beforeUpdate);
	registerLifecycleHook(onUpdated, updated);
	registerLifecycleHook(onActivated, activated);
	registerLifecycleHook(onDeactivated, deactivated);
	registerLifecycleHook(onErrorCaptured, errorCaptured);
	registerLifecycleHook(onRenderTracked, renderTracked);
	registerLifecycleHook(onRenderTriggered, renderTriggered);
	registerLifecycleHook(onBeforeUnmount, beforeUnmount);
	registerLifecycleHook(onUnmounted, unmounted);
	registerLifecycleHook(onServerPrefetch$1, serverPrefetch);
	if (isArray$1(expose)) {
		if (expose.length) {
			const exposed = instance.exposed || (instance.exposed = {});
			expose.forEach((key) => {
				Object.defineProperty(exposed, key, {
					get: () => publicThis[key],
					set: (val) => publicThis[key] = val,
					enumerable: true
				});
			});
		} else if (!instance.exposed) instance.exposed = {};
	}
	if (render && instance.render === NOOP) instance.render = render;
	if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
	if (components) instance.components = components;
	if (directives) instance.directives = directives;
	if (serverPrefetch) markAsyncBoundary(instance);
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
	if (isArray$1(injectOptions)) injectOptions = normalizeInject(injectOptions);
	for (const key in injectOptions) {
		const opt = injectOptions[key];
		let injected;
		if (isObject(opt)) {
			if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
			else injected = inject(opt.from || key);
		} else injected = inject(opt);
		if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => injected.value,
			set: (v) => injected.value = v
		});
		else ctx[key] = injected;
	}
}
function callHook$2(hook, instance, type) {
	callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
	let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
	if (isString(raw)) {
		const handler = ctx[raw];
		if (isFunction(handler)) watch(getter, handler);
	} else if (isFunction(raw)) watch(getter, raw.bind(publicThis));
	else if (isObject(raw)) {
		if (isArray$1(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
		else {
			const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
			if (isFunction(handler)) watch(getter, handler, raw);
		}
	}
}
function resolveMergedOptions(instance) {
	const base = instance.type;
	const { mixins, extends: extendsOptions } = base;
	const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
	const cached = cache.get(base);
	let resolved;
	if (cached) resolved = cached;
	else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
	else {
		resolved = {};
		if (globalMixins.length) globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
		mergeOptions$1(resolved, base, optionMergeStrategies);
	}
	if (isObject(base)) cache.set(base, resolved);
	return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
	const { mixins, extends: extendsOptions } = from;
	if (extendsOptions) mergeOptions$1(to, extendsOptions, strats, true);
	if (mixins) mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
	for (const key in from) if (asMixin && key === "expose") {} else {
		const strat = internalOptionMergeStrats[key] || strats && strats[key];
		to[key] = strat ? strat(to[key], from[key]) : from[key];
	}
	return to;
}
var internalOptionMergeStrats = {
	data: mergeDataFn,
	props: mergeEmitsOrPropsOptions,
	emits: mergeEmitsOrPropsOptions,
	methods: mergeObjectOptions,
	computed: mergeObjectOptions,
	beforeCreate: mergeAsArray,
	created: mergeAsArray,
	beforeMount: mergeAsArray,
	mounted: mergeAsArray,
	beforeUpdate: mergeAsArray,
	updated: mergeAsArray,
	beforeDestroy: mergeAsArray,
	beforeUnmount: mergeAsArray,
	destroyed: mergeAsArray,
	unmounted: mergeAsArray,
	activated: mergeAsArray,
	deactivated: mergeAsArray,
	errorCaptured: mergeAsArray,
	serverPrefetch: mergeAsArray,
	components: mergeObjectOptions,
	directives: mergeObjectOptions,
	watch: mergeWatchOptions,
	provide: mergeDataFn,
	inject: mergeInject
};
function mergeDataFn(to, from) {
	if (!from) return to;
	if (!to) return from;
	return function mergedDataFn() {
		return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
	};
}
function mergeInject(to, from) {
	return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
	if (isArray$1(raw)) {
		const res = {};
		for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
		return res;
	}
	return raw;
}
function mergeAsArray(to, from) {
	return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
	return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
	if (to) {
		if (isArray$1(to) && isArray$1(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
		return extend(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
	} else return from;
}
function mergeWatchOptions(to, from) {
	if (!to) return from;
	if (!from) return to;
	const merged = extend(/* @__PURE__ */ Object.create(null), to);
	for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
	return merged;
}
function createAppContext() {
	return {
		app: null,
		config: {
			isNativeTag: NO,
			performance: false,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var uid$1 = 0;
function createAppAPI(render, hydrate) {
	return function createApp(rootComponent, rootProps = null) {
		if (!isFunction(rootComponent)) rootComponent = extend({}, rootComponent);
		if (rootProps != null && !isObject(rootProps)) rootProps = null;
		const context = createAppContext();
		const installedPlugins = /* @__PURE__ */ new WeakSet();
		const pluginCleanupFns = [];
		let isMounted = false;
		const app = context.app = {
			_uid: uid$1++,
			_component: rootComponent,
			_props: rootProps,
			_container: null,
			_context: context,
			_instance: null,
			version,
			get config() {
				return context.config;
			},
			set config(v) {},
			use(plugin, ...options) {
				if (installedPlugins.has(plugin)) {} else if (plugin && isFunction(plugin.install)) {
					installedPlugins.add(plugin);
					plugin.install(app, ...options);
				} else if (isFunction(plugin)) {
					installedPlugins.add(plugin);
					plugin(app, ...options);
				}
				return app;
			},
			mixin(mixin) {
				if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
				return app;
			},
			component(name, component) {
				if (!component) return context.components[name];
				context.components[name] = component;
				return app;
			},
			directive(name, directive) {
				if (!directive) return context.directives[name];
				context.directives[name] = directive;
				return app;
			},
			mount(rootContainer, isHydrate, namespace) {
				if (!isMounted) {
					const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
					vnode.appContext = context;
					if (namespace === true) namespace = "svg";
					else if (namespace === false) namespace = void 0;
					if (isHydrate && hydrate) hydrate(vnode, rootContainer);
					else render(vnode, rootContainer, namespace);
					isMounted = true;
					app._container = rootContainer;
					rootContainer.__vue_app__ = app;
					return getComponentPublicInstance(vnode.component);
				}
			},
			onUnmount(cleanupFn) {
				pluginCleanupFns.push(cleanupFn);
			},
			unmount() {
				if (isMounted) {
					callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
					render(null, app._container);
					delete app._container.__vue_app__;
				}
			},
			provide(key, value) {
				context.provides[key] = value;
				return app;
			},
			runWithContext(fn) {
				const lastApp = currentApp;
				currentApp = app;
				try {
					return fn();
				} finally {
					currentApp = lastApp;
				}
			}
		};
		return app;
	};
}
var currentApp = null;
var getModelModifiers = (props, modelName) => {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
	if (instance.isUnmounted) return;
	const props = instance.vnode.props || EMPTY_OBJ;
	let args = rawArgs;
	const isModelListener = event.startsWith("update:");
	const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
	if (modifiers) {
		if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
		if (modifiers.number) args = args.map(looseToNumber);
	}
	let handlerName;
	let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
	if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate(event))];
	if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
	const onceHandler = props[handlerName + `Once`];
	if (onceHandler) {
		if (!instance.emitted) instance.emitted = {};
		else if (instance.emitted[handlerName]) return;
		instance.emitted[handlerName] = true;
		callWithAsyncErrorHandling(onceHandler, instance, 6, args);
	}
}
var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
	const cached = cache.get(comp);
	if (cached !== void 0) return cached;
	const raw = comp.emits;
	let normalized = {};
	let hasExtends = false;
	if (!isFunction(comp)) {
		const extendEmits = (raw2) => {
			const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
			if (normalizedFromExtend) {
				hasExtends = true;
				extend(normalized, normalizedFromExtend);
			}
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
		if (comp.extends) extendEmits(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendEmits);
	}
	if (!raw && !hasExtends) {
		if (isObject(comp)) cache.set(comp, null);
		return null;
	}
	if (isArray$1(raw)) raw.forEach((key) => normalized[key] = null);
	else extend(normalized, raw);
	if (isObject(comp)) cache.set(comp, normalized);
	return normalized;
}
function isEmitListener(options, key) {
	if (!options || !isOn(key)) return false;
	key = key.slice(2);
	key = key === "Once" ? key : key.replace(/Once$/, "");
	return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function renderComponentRoot(instance) {
	const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
	const prev = setCurrentRenderingInstance(instance);
	let result;
	let fallthroughAttrs;
	try {
		if (vnode.shapeFlag & 4) {
			const proxyToUse = withProxy || proxy;
			const thisProxy = proxyToUse;
			result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
			fallthroughAttrs = attrs;
		} else {
			const render2 = Component;
			result = normalizeVNode(render2.length > 1 ? render2(props, {
				attrs,
				slots,
				emit
			}) : render2(props, null));
			fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
		}
	} catch (err) {
		blockStack.length = 0;
		handleError(err, instance, 1);
		result = createVNode(Comment);
	}
	let root = result;
	if (fallthroughAttrs && inheritAttrs !== false) {
		const keys = Object.keys(fallthroughAttrs);
		const { shapeFlag } = root;
		if (keys.length) {
			if (shapeFlag & 7) {
				if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
				root = cloneVNode(root, fallthroughAttrs, false, true);
			}
		}
	}
	if (vnode.dirs) {
		root = cloneVNode(root, null, false, true);
		root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
	}
	if (vnode.transition) setTransitionHooks(isTeleport(root.type) ? getInnerChild$1(root) || root : root, vnode.transition);
	result = root;
	setCurrentRenderingInstance(prev);
	return result;
}
function filterSingleRoot(children, recurse = true) {
	let singleRoot;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (isVNode(child)) {
			if (child.type !== Comment || child.children === "v-if") {
				if (singleRoot) return;
				else singleRoot = child;
			}
		} else return;
	}
	return singleRoot;
}
var getFunctionalFallthrough = (attrs) => {
	let res;
	for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
	return res;
};
var filterModelListeners = (attrs, props) => {
	const res = {};
	for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
	return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
	const { props: prevProps, children: prevChildren, component } = prevVNode;
	const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
	const emits = component.emitsOptions;
	if (nextVNode.dirs || nextVNode.transition) return true;
	if (optimized && patchFlag >= 0) {
		if (patchFlag & 1024) return true;
		if (patchFlag & 16) {
			if (!prevProps) return !!nextProps;
			return hasPropsChanged(prevProps, nextProps, emits);
		} else if (patchFlag & 8) {
			const dynamicProps = nextVNode.dynamicProps;
			for (let i = 0; i < dynamicProps.length; i++) {
				const key = dynamicProps[i];
				if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
			}
		}
	} else {
		if (prevChildren || nextChildren) {
			if (!nextChildren || !nextChildren.$stable) return true;
		}
		if (prevProps === nextProps) return false;
		if (!prevProps) return !!nextProps;
		if (!nextProps) return true;
		return hasPropsChanged(prevProps, nextProps, emits);
	}
	return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
	const nextKeys = Object.keys(nextProps);
	if (nextKeys.length !== Object.keys(prevProps).length) return true;
	for (let i = 0; i < nextKeys.length; i++) {
		const key = nextKeys[i];
		if (!hasOwn(prevProps, key) || hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
	}
	return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
	const nextProp = nextProps[key];
	const prevProp = prevProps[key];
	if (key === "style" && isObject(nextProp) && isObject(prevProp)) return !looseEqual(nextProp, prevProp);
	return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
	while (parent) {
		const root = parent.subTree;
		if (root.suspense && root.suspense.activeBranch === vnode) {
			root.suspense.vnode.el = root.el = el;
			vnode = root;
		}
		if (root === vnode) {
			(vnode = parent.vnode).el = el;
			parent = parent.parent;
		} else break;
	}
	if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
}
var internalObjectProto = {};
var createInternalObject = () => Object.create(internalObjectProto);
var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
	const props = {};
	const attrs = createInternalObject();
	instance.propsDefaults = /* @__PURE__ */ Object.create(null);
	setFullProps(instance, rawProps, props, attrs);
	for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
	if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
	else if (!instance.type.props) instance.props = attrs;
	else instance.props = props;
	instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
	const { props, attrs, vnode: { patchFlag } } = instance;
	const rawCurrentProps = /* @__PURE__ */ toRaw(props);
	const [options] = instance.propsOptions;
	let hasAttrsChanged = false;
	if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
		if (patchFlag & 8) {
			const propsToUpdate = instance.vnode.dynamicProps;
			for (let i = 0; i < propsToUpdate.length; i++) {
				let key = propsToUpdate[i];
				if (isEmitListener(instance.emitsOptions, key)) continue;
				const value = rawProps[key];
				if (options) {
					if (hasOwn(attrs, key)) {
						if (value !== attrs[key]) {
							attrs[key] = value;
							hasAttrsChanged = true;
						}
					} else {
						const camelizedKey = camelize(key);
						props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
					}
				} else if (value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
	} else {
		if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
		let kebabKey;
		for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
			if (options) {
				if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
			} else delete props[key];
		}
		if (attrs !== rawCurrentProps) {
			for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
				delete attrs[key];
				hasAttrsChanged = true;
			}
		}
	}
	if (hasAttrsChanged) trigger(instance.attrs, "set", "");
}
function setFullProps(instance, rawProps, props, attrs) {
	const [options, needCastKeys] = instance.propsOptions;
	let hasAttrsChanged = false;
	let rawCastValues;
	if (rawProps) for (let key in rawProps) {
		if (isReservedProp(key)) continue;
		const value = rawProps[key];
		let camelKey;
		if (options && hasOwn(options, camelKey = camelize(key))) {
			if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
			else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
		} else if (!isEmitListener(instance.emitsOptions, key)) {
			if (!(key in attrs) || value !== attrs[key]) {
				attrs[key] = value;
				hasAttrsChanged = true;
			}
		}
	}
	if (needCastKeys) {
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const castValues = rawCastValues || EMPTY_OBJ;
		for (let i = 0; i < needCastKeys.length; i++) {
			const key = needCastKeys[i];
			props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
		}
	}
	return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
	const opt = options[key];
	if (opt != null) {
		const hasDefault = hasOwn(opt, "default");
		if (hasDefault && value === void 0) {
			const defaultValue = opt.default;
			if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
				const { propsDefaults } = instance;
				if (key in propsDefaults) value = propsDefaults[key];
				else {
					const reset = setCurrentInstance(instance);
					value = propsDefaults[key] = defaultValue.call(null, props);
					reset();
				}
			} else value = defaultValue;
			if (instance.ce) instance.ce._setProp(key, value);
		}
		if (opt[0]) {
			if (isAbsent && !hasDefault) value = false;
			else if (opt[1] && (value === "" || value === hyphenate(key))) value = true;
		}
	}
	return value;
}
var mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinPropsCache : appContext.propsCache;
	const cached = cache.get(comp);
	if (cached) return cached;
	const raw = comp.props;
	const normalized = {};
	const needCastKeys = [];
	let hasExtends = false;
	if (!isFunction(comp)) {
		const extendProps = (raw2) => {
			hasExtends = true;
			const [props, keys] = normalizePropsOptions(raw2, appContext, true);
			extend(normalized, props);
			if (keys) needCastKeys.push(...keys);
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
		if (comp.extends) extendProps(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendProps);
	}
	if (!raw && !hasExtends) {
		if (isObject(comp)) cache.set(comp, EMPTY_ARR);
		return EMPTY_ARR;
	}
	if (isArray$1(raw)) for (let i = 0; i < raw.length; i++) {
		const normalizedKey = camelize(raw[i]);
		if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
	}
	else if (raw) for (const key in raw) {
		const normalizedKey = camelize(key);
		if (validatePropName(normalizedKey)) {
			const opt = raw[key];
			const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
			const propType = prop.type;
			let shouldCast = false;
			let shouldCastTrue = true;
			if (isArray$1(propType)) for (let index = 0; index < propType.length; ++index) {
				const type = propType[index];
				const typeName = isFunction(type) && type.name;
				if (typeName === "Boolean") {
					shouldCast = true;
					break;
				} else if (typeName === "String") shouldCastTrue = false;
			}
			else shouldCast = isFunction(propType) && propType.name === "Boolean";
			prop[0] = shouldCast;
			prop[1] = shouldCastTrue;
			if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
		}
	}
	const res = [normalized, needCastKeys];
	if (isObject(comp)) cache.set(comp, res);
	return res;
}
function validatePropName(key) {
	if (key[0] !== "$" && !isReservedProp(key)) return true;
	return false;
}
var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
var normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
var normalizeSlot$2 = (key, rawSlot, ctx) => {
	if (rawSlot._n) return rawSlot;
	const normalized = withCtx((...args) => {
		return normalizeSlotValue(rawSlot(...args));
	}, ctx);
	normalized._c = false;
	return normalized;
};
var normalizeObjectSlots = (rawSlots, slots, instance) => {
	const ctx = rawSlots._ctx;
	for (const key in rawSlots) {
		if (isInternalKey(key)) continue;
		const value = rawSlots[key];
		if (isFunction(value)) slots[key] = normalizeSlot$2(key, value, ctx);
		else if (value != null) {
			const normalized = normalizeSlotValue(value);
			slots[key] = () => normalized;
		}
	}
};
var normalizeVNodeSlots = (instance, children) => {
	const normalized = normalizeSlotValue(children);
	instance.slots.default = () => normalized;
};
var assignSlots = (slots, children, optimized) => {
	for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
};
var initSlots = (instance, children, optimized) => {
	const slots = instance.slots = createInternalObject();
	if (instance.vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			assignSlots(slots, children, optimized);
			if (optimized) def(slots, "_", type, true);
		} else normalizeObjectSlots(children, slots);
	} else if (children) normalizeVNodeSlots(instance, children);
};
var updateSlots = (instance, children, optimized) => {
	const { vnode, slots } = instance;
	let needDeletionCheck = true;
	let deletionComparisonTarget = EMPTY_OBJ;
	if (vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			if (optimized && type === 1) needDeletionCheck = false;
			else assignSlots(slots, children, optimized);
		} else {
			needDeletionCheck = !children.$stable;
			normalizeObjectSlots(children, slots);
		}
		deletionComparisonTarget = children;
	} else if (children) {
		normalizeVNodeSlots(instance, children);
		deletionComparisonTarget = { default: 1 };
	}
	if (needDeletionCheck) {
		for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
	}
};
var queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
	return baseCreateRenderer(options);
}
function createHydrationRenderer(options) {
	return baseCreateRenderer(options, createHydrationFunctions);
}
function baseCreateRenderer(options, createHydrationFns) {
	const target = getGlobalThis();
	target.__VUE__ = true;
	const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
	const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
		if (n1 === n2) return;
		if (n1 && !isSameVNodeType(n1, n2)) {
			anchor = getNextHostNode(n1);
			unmount(n1, parentComponent, parentSuspense, true);
			n1 = null;
		}
		if (n2.patchFlag === -2) {
			optimized = false;
			n2.dynamicChildren = null;
		}
		if (n2.dynamicChildren && n1 && n1.dynamicChildren && n1.dynamicChildren.hasOnce) {
			if (n2.dynamicChildren === EMPTY_ARR) n2.dynamicChildren = [];
			n2.dynamicChildren.hasOnce = true;
		}
		const { type, ref, shapeFlag } = n2;
		switch (type) {
			case Text:
				processText(n1, n2, container, anchor);
				break;
			case Comment:
				processCommentNode(n1, n2, container, anchor);
				break;
			case Static:
				if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
				break;
			case Fragment:
				processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
		}
		if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
		else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
	};
	const processText = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
		else {
			const el = n2.el = n1.el;
			if (n2.children !== n1.children) hostSetText(el, n2.children);
		}
	};
	const processCommentNode = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
		else n2.el = n1.el;
	};
	const mountStaticNode = (n2, container, anchor, namespace) => {
		[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
	};
	const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostInsert(el, container, nextSibling);
			el = next;
		}
		hostInsert(anchor, container, nextSibling);
	};
	const removeStaticNode = ({ el, anchor }) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostRemove(el);
			el = next;
		}
		hostRemove(anchor);
	};
	const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		if (n2.type === "svg") namespace = "svg";
		else if (n2.type === "math") namespace = "mathml";
		if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else {
			const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
			try {
				if (customElement) customElement._beginPatch();
				patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} finally {
				if (customElement) customElement._endPatch();
			}
		}
	};
	const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let el;
		let vnodeHook;
		const { props, shapeFlag, transition, dirs } = vnode;
		el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
		if (shapeFlag & 8) hostSetElementText(el, vnode.children);
		else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
		setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
		if (props) {
			for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
			if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
			if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		}
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
		const needCallTransitionHooks = needTransition(parentSuspense, transition);
		if (needCallTransitionHooks) transition.beforeEnter(el);
		else if (transition && !transition.persisted) el[deferredEnterKey] = true;
		hostInsert(el, container, anchor);
		if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) queuePostRenderEffect(() => {
			try {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			} finally {}
		}, parentSuspense);
	};
	const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
		if (scopeId) hostSetScopeId(el, scopeId);
		if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
		if (parentComponent) {
			let subTree = parentComponent.subTree;
			if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
				const parentVNode = parentComponent.vnode;
				setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
			}
		}
	};
	const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
		for (let i = start; i < children.length; i++) {
			const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
			patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const el = n2.el = n1.el;
		let { patchFlag, dynamicChildren, dirs } = n2;
		patchFlag |= n1.patchFlag & 16;
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		let vnodeHook;
		parentComponent && toggleRecurse(parentComponent, false);
		if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
		if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
		parentComponent && toggleRecurse(parentComponent, true);
		if (dynamicChildren && (!n1.dynamicChildren || n1.dynamicChildren.length !== dynamicChildren.length)) {
			patchFlag = 0;
			optimized = false;
			dynamicChildren = null;
		}
		if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
		if (dynamicChildren) patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
		else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
		if (patchFlag > 0) {
			if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
			else {
				if (patchFlag & 2) {
					if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
				}
				if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
				if (patchFlag & 8) {
					const propsToUpdate = n2.dynamicProps;
					for (let i = 0; i < propsToUpdate.length; i++) {
						const key = propsToUpdate[i];
						const prev = oldProps[key];
						const next = newProps[key];
						if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
					}
				}
			}
			if (patchFlag & 1) {
				if (n1.children !== n2.children) hostSetElementText(el, n2.children);
			}
		} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
		if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
		}, parentSuspense);
	};
	const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
		for (let i = 0; i < newChildren.length; i++) {
			const oldVNode = oldChildren[i];
			const newVNode = newChildren[i];
			const oldEl = oldVNode.el || resolveAsyncComponentPlaceholder(oldVNode);
			const container = oldEl && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldEl) : fallbackContainer;
			patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
		}
	};
	const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
		if (oldProps !== newProps) {
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
			}
			for (const key in newProps) {
				if (isReservedProp(key)) continue;
				const next = newProps[key];
				const prev = oldProps[key];
				if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
			}
			if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
		}
	};
	const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
		const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
		let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		if (n1 == null) {
			hostInsert(fragmentStartAnchor, container, anchor);
			hostInsert(fragmentEndAnchor, container, anchor);
			mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
			if (n2.key != null || parentComponent && n2 === parentComponent.subTree) traverseStaticChildren(n1, n2, true);
		} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
	};
	const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		n2.slotScopeIds = slotScopeIds;
		if (n1 == null) {
			if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
			else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
		} else updateComponent(n1, n2, optimized);
	};
	const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
		const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
		if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
		setupComponent(instance, false, optimized);
		if (instance.asyncDep) {
			parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized, namespace);
			if (!initialVNode.el) {
				const placeholder = instance.subTree = createVNode(Comment);
				processCommentNode(null, placeholder, container, anchor);
				initialVNode.placeholder = placeholder.el;
			}
		} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
	};
	const updateComponent = (n1, n2, optimized) => {
		const instance = n2.component = n1.component;
		if (shouldUpdateComponent(n1, n2, optimized)) {
			if (instance.asyncDep && !instance.asyncResolved) {
				n2.el = n1.el;
				n2.placeholder = n1.placeholder;
				updateComponentPreRender(instance, n2, optimized);
				return;
			} else {
				instance.next = n2;
				instance.update();
			}
		} else {
			n2.el = n1.el;
			n2.placeholder = n1.placeholder;
			instance.vnode = n2;
		}
	};
	const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
		const componentUpdateFn = () => {
			if (!instance.isMounted) {
				let vnodeHook;
				const { el, props } = initialVNode;
				const { bm, m, parent, root, type } = instance;
				const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
				toggleRecurse(instance, false);
				if (bm) invokeArrayFns(bm);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
				toggleRecurse(instance, true);
				if (el && hydrateNode) {
					const hydrateSubTree = () => {
						instance.subTree = renderComponentRoot(instance);
						hydrateNode(el, instance.subTree, instance, parentSuspense, null);
					};
					if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
					else hydrateSubTree();
				} else {
					if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
					const subTree = instance.subTree = renderComponentRoot(instance);
					patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
					initialVNode.el = subTree.el;
				}
				if (m) queuePostRenderEffect(m, parentSuspense);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
					const scopedInitialVNode = initialVNode;
					queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
				}
				if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
				instance.isMounted = true;
				initialVNode = container = anchor = null;
			} else {
				let { next, bu, u, parent, vnode } = instance;
				{
					const unresolvedAsyncRoot = locateUnresolvedAsyncRoot(instance);
					if (unresolvedAsyncRoot) {
						if (next) {
							next.el = vnode.el;
							updateComponentPreRender(instance, next, optimized);
						}
						unresolvedAsyncRoot.asyncDep.then(() => {
							const retry = () => {
								if (instance.job.flags & 8) return;
								if (parentSuspense && parentSuspense.pendingBranch) queuePostRenderEffect(retry, parentSuspense);
								else update();
							};
							retry.flags = 48;
							queuePostRenderEffect(retry, parentSuspense);
						});
						return;
					}
				}
				let originNext = next;
				let vnodeHook;
				toggleRecurse(instance, false);
				if (next) {
					next.el = vnode.el;
					updateComponentPreRender(instance, next, optimized);
				} else next = vnode;
				if (bu) invokeArrayFns(bu);
				if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
				toggleRecurse(instance, true);
				const nextTree = renderComponentRoot(instance);
				const prevTree = instance.subTree;
				instance.subTree = nextTree;
				patch(prevTree, nextTree, hostParentNode(prevTree.el || resolveAsyncComponentPlaceholder(prevTree)), getNextHostNode(prevTree), instance, parentSuspense, namespace);
				next.el = nextTree.el;
				if (originNext === null) updateHOCHostEl(instance, nextTree.el);
				if (u) queuePostRenderEffect(u, parentSuspense);
				if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
			}
		};
		instance.scope.on();
		const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
		instance.scope.off();
		const update = instance.update = effect.run.bind(effect);
		const job = instance.job = effect.runIfDirty.bind(effect);
		job.i = instance;
		job.id = instance.uid;
		effect.scheduler = () => queueJob(job);
		toggleRecurse(instance, true);
		update();
	};
	const updateComponentPreRender = (instance, nextVNode, optimized) => {
		nextVNode.component = instance;
		const prevProps = instance.vnode.props;
		instance.vnode = nextVNode;
		instance.next = null;
		updateProps(instance, nextVNode.props, prevProps, optimized);
		updateSlots(instance, nextVNode.children, optimized);
		pauseTracking();
		flushPreFlushCbs(instance);
		resetTracking();
	};
	const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
		const c1 = n1 && n1.children;
		const prevShapeFlag = n1 ? n1.shapeFlag : 0;
		const c2 = n2.children;
		const { patchFlag, shapeFlag } = n2;
		if (patchFlag > 0) {
			if (patchFlag & 128) {
				patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			} else if (patchFlag & 256) {
				patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			}
		}
		if (shapeFlag & 8) {
			if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
			if (c2 !== c1) hostSetElementText(container, c2);
		} else if (prevShapeFlag & 16) {
			if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else unmountChildren(c1, parentComponent, parentSuspense, true);
		} else {
			if (prevShapeFlag & 8) hostSetElementText(container, "");
			if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		c1 = c1 || EMPTY_ARR;
		c2 = c2 || EMPTY_ARR;
		const oldLength = c1.length;
		const newLength = c2.length;
		const commonLength = Math.min(oldLength, newLength);
		let i = 0;
		for (; i < commonLength; i++) {
			const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
		if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
		else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
	};
	const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let i = 0;
		const l2 = c2.length;
		let e1 = c1.length - 1;
		let e2 = l2 - 1;
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			i++;
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			e1--;
			e2--;
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
				while (i <= e2) {
					patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					i++;
				}
			}
		} else if (i > e2) while (i <= e1) {
			unmount(c1[i], parentComponent, parentSuspense, true);
			i++;
		}
		else {
			const s1 = i;
			const s2 = i;
			const keyToNewIndexMap = /* @__PURE__ */ new Map();
			for (i = s2; i <= e2; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (nextChild.key != null) keyToNewIndexMap.set(nextChild.key, i);
			}
			let j;
			let patched = 0;
			const toBePatched = e2 - s2 + 1;
			let moved = false;
			let maxNewIndexSoFar = 0;
			const newIndexToOldIndexMap = new Array(toBePatched);
			for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
			for (i = s1; i <= e1; i++) {
				const prevChild = c1[i];
				if (patched >= toBePatched) {
					unmount(prevChild, parentComponent, parentSuspense, true);
					continue;
				}
				let newIndex;
				if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
				else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
					newIndex = j;
					break;
				}
				if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
				else {
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
					else moved = true;
					patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					patched++;
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
			j = increasingNewIndexSequence.length - 1;
			for (i = toBePatched - 1; i >= 0; i--) {
				const nextIndex = s2 + i;
				const nextChild = c2[nextIndex];
				const anchorVNode = c2[nextIndex + 1];
				const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
				if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (moved) {
					if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
					else j--;
				}
			}
		}
	};
	const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
		const { el, type, transition, children, shapeFlag } = vnode;
		if (shapeFlag & 6) {
			move(vnode.component.subTree, container, anchor, moveType);
			return;
		}
		if (shapeFlag & 128) {
			vnode.suspense.move(container, anchor, moveType);
			return;
		}
		if (shapeFlag & 64) {
			type.move(vnode, container, anchor, internals);
			return;
		}
		if (type === Fragment) {
			hostInsert(el, container, anchor);
			for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
			hostInsert(vnode.anchor, container, anchor);
			return;
		}
		if (type === Static) {
			moveStaticNode(vnode, container, anchor);
			return;
		}
		if (moveType !== 2 && shapeFlag & 1 && transition) {
			if (moveType === 0) {
				if (transition.persisted && !el[leaveCbKey]) hostInsert(el, container, anchor);
				else {
					transition.beforeEnter(el);
					hostInsert(el, container, anchor);
					queuePostRenderEffect(() => transition.enter(el), parentSuspense);
				}
			} else {
				const { leave, delayLeave, afterLeave } = transition;
				const remove2 = () => {
					if (vnode.ctx.isUnmounted) hostRemove(el);
					else hostInsert(el, container, anchor);
				};
				const performLeave = () => {
					const wasLeaving = el._isLeaving || !!el[leaveCbKey];
					if (el._isLeaving) el[leaveCbKey](true);
					if (transition.persisted && !wasLeaving) remove2();
					else leave(el, () => {
						remove2();
						afterLeave && afterLeave();
					});
				};
				if (delayLeave) delayLeave(el, remove2, performLeave);
				else performLeave();
			}
		} else hostInsert(el, container, anchor);
	};
	const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
		const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
		if (patchFlag === -2 || dynamicChildren && dynamicChildren.hasOnce) optimized = false;
		if (ref != null) {
			pauseTracking();
			setRef(ref, null, parentSuspense, vnode, true);
			resetTracking();
		}
		if (cacheIndex != null && (!vnode.ctx || vnode.ctx === parentComponent)) parentComponent.renderCache[cacheIndex] = void 0;
		if (shapeFlag & 256 && parentComponent.ctx.deactivate(vnode)) return;
		const shouldInvokeDirs = shapeFlag & 1 && dirs;
		const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
		let vnodeHook;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
		else {
			if (shapeFlag & 128) {
				vnode.suspense.unmount(parentSuspense, doRemove);
				return;
			}
			if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
			if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
			else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
			else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
			if (doRemove) remove(vnode);
		}
		const shouldInvalidateMemo = memo != null && cacheIndex == null;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
			shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
			if (shouldInvalidateMemo) vnode.el = null;
		}, parentSuspense);
	};
	const remove = (vnode) => {
		const { type, el, anchor, transition } = vnode;
		const isFragment = type === Fragment;
		if (isFragment && !transition) {
			removeFragment(el, anchor);
			return;
		}
		if (type === Static) {
			removeStaticNode(vnode);
			if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
			return;
		}
		const leavingNode = isFragment ? getTransitionRoot(vnode) : vnode;
		const performRemove = () => {
			if (isFragment) {
				if (hostParentNode(el)) removeFragment(el, anchor);
			} else hostRemove(el);
			if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
		};
		if (leavingNode && leavingNode.shapeFlag & 1 && transition && !transition.persisted) {
			const { leave, delayLeave } = transition;
			const leavingEl = leavingNode.el;
			const performLeave = () => leave(leavingEl, performRemove);
			if (delayLeave) delayLeave(leavingEl, performRemove, performLeave);
			else performLeave();
		} else performRemove();
	};
	const removeFragment = (cur, end) => {
		let next;
		while (cur !== end) {
			next = hostNextSibling(cur);
			hostRemove(cur);
			cur = next;
		}
		hostRemove(end);
	};
	const unmountComponent = (instance, parentSuspense, doRemove) => {
		const { bum, scope, job, subTree, um, m, a } = instance;
		invalidateMount(m);
		invalidateMount(a);
		if (bum) invokeArrayFns(bum);
		scope.stop();
		if (job) {
			job.flags |= 8;
			unmount(subTree, instance, parentSuspense, doRemove);
		} else if (subTree) {
			subTree.transition = instance.vnode.transition;
			unmount(subTree, instance, parentSuspense, doRemove);
		}
		if (um) queuePostRenderEffect(um, parentSuspense);
		const markUnmounted = () => {
			instance.isUnmounted = true;
		};
		markUnmounted.flags = 16;
		queuePostRenderEffect(markUnmounted, parentSuspense);
	};
	const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
		for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
	};
	const getNextHostNode = (vnode) => {
		if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
		if (vnode.shapeFlag & 128) return vnode.suspense.next();
		const el = hostNextSibling(vnode.anchor || vnode.el);
		const teleportEnd = el && el[TeleportEndKey];
		return teleportEnd ? hostNextSibling(teleportEnd) : el;
	};
	const render = (vnode, container, namespace) => {
		flushOnAppMount(() => {
			if (vnode == null) {
				if (container._vnode) unmount(container._vnode, null, null, true);
			} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
			container._vnode = vnode;
		}, vnode && container._vnode ? void 0 : vnode && vnode.component ? vnode.component.uid : getNextUid());
	};
	const internals = {
		p: patch,
		um: unmount,
		m: move,
		r: remove,
		mt: mountComponent,
		mc: mountChildren,
		pc: patchChildren,
		pbc: patchBlockChildren,
		n: getNextHostNode,
		o: options
	};
	let hydrate;
	let hydrateNode;
	if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
	return {
		render,
		hydrate,
		createApp: createAppAPI(render, hydrate)
	};
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
	return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, job }, allowed) {
	if (allowed) {
		effect.flags |= 32;
		job.flags |= 4;
	} else {
		effect.flags &= -33;
		job.flags &= -5;
	}
}
function needTransition(parentSuspense, transition) {
	return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
	const ch1 = n1.children;
	const ch2 = n2.children;
	if (isArray$1(ch1) && isArray$1(ch2)) for (let i = 0; i < ch1.length; i++) {
		const c1 = ch1[i];
		let c2 = ch2[i];
		if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
			if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
				c2 = ch2[i] = cloneIfMounted(ch2[i]);
				c2.el = c1.el;
			}
			if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
		}
		if (c2.type === Text) {
			if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
			c2.el = c1.el;
		}
		if (c2.type === Comment && !c2.el) c2.el = c1.el;
	}
}
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = u + v >> 1;
				if (arr[result[c]] < arrI) u = c + 1;
				else v = c;
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) p[i] = result[u - 1];
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
function locateUnresolvedAsyncRoot(instance) {
	const subComponent = instance.subTree.component;
	if (subComponent) {
		if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
		else return locateUnresolvedAsyncRoot(subComponent);
	}
}
function invalidateMount(hooks) {
	if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
	if (anchorVnode.placeholder) return anchorVnode.placeholder;
	const instance = anchorVnode.component;
	if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
	const suspense = anchorVnode.suspense;
	if (suspense && suspense.activeBranch) return resolveAsyncComponentPlaceholder(suspense.activeBranch);
	return null;
}
var isSuspense = (type) => type.__isSuspense;
var suspenseId = 0;
var deferredEnterKey = /* @__PURE__ */ Symbol("_deferredEnter");
var Suspense = {
	name: "Suspense",
	__isSuspense: true,
	process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
		if (n1 == null) mountSuspense(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals);
		else {
			const suspense = n1.suspense;
			if (parentSuspense && parentSuspense.deps > 0 && !parentSuspense.isHydrating) {
				const owner = suspense.parentComponent;
				if (!!owner && owner.suspense === parentSuspense && owner.suspenseId !== parentSuspense.pendingId ? parentSuspense.pendingBranch && !isSameVNodeType(n2.ssContent, suspense.pendingBranch || suspense.activeBranch) : !suspense.isInFallback) {
					n2.suspense = suspense;
					suspense.vnode = n2;
					n2.el = n1.el;
					return;
				}
			}
			patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, rendererInternals);
		}
	},
	hydrate: hydrateSuspense,
	normalize: normalizeSuspenseChildren
};
function triggerEvent(vnode, name) {
	const eventListener = vnode.props && vnode.props[name];
	if (isFunction(eventListener)) eventListener();
}
function enterDeferred(branch) {
	const enters = [];
	collectDeferredEnters(branch, enters, true);
	if (enters.length) queuePostFlushCb(enters);
}
function collectDeferredEnters(vnode, enters, isRoot) {
	const { el, transition, children, shapeFlag } = vnode;
	if (shapeFlag & 6) {
		collectDeferredEnters(vnode.component.subTree, enters, isRoot);
		return;
	}
	if (shapeFlag & 192) return;
	if (shapeFlag & 1) {
		if (!isRoot && el && el[deferredEnterKey]) {
			el[deferredEnterKey] = void 0;
			if (transition && !transition.persisted) {
				transition.beforeEnter(el);
				enters.push(() => transition.enter(el));
			}
		}
		isRoot = false;
	}
	if (shapeFlag & 16) for (let i = 0; i < children.length; i++) collectDeferredEnters(children[i], enters, isRoot);
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
	const { p: patch, o: { createElement } } = rendererInternals;
	const hiddenContainer = createElement("div");
	const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals);
	patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds);
	if (suspense.deps > 0) {
		triggerEvent(vnode, "onPending");
		triggerEvent(vnode, "onFallback");
		patch(null, vnode.ssFallback, container, anchor, parentComponent, null, namespace, slotScopeIds);
		setActiveBranch(suspense, vnode.ssFallback);
	} else suspense.resolve(false, true);
}
function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
	const suspense = n2.suspense = n1.suspense;
	suspense.vnode = n2;
	n2.el = n1.el;
	const newBranch = n2.ssContent;
	const newFallback = n2.ssFallback;
	const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
	if (pendingBranch) {
		suspense.pendingBranch = newBranch;
		if (isSameVNodeType(pendingBranch, newBranch)) {
			suspense.deps++;
			patch(pendingBranch, newBranch, isHydrating ? container : suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
			suspense.deps--;
			if (suspense.deps <= 0) suspense.resolve();
			else if (isInFallback) {
				if (!isHydrating && !suspense.isFallbackMountPending) {
					patch(activeBranch, newFallback, container, anchor, parentComponent, null, namespace, slotScopeIds, optimized);
					setActiveBranch(suspense, newFallback);
				}
			}
		} else {
			suspense.pendingId = suspenseId++;
			if (isHydrating) {
				suspense.isHydrating = false;
				suspense.activeBranch = pendingBranch;
			} else unmount(pendingBranch, parentComponent, suspense);
			suspense.deps = 0;
			discardEffects(suspense);
			suspense.hiddenContainer = createElement("div");
			if (isInFallback) {
				patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
				if (suspense.deps <= 0) suspense.resolve();
				else if (!suspense.isFallbackMountPending) {
					patch(activeBranch, newFallback, container, anchor, parentComponent, null, namespace, slotScopeIds, optimized);
					setActiveBranch(suspense, newFallback);
				}
			} else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
				patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, namespace, slotScopeIds, optimized);
				suspense.resolve(true);
			} else {
				patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
				if (suspense.deps <= 0) suspense.resolve();
			}
		}
	} else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
		patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, namespace, slotScopeIds, optimized);
		setActiveBranch(suspense, newBranch);
	} else {
		triggerEvent(n2, "onPending");
		suspense.pendingBranch = newBranch;
		suspense.pendingId = suspenseId++;
		patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
		if (suspense.deps <= 0) suspense.resolve();
		else {
			const { timeout } = suspense;
			if (timeout > 0) suspense.timeoutTimer = setTimeout(() => {
				suspense.timeoutTimer = void 0;
				suspense.fallback(suspense.vnode.ssFallback);
			}, timeout);
			else if (timeout === 0) suspense.fallback(newFallback);
		}
	}
}
function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
	const { p: patch, m: move, um: unmount, n: next, o: { parentNode, remove } } = rendererInternals;
	let parentSuspenseId;
	const isSuspensible = isVNodeSuspensible(vnode);
	if (isSuspensible) {
		if (parentSuspense && parentSuspense.pendingBranch) {
			parentSuspenseId = parentSuspense.pendingId;
			parentSuspense.deps++;
		}
	}
	const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
	const initialAnchor = anchor;
	const suspense = {
		vnode,
		parent: parentSuspense,
		parentComponent,
		namespace,
		container,
		hiddenContainer,
		deps: 0,
		pendingId: suspenseId++,
		timeout: typeof timeout === "number" ? timeout : -1,
		timeoutTimer: void 0,
		activeBranch: null,
		isFallbackMountPending: false,
		pendingBranch: null,
		isInFallback: !isHydrating,
		isHydrating,
		isUnmounted: false,
		effects: [],
		resolve(resume = false, sync = false) {
			const { vnode: vnode2, activeBranch, pendingBranch, pendingId, effects, parentComponent: parentComponent2, container: container2, isInFallback } = suspense;
			let delayEnter = false;
			if (suspense.isHydrating) suspense.isHydrating = false;
			else if (!resume) {
				delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
				let hasUpdatedAnchor = false;
				if (delayEnter) activeBranch.transition.afterLeave = () => {
					if (pendingId === suspense.pendingId && !suspense.isUnmounted) {
						enterDeferred(pendingBranch);
						move(pendingBranch, container2, anchor === initialAnchor && !hasUpdatedAnchor ? next(activeBranch) : anchor, 0);
						queuePostFlushCb(effects);
						if (isInFallback && vnode2.ssFallback) vnode2.ssFallback.el = null;
					}
				};
				if (activeBranch && !suspense.isFallbackMountPending) {
					if (parentNode(activeBranch.el || resolveAsyncComponentPlaceholder(activeBranch)) === container2) {
						anchor = next(activeBranch);
						hasUpdatedAnchor = true;
					}
					unmount(activeBranch, parentComponent2, suspense, true);
					if (!delayEnter && isInFallback && vnode2.ssFallback) queuePostRenderEffect(() => vnode2.ssFallback.el = null, suspense);
				}
				if (!delayEnter) {
					enterDeferred(pendingBranch);
					move(pendingBranch, container2, anchor, 0);
				}
			}
			clearTimeout(suspense.timeoutTimer);
			suspense.timeoutTimer = void 0;
			suspense.isFallbackMountPending = false;
			setActiveBranch(suspense, pendingBranch);
			suspense.pendingBranch = null;
			suspense.isInFallback = false;
			let kept = 0;
			for (let i = 0; i < effects.length; i++) {
				const effect = effects[i];
				if (effect.flags & 32) queuePostFlushCb(effect);
				else effects[kept++] = effect;
			}
			effects.length = kept;
			let parent = suspense.parent;
			let hasUnresolvedAncestor = false;
			while (parent) {
				if (parent.pendingBranch) {
					for (let i = 0; i < effects.length; i++) parent.effects.push(effects[i]);
					hasUnresolvedAncestor = true;
					break;
				}
				parent = parent.parent;
			}
			if (!hasUnresolvedAncestor && !delayEnter) queuePostFlushCb(effects);
			suspense.effects = [];
			if (isSuspensible) {
				if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
					parentSuspenseId = void 0;
					parentSuspense.deps--;
					if (parentSuspense.deps === 0 && !sync) parentSuspense.resolve();
				}
			}
			triggerEvent(vnode2, "onResolve");
		},
		fallback(fallbackVNode) {
			if (suspense.isUnmounted || !suspense.pendingBranch) return;
			const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
			triggerEvent(vnode2, "onFallback");
			const anchor2 = next(activeBranch);
			const mountFallback = () => {
				suspense.isFallbackMountPending = false;
				if (suspense.isUnmounted || !suspense.isInFallback) return;
				const latestFallback = suspense.vnode.ssFallback;
				patch(null, latestFallback, container2, anchor2, parentComponent2, null, namespace2, slotScopeIds, optimized);
				setActiveBranch(suspense, latestFallback);
			};
			const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
			if (delayEnter) {
				suspense.isFallbackMountPending = true;
				activeBranch.transition.afterLeave = mountFallback;
			}
			suspense.isInFallback = true;
			unmount(activeBranch, parentComponent2, null, true);
			if (!delayEnter) mountFallback();
		},
		move(container2, anchor2, type) {
			suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
			suspense.container = container2;
		},
		next() {
			return suspense.activeBranch && next(suspense.activeBranch);
		},
		registerDep(instance, setupRenderEffect, optimized2, namespace2) {
			const isInPendingSuspense = !!suspense.pendingBranch;
			if (isInPendingSuspense) suspense.deps++;
			const hydratedEl = instance.vnode.el;
			const render = (asyncSetupResult) => {
				instance.asyncResolved = true;
				const { vnode: vnode2 } = instance;
				handleSetupResult(instance, asyncSetupResult, false);
				if (hydratedEl) vnode2.el = hydratedEl;
				const placeholder = !hydratedEl && instance.subTree.el;
				setupRenderEffect(instance, vnode2, parentNode(hydratedEl || instance.subTree.el), hydratedEl ? null : next(instance.subTree), suspense, namespace2, optimized2);
				if (placeholder) {
					vnode2.placeholder = null;
					remove(placeholder);
				}
				updateHOCHostEl(instance, vnode2.el);
			};
			instance.asyncDep.catch((err) => {
				handleError(err, instance, 0, false, true);
				return () => null;
			}).then((asyncSetupResult) => {
				if (instance.isUnmounted || suspense.isUnmounted) return;
				const isPendingDep = isInPendingSuspense && suspense.pendingId === instance.suspenseId;
				unsetCurrentInstance();
				if (!instance.scope.active) {
					if (isPendingDep && --suspense.deps === 0) suspense.resolve();
					return;
				}
				if (!isPendingDep && suspense.pendingBranch) {
					const job = () => {
						if (instance.isUnmounted || suspense.isUnmounted || !instance.scope.active) return;
						if (suspense.pendingBranch) queueEffectWithSuspense(job, suspense);
						else render(asyncSetupResult);
					};
					job.flags = 48;
					queueEffectWithSuspense(job, suspense);
					return;
				}
				render(asyncSetupResult);
				if (isPendingDep && --suspense.deps === 0) suspense.resolve();
			});
		},
		unmount(parentSuspense2, doRemove) {
			suspense.isUnmounted = true;
			clearTimeout(suspense.timeoutTimer);
			suspense.timeoutTimer = void 0;
			if (parentSuspenseId !== void 0) {
				const parent = suspense.parent;
				const pendingId = parentSuspenseId;
				parentSuspenseId = void 0;
				queuePostFlushCb(() => {
					if (parent.pendingId === pendingId && !parent.isUnmounted && --parent.deps === 0) parent.resolve();
				});
			}
			if (suspense.activeBranch) unmount(suspense.activeBranch, parentComponent, parentSuspense2, doRemove);
			if (suspense.pendingBranch) {
				unmount(suspense.pendingBranch, parentComponent, suspense, doRemove);
				discardEffects(suspense);
			}
		}
	};
	return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
	const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement("div"), null, namespace, slotScopeIds, optimized, rendererInternals, true);
	const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
	if (suspense.deps === 0) suspense.resolve(false, true);
	return result;
}
function normalizeSuspenseChildren(vnode) {
	const { shapeFlag, children } = vnode;
	const isSlotChildren = shapeFlag & 32;
	vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
	vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
}
function normalizeSuspenseSlot(s) {
	let block;
	if (isFunction(s)) {
		const trackBlock = isBlockTreeEnabled && s._c;
		if (trackBlock) {
			s._d = false;
			openBlock();
		}
		s = s();
		if (trackBlock) {
			s._d = true;
			block = currentBlock;
			closeBlock();
		}
	}
	if (isArray$1(s)) s = filterSingleRoot(s);
	s = normalizeVNode(s);
	if (block && !s.dynamicChildren) s.dynamicChildren = block.filter((c) => c !== s);
	return s;
}
function discardEffects(suspense) {
	const { effects } = suspense;
	for (let i = 0; i < effects.length; i++) {
		const effect = effects[i];
		if (effect.flags & 16) queuePostFlushCb(effect);
	}
	effects.length = 0;
}
function queueEffectWithSuspense(fn, suspense) {
	if (suspense && suspense.pendingBranch) {
		if (isArray$1(fn)) suspense.effects.push(...fn);
		else suspense.effects.push(fn);
	} else queuePostFlushCb(fn);
}
function setActiveBranch(suspense, branch) {
	suspense.activeBranch = branch;
	const { vnode, parentComponent } = suspense;
	let el = branch.el;
	while (!el && branch.component) {
		branch = branch.component.subTree;
		el = branch.el;
	}
	vnode.el = el;
	if (parentComponent && parentComponent.subTree === vnode) {
		parentComponent.vnode.el = el;
		updateHOCHostEl(parentComponent, el);
	}
}
function isVNodeSuspensible(vnode) {
	const suspensible = vnode.props && vnode.props.suspensible;
	return suspensible != null && suspensible !== false;
}
var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
var Text = /* @__PURE__ */ Symbol.for("v-txt");
var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
var Static = /* @__PURE__ */ Symbol.for("v-stc");
var blockStack = [];
var currentBlock = null;
function openBlock(disableTracking = false) {
	blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
	blockStack.pop();
	currentBlock = blockStack[blockStack.length - 1] || null;
}
var isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
	isBlockTreeEnabled += value;
	if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
}
function setupBlock(vnode) {
	vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
	closeBlock();
	if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(vnode);
	return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
	return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
	return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
	return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
	return n1.type === n2.type && n1.key === n2.key;
}
var normalizeKey = ({ key }) => key != null ? key : null;
var normalizeRef = ({ ref, ref_key, ref_for }) => {
	if (typeof ref === "number") ref = "" + ref;
	return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction(ref) ? {
		i: currentRenderingInstance,
		r: ref,
		k: ref_key,
		f: !!ref_for
	} : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
	const vnode = {
		__v_isVNode: true,
		__v_skip: true,
		type,
		props,
		key: props && normalizeKey(props),
		ref: props && normalizeRef(props),
		scopeId: currentScopeId,
		slotScopeIds: null,
		children,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag,
		patchFlag,
		dynamicProps,
		dynamicChildren: null,
		appContext: null,
		ctx: currentRenderingInstance
	};
	if (needFullChildrenNormalization) {
		normalizeChildren(vnode, children);
		if (shapeFlag & 128) type.normalize(vnode);
	} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
	if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
	return vnode;
}
var createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	if (!type || type === NULL_DYNAMIC_COMPONENT) type = Comment;
	if (isVNode(type)) {
		const cloned = cloneVNode(type, props, true);
		if (children) normalizeChildren(cloned, children);
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
			if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
			else currentBlock.push(cloned);
		}
		cloned.patchFlag = -2;
		return cloned;
	}
	if (isClassComponent(type)) type = type.__vccOpts;
	if (props) {
		props = guardReactiveProps(props);
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (isObject(style)) {
			if (/* @__PURE__ */ isProxy(style) && !isArray$1(style)) style = extend({}, style);
			props.style = normalizeStyle(style);
		}
	}
	const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
	return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
	if (!props) return null;
	if (/* @__PURE__ */ isProxy(props)) return extend({}, props);
	return isInternalObject(props) ? extend({}, props[rawAttrsKey] || props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
	const { props, ref, patchFlag, children, transition } = vnode;
	const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
	const cloned = {
		__v_isVNode: true,
		__v_skip: true,
		type: vnode.type,
		props: mergedProps,
		key: mergedProps && normalizeKey(mergedProps),
		ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray$1(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
		scopeId: vnode.scopeId,
		slotScopeIds: vnode.slotScopeIds,
		children,
		target: vnode.target,
		targetStart: vnode.targetStart,
		targetAnchor: vnode.targetAnchor,
		staticCount: vnode.staticCount,
		shapeFlag: vnode.shapeFlag,
		patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
		dynamicProps: vnode.dynamicProps,
		dynamicChildren: vnode.dynamicChildren,
		appContext: vnode.appContext,
		dirs: vnode.dirs,
		transition,
		component: vnode.component,
		suspense: vnode.suspense,
		ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
		ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
		placeholder: vnode.placeholder,
		el: vnode.el,
		anchor: vnode.anchor,
		ctx: vnode.ctx,
		ce: vnode.ce,
		cacheIndex: vnode.cacheIndex
	};
	if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
	return cloned;
}
function createTextVNode(text = " ", flag = 0) {
	return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
	const vnode = createVNode(Static, null, content);
	vnode.staticCount = numberOfNodes;
	return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
	return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
	if (child == null || typeof child === "boolean") return createVNode(Comment);
	else if (isArray$1(child)) return createVNode(Fragment, null, child.slice());
	else if (isVNode(child)) return cloneIfMounted(child);
	else return createVNode(Text, null, String(child));
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
	let type = 0;
	const { shapeFlag } = vnode;
	if (children == null) children = null;
	else if (isArray$1(children)) type = 16;
	else if (typeof children === "object") {
		if (shapeFlag & 65) {
			const slot = children.default;
			if (slot) {
				slot._c && (slot._d = false);
				normalizeChildren(vnode, slot());
				slot._c && (slot._d = true);
			}
			return;
		} else {
			type = 32;
			const slotFlag = children._;
			if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
			else if (slotFlag === 3 && currentRenderingInstance) {
				if (currentRenderingInstance.slots._ === 1) children._ = 1;
				else {
					children._ = 2;
					vnode.patchFlag |= 1024;
				}
			}
		}
	} else if (isFunction(children)) {
		if (shapeFlag & 65) {
			normalizeChildren(vnode, { default: children });
			return;
		}
		children = {
			default: children,
			_ctx: currentRenderingInstance
		};
		type = 32;
	} else {
		children = String(children);
		if (shapeFlag & 64) {
			type = 16;
			children = [createTextVNode(children)];
		} else type = 8;
	}
	vnode.children = children;
	vnode.shapeFlag |= type;
}
function mergeProps(...args) {
	const ret = {};
	for (let i = 0; i < args.length; i++) {
		const toMerge = args[i];
		for (const key in toMerge) if (key === "class") {
			if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
		} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
		else if (isOn(key)) {
			const existing = ret[key];
			const incoming = toMerge[key];
			if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
			else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
		} else if (key !== "") ret[key] = toMerge[key];
	}
	return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
	callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}
var emptyAppContext = /* @__PURE__ */ createAppContext();
var uid = 0;
function getNextUid() {
	return uid;
}
function createComponentInstance(vnode, parent, suspense) {
	const type = vnode.type;
	const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
	const instance = {
		uid: uid++,
		vnode,
		type,
		parent,
		appContext,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new EffectScope(true),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: parent ? parent.provides : Object.create(appContext.provides),
		ids: parent ? parent.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: normalizePropsOptions(type, appContext),
		emitsOptions: normalizeEmitsOptions(type, appContext),
		emit: null,
		emitted: null,
		propsDefaults: EMPTY_OBJ,
		inheritAttrs: type.inheritAttrs,
		ctx: EMPTY_OBJ,
		data: EMPTY_OBJ,
		props: EMPTY_OBJ,
		attrs: EMPTY_OBJ,
		slots: EMPTY_OBJ,
		refs: EMPTY_OBJ,
		setupState: EMPTY_OBJ,
		setupContext: null,
		suspense,
		suspenseId: suspense ? suspense.pendingId : 0,
		asyncDep: null,
		asyncResolved: false,
		isMounted: false,
		isUnmounted: false,
		isDeactivated: false,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	instance.ctx = { _: instance };
	instance.root = parent ? parent.root : instance;
	instance.emit = emit.bind(null, instance);
	if (vnode.ce) vnode.ce(instance);
	return instance;
}
var currentInstance = null;
var getCurrentInstance = () => currentInstance || currentRenderingInstance;
var internalSetCurrentInstance;
var setInSSRSetupState;
{
	const g = getGlobalThis();
	const registerGlobalSetter = (key, setter) => {
		let setters;
		if (!(setters = g[key])) setters = g[key] = [];
		setters.push(setter);
		return (v) => {
			if (setters.length > 1) setters.forEach((set) => set(v));
			else setters[0](v);
		};
	};
	internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
	setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
}
var setCurrentInstance = (instance) => {
	const prev = currentInstance;
	internalSetCurrentInstance(instance);
	instance.scope.on();
	return () => {
		instance.scope.off();
		internalSetCurrentInstance(prev);
	};
};
var unsetCurrentInstance = () => {
	currentInstance && currentInstance.scope.off();
	internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
	return instance.vnode.shapeFlag & 4;
}
var isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
	isSSR && setInSSRSetupState(isSSR);
	const { props, children } = instance.vnode;
	const isStateful = isStatefulComponent(instance);
	initProps(instance, props, isStateful, isSSR);
	initSlots(instance, children, optimized || isSSR);
	const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
	isSSR && setInSSRSetupState(false);
	return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
	const Component = instance.type;
	instance.accessCache = /* @__PURE__ */ Object.create(null);
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
	const { setup } = Component;
	if (setup) {
		pauseTracking();
		const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
		const reset = setCurrentInstance(instance);
		const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
		const isAsyncSetup = isPromise(setupResult);
		resetTracking();
		reset();
		if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
		if (isAsyncSetup) {
			setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
			if (isSSR) return setupResult.then((resolvedResult) => {
				setInSSRSetupState(true);
				try {
					handleSetupResult(instance, resolvedResult, isSSR);
				} finally {
					setInSSRSetupState(false);
				}
			}).catch((e) => {
				handleError(e, instance, 0, void 0, true);
				instance.ssrRender = (_, push) => push("<!---->");
			});
			else instance.asyncDep = setupResult;
		} else handleSetupResult(instance, setupResult, isSSR);
	} else finishComponentSetup(instance, isSSR);
}
function handleSetupResult(instance, setupResult, isSSR) {
	if (isFunction(setupResult)) {
		if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
		else instance.render = setupResult;
	} else if (isObject(setupResult)) instance.setupState = proxyRefs(setupResult);
	finishComponentSetup(instance, isSSR);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
	const Component = instance.type;
	if (!instance.render) instance.render = Component.render || NOOP;
	{
		const reset = setCurrentInstance(instance);
		pauseTracking();
		try {
			applyOptions(instance);
		} finally {
			resetTracking();
			reset();
		}
	}
}
var rawAttrsKey = /* @__PURE__ */ Symbol();
var attrsProxyHandlers = { get(target, key) {
	track(target, "get", "");
	return key === rawAttrsKey ? target : target[key];
} };
function createSetupContext(instance) {
	const expose = (exposed) => {
		instance.exposed = exposed || {};
	};
	return {
		attrs: new Proxy(instance.attrs, attrsProxyHandlers),
		slots: instance.slots,
		emit: instance.emit,
		expose
	};
}
function getComponentPublicInstance(instance) {
	if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
		get(target, key) {
			if (key in target) return target[key];
			else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
		},
		has(target, key) {
			return key in target || key in publicPropertiesMap;
		}
	}));
	else return instance.proxy;
}
function getComponentName(Component, includeInferred = true) {
	return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
	return isFunction(value) && "__vccOpts" in value;
}
var computed = (getterOrOptions, debugOptions) => {
	return /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
	try {
		setBlockTracking(-1);
		const l = arguments.length;
		if (l === 2) {
			if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
				if (isVNode(propsOrChildren)) return createVNode(type, null, [propsOrChildren]);
				return createVNode(type, propsOrChildren);
			} else return createVNode(type, null, propsOrChildren);
		} else {
			if (l > 3) children = Array.prototype.slice.call(arguments, 2);
			else if (l === 3 && isVNode(children)) children = [children];
			return createVNode(type, propsOrChildren, children);
		}
	} finally {
		setBlockTracking(1);
	}
}
var version = "3.5.45";
// node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
/**
* @vue/runtime-dom v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var policy = void 0;
var tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) try {
	policy = /* @__PURE__ */ tt.createPolicy("vue", { createHTML: (val) => val });
} catch (e) {}
var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
var svgNS = "http://www.w3.org/2000/svg";
var mathmlNS = "http://www.w3.org/1998/Math/MathML";
var doc = typeof document !== "undefined" ? document : null;
var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
var nodeOps = {
	insert: (child, parent, anchor) => {
		parent.insertBefore(child, anchor || null);
	},
	remove: (child) => {
		const parent = child.parentNode;
		if (parent) parent.removeChild(child);
	},
	createElement: (tag, namespace, is, props) => {
		const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
		if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
		return el;
	},
	createText: (text) => doc.createTextNode(text),
	createComment: (text) => doc.createComment(text),
	setText: (node, text) => {
		node.nodeValue = text;
	},
	setElementText: (el, text) => {
		el.textContent = text;
	},
	parentNode: (node) => node.parentNode,
	nextSibling: (node) => node.nextSibling,
	querySelector: (selector) => doc.querySelector(selector),
	setScopeId(el, id) {
		el.setAttribute(id, "");
	},
	insertStaticContent(content, parent, anchor, namespace, start, end) {
		const before = anchor ? anchor.previousSibling : parent.lastChild;
		if (start && (start === end || start.nextSibling)) while (true) {
			parent.insertBefore(start.cloneNode(true), anchor);
			if (start === end || !(start = start.nextSibling)) break;
		}
		else {
			templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
			const template = templateContainer.content;
			if (namespace === "svg" || namespace === "mathml") {
				const wrapper = template.firstChild;
				while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
				template.removeChild(wrapper);
			}
			parent.insertBefore(template, anchor);
		}
		return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
	}
};
var TRANSITION = "transition";
var ANIMATION = "animation";
var vtcKey = /* @__PURE__ */ Symbol("_vtc");
var DOMTransitionPropsValidators = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: true
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
};
var TransitionPropsValidators = /* @__PURE__ */ extend({}, BaseTransitionPropsValidators, DOMTransitionPropsValidators);
var decorate$1 = (t) => {
	t.displayName = "Transition";
	t.props = TransitionPropsValidators;
	return t;
};
var Transition = /* @__PURE__ */ decorate$1((props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots));
var callHook$1 = (hook, args = []) => {
	if (isArray$1(hook)) hook.forEach((h2) => h2(...args));
	else if (hook) hook(...args);
};
var hasExplicitCallback = (hook) => {
	return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
	const baseProps = {};
	for (const key in rawProps) if (!(key in DOMTransitionPropsValidators)) baseProps[key] = rawProps[key];
	if (rawProps.css === false) return baseProps;
	const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
	const durations = normalizeDuration(duration);
	const enterDuration = durations && durations[0];
	const leaveDuration = durations && durations[1];
	const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
	const finishEnter = (el, isAppear, done, isCancelled) => {
		el._enterCancelled = isCancelled;
		removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
		removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
		done && done();
	};
	const finishLeave = (el, done) => {
		el._isLeaving = false;
		removeTransitionClass(el, leaveFromClass);
		removeTransitionClass(el, leaveToClass);
		removeTransitionClass(el, leaveActiveClass);
		done && done();
	};
	const makeEnterHook = (isAppear) => {
		return (el, done) => {
			const hook = isAppear ? onAppear : onEnter;
			const resolve = () => finishEnter(el, isAppear, done);
			callHook$1(hook, [el, resolve]);
			nextFrame(() => {
				removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
				addTransitionClass(el, isAppear ? appearToClass : enterToClass);
				if (!hasExplicitCallback(hook)) whenTransitionEnds(el, type, enterDuration, resolve);
			});
		};
	};
	return extend(baseProps, {
		onBeforeEnter(el) {
			callHook$1(onBeforeEnter, [el]);
			addTransitionClass(el, enterFromClass);
			addTransitionClass(el, enterActiveClass);
		},
		onBeforeAppear(el) {
			callHook$1(onBeforeAppear, [el]);
			addTransitionClass(el, appearFromClass);
			addTransitionClass(el, appearActiveClass);
		},
		onEnter: makeEnterHook(false),
		onAppear: makeEnterHook(true),
		onLeave(el, done) {
			el._isLeaving = true;
			const resolve = () => finishLeave(el, done);
			addTransitionClass(el, leaveFromClass);
			if (!el._enterCancelled) {
				forceReflow(el);
				addTransitionClass(el, leaveActiveClass);
			} else {
				addTransitionClass(el, leaveActiveClass);
				forceReflow(el);
			}
			nextFrame(() => {
				if (!el._isLeaving) return;
				removeTransitionClass(el, leaveFromClass);
				addTransitionClass(el, leaveToClass);
				if (!hasExplicitCallback(onLeave)) whenTransitionEnds(el, type, leaveDuration, resolve);
			});
			callHook$1(onLeave, [el, resolve]);
		},
		onEnterCancelled(el) {
			finishEnter(el, false, void 0, true);
			callHook$1(onEnterCancelled, [el]);
		},
		onAppearCancelled(el) {
			finishEnter(el, true, void 0, true);
			callHook$1(onAppearCancelled, [el]);
		},
		onLeaveCancelled(el) {
			finishLeave(el);
			callHook$1(onLeaveCancelled, [el]);
		}
	});
}
function normalizeDuration(duration) {
	if (duration == null) return null;
	else if (isObject(duration)) return [NumberOf(duration.enter), NumberOf(duration.leave)];
	else {
		const n = NumberOf(duration);
		return [n, n];
	}
}
function NumberOf(val) {
	return toNumber(val);
}
function addTransitionClass(el, cls) {
	cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
	(el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
	cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
	const _vtc = el[vtcKey];
	if (_vtc) {
		_vtc.delete(cls);
		if (!_vtc.size) el[vtcKey] = void 0;
	}
}
function nextFrame(cb) {
	requestAnimationFrame(() => {
		requestAnimationFrame(cb);
	});
}
var endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
	const id = el._endId = ++endId;
	const resolveIfNotStale = () => {
		if (id === el._endId) resolve();
	};
	if (explicitTimeout != null) return setTimeout(resolveIfNotStale, explicitTimeout);
	const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
	if (!type) return resolve();
	const endEvent = type + "end";
	let ended = 0;
	const end = () => {
		el.removeEventListener(endEvent, onEnd);
		resolveIfNotStale();
	};
	const onEnd = (e) => {
		if (e.target === el && ++ended >= propCount) end();
	};
	setTimeout(() => {
		if (ended < propCount) end();
	}, timeout + 1);
	el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
	const styles = window.getComputedStyle(el);
	const getStyleProperties = (key) => (styles[key] || "").split(", ");
	const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
	const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
	const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
	const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
	const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
	const animationTimeout = getTimeout(animationDelays, animationDurations);
	let type = null;
	let timeout = 0;
	let propCount = 0;
	if (expectedType === TRANSITION) {
		if (transitionTimeout > 0) {
			type = TRANSITION;
			timeout = transitionTimeout;
			propCount = transitionDurations.length;
		}
	} else if (expectedType === ANIMATION) {
		if (animationTimeout > 0) {
			type = ANIMATION;
			timeout = animationTimeout;
			propCount = animationDurations.length;
		}
	} else {
		timeout = Math.max(transitionTimeout, animationTimeout);
		type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
		propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
	}
	const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
	return {
		type,
		timeout,
		propCount,
		hasTransform
	};
}
function getTimeout(delays, durations) {
	while (delays.length < durations.length) delays = delays.concat(delays);
	return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
	if (s === "auto") return 0;
	return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow(el) {
	return (el ? el.ownerDocument : document).body.offsetHeight;
}
function patchClass(el, value, isSVG) {
	const transitionClasses = el[vtcKey];
	if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
	if (value == null) el.removeAttribute("class");
	else if (isSVG) el.setAttribute("class", value);
	else el.className = value;
}
var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
var displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
	const style = el.style;
	const isCssString = isString(next);
	let hasControlledDisplay = false;
	if (next && !isCssString) {
		if (prev) {
			if (!isString(prev)) {
				for (const key in prev) if (next[key] == null) setStyle(style, key, "");
			} else for (const prevStyle of prev.split(";")) {
				const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
				if (next[key] == null) setStyle(style, key, "");
			}
		}
		for (const key in next) {
			if (key === "display") hasControlledDisplay = true;
			const value = next[key];
			if (value != null) {
				if (!shouldPreserveTextareaResizeStyle(el, key, !isString(prev) && prev ? prev[key] : void 0, value)) setStyle(style, key, value);
			} else setStyle(style, key, "");
		}
	} else if (isCssString) {
		if (prev !== next) {
			const cssVarText = style[CSS_VAR_TEXT];
			if (cssVarText) next += ";" + cssVarText;
			style.cssText = next;
			hasControlledDisplay = displayRE.test(next);
		}
	} else if (prev) el.removeAttribute("style");
	if (vShowOriginalDisplay in el) {
		if (!isCssString || prev !== next) el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
		if (el[vShowHidden]) style.display = "none";
	}
}
var importantRE = /\s*!important$/;
function setStyle(style, name, val) {
	if (isArray$1(val)) val.forEach((v) => setStyle(style, name, v));
	else {
		if (val == null) val = "";
		if (name.startsWith("--")) {
			if (importantRE.test(val)) style.setProperty(name, val.replace(importantRE, ""), "important");
			else style.setProperty(name, val);
		} else {
			const prefixed = autoPrefix(style, name);
			if (importantRE.test(val)) style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
			else style[prefixed] = val;
		}
	}
}
var prefixes = [
	"Webkit",
	"Moz",
	"ms"
];
var prefixCache = {};
function autoPrefix(style, rawName) {
	const cached = prefixCache[rawName];
	if (cached) return cached;
	let name = camelize(rawName);
	if (name !== "filter" && name in style) return prefixCache[rawName] = name;
	name = capitalize(name);
	for (let i = 0; i < prefixes.length; i++) {
		const prefixed = prefixes[i] + name;
		if (prefixed in style) return prefixCache[rawName] = prefixed;
	}
	return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
	return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
var xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
	if (isSVG && key.startsWith("xlink:")) {
		if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
		else el.setAttributeNS(xlinkNS, key, value);
	} else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
	else el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
	if (key === "innerHTML" || key === "textContent") {
		if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
		return;
	}
	const tag = el.tagName;
	if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
		const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
		const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
		if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
		if (value == null) el.removeAttribute(key);
		el._value = value;
		return;
	}
	let needRemove = false;
	if (value === "" || value == null) {
		const type = typeof el[key];
		if (type === "boolean") value = includeBooleanAttr(value);
		else if (value == null && type === "string") {
			value = "";
			needRemove = true;
		} else if (type === "number") {
			value = 0;
			needRemove = true;
		}
	}
	try {
		el[key] = value;
	} catch (e) {}
	needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
	el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
	el.removeEventListener(event, handler, options);
}
var veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
	const invokers = el[veiKey] || (el[veiKey] = {});
	const existingInvoker = invokers[rawName];
	if (nextValue && existingInvoker) existingInvoker.value = nextValue;
	else {
		const [name, options] = parseName(rawName);
		if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(nextValue, instance), options);
		else if (existingInvoker) {
			removeEventListener(el, name, existingInvoker, options);
			invokers[rawName] = void 0;
		}
	}
}
var optionsModifierRE = /(Once|Passive|Capture)$/;
var optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(name) {
	let options;
	let m;
	while ((m = name.match(optionsModifierRE)) && !optionsModifierEventRE.test(name)) {
		if (!options) options = {};
		name = name.slice(0, name.length - m[1].length);
		options[m[1].toLowerCase()] = true;
	}
	return [name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2)), options];
}
var cachedNow = 0;
var p = /* @__PURE__ */ Promise.resolve();
var getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
	const invoker = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= invoker.attached) return;
		const value = invoker.value;
		if (isArray$1(value)) {
			const originalStop = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				originalStop.call(e);
				e._stopped = true;
			};
			const handlers = value.slice();
			const args = [e];
			for (let i = 0; i < handlers.length; i++) {
				if (e._stopped) break;
				const handler = handlers[i];
				if (handler) callWithAsyncErrorHandling(handler, instance, 5, args);
			}
		} else callWithAsyncErrorHandling(value, instance, 5, [e]);
	};
	invoker.value = initialValue;
	invoker.attached = getNow();
	return invoker;
}
var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
	const isSVG = namespace === "svg";
	if (key === "class") patchClass(el, nextValue, isSVG);
	else if (key === "style") patchStyle(el, prevValue, nextValue);
	else if (isOn(key)) {
		if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
	} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
		patchDOMProp(el, key, nextValue);
		if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
	} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
	else {
		if (key === "true-value") el._trueValue = nextValue;
		else if (key === "false-value") el._falseValue = nextValue;
		patchAttr(el, key, nextValue, isSVG);
	}
};
function shouldSetAsProp(el, key, value, isSVG) {
	if (isSVG) {
		if (key === "innerHTML" || key === "textContent") return true;
		if (key in el && isNativeOn(key) && isFunction(value)) return true;
		return false;
	}
	if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
	if (key === "sandbox" && el.tagName === "IFRAME") return false;
	if (key === "form") return false;
	if (key === "list" && el.tagName === "INPUT") return false;
	if (key === "type" && el.tagName === "TEXTAREA") return false;
	if (key === "width" || key === "height") {
		const tag = el.tagName;
		if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
	}
	if (isNativeOn(key) && isString(value)) return false;
	return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
	const props = el._def.props;
	if (!props) return false;
	const camelKey = camelize(key);
	return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
var rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
var renderer;
var enabledHydration = false;
function ensureRenderer() {
	return renderer || (renderer = createRenderer(rendererOptions));
}
function ensureHydrationRenderer() {
	renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
	enabledHydration = true;
	return renderer;
}
var createApp = ((...args) => {
	const app = ensureRenderer().createApp(...args);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (!container) return;
		const component = app._component;
		if (!isFunction(component) && !component.render && !component.template) component.template = container.innerHTML;
		if (container.nodeType === 1) container.textContent = "";
		const proxy = mount(container, false, resolveRootNamespace(container));
		if (container instanceof Element) {
			container.removeAttribute("v-cloak");
			container.setAttribute("data-v-app", "");
		}
		return proxy;
	};
	return app;
});
var createSSRApp = ((...args) => {
	const app = ensureHydrationRenderer().createApp(...args);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (container) return mount(container, true, resolveRootNamespace(container));
	};
	return app;
});
function resolveRootNamespace(container) {
	if (container instanceof SVGElement) return "svg";
	if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
}
function normalizeContainer(container) {
	if (isString(container)) return document.querySelector(container);
	return container;
}
// node_modules/hookable/dist/index.mjs
function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
var createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks$1(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks$1(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks$1(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks$1() {
	return new Hookable();
}
var HookableCore = class {
	_hooks;
	constructor() {
		this._hooks = {};
	}
	hook(name, fn) {
		if (!name || typeof fn !== "function") return () => {};
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(fn);
		return () => {
			if (fn) {
				this.removeHook(name, fn);
				fn = void 0;
			}
		};
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	callHook(name, ...args) {
		const hooks = this._hooks[name];
		if (!hooks || hooks.length === 0) return;
		return callHooks$1(hooks.slice(), args, 0);
	}
};
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var appHead = {
	"meta": [
		{ "charset": "utf-8" },
		{
			"name": "viewport",
			"content": "width=device-width, initial-scale=1"
		},
		{
			"name": "author",
			"content": "玩玩"
		}
	],
	"link": [{
		"rel": "icon",
		"type": "image/svg+xml",
		"href": "/favicon.svg"
	}, {
		"rel": "icon",
		"type": "image/x-icon",
		"href": "/favicon.ico"
	}],
	"style": [],
	"script": [],
	"noscript": [],
	"htmlAttrs": { "lang": "zh-CN" },
	"title": "玩玩"
};
var appSpaLoaderAttrs = { "id": "__nuxt-loader" };
var nuxtLinkDefaults = {
	"componentName": "NuxtLink",
	"prefetch": true,
	"prefetchOn": { "visibility": true }
};
var vueAppRootContainer = "#__nuxt";
var outdatedBuildInterval = 36e5;
var chunkErrorEvent = "vite:preloadError";
// node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.6.4";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: /* @__PURE__ */ shallowReactive({
			...options.ssrContext?.payload || {},
			data: /* @__PURE__ */ shallowReactive({}),
			state: /* @__PURE__ */ reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: /* @__PURE__ */ shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: true,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: /* @__PURE__ */ shallowReactive({}),
		_state: /* @__PURE__ */ shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	{
		const __NUXT__ = window.__NUXT__;
		if (__NUXT__) for (const key in __NUXT__) switch (key) {
			case "data":
			case "state":
			case "_errors":
				Object.assign(nuxtApp.payload[key], __NUXT__[key]);
				break;
			default: nuxtApp.payload[key] = __NUXT__[key];
		}
	}
	nuxtApp.hooks = createHooks$1();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const _callHook = nuxtApp.hooks.callHook;
		nuxtApp.hooks.callHook = (name, ...args) => Promise.resolve().then(() => _callHook(name, ...args));
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	{
		window.addEventListener(chunkErrorEvent, (event) => {
			nuxtApp.callHook("app:chunkError", { error: event.payload });
			if (event.payload?.message?.includes("Unable to preload CSS")) event.preventDefault();
		});
		window.useNuxtApp ||= useNuxtApp;
		const unreg = nuxtApp.hook("app:error", (...args) => {
			appDiagnostics.NUXT_E1005({ cause: args.length > 1 ? args : args[0] });
		});
		nuxtApp.hook("app:mounted", unreg);
	}
	const runtimeConfig = nuxtApp.payload.config;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => args ? setup(...args) : setup();
	getNuxtAppCtx(nuxt._id).set(nuxt);
	return nuxt.vueApp.runWithContext(fn);
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig$1(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
String.fromCharCode;
var HASH_RE$2 = /#/g;
var AMPERSAND_RE$1 = /&/g;
var SLASH_RE$1 = /\//g;
var EQUAL_RE$1 = /=/g;
var PLUS_RE$1 = /\+/g;
var ENC_CARET_RE$1 = /%5e/gi;
var ENC_BACKTICK_RE$1 = /%60/gi;
var ENC_PIPE_RE$2 = /%7c/gi;
var ENC_SPACE_RE$1 = /%20/gi;
var ENC_SLASH_RE = /%2f/gi;
function encode(text) {
	return encodeURI("" + text).replace(ENC_PIPE_RE$2, "|");
}
function encodeQueryValue$1(input) {
	return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE$1, "%2B").replace(ENC_SPACE_RE$1, "+").replace(HASH_RE$2, "%23").replace(AMPERSAND_RE$1, "%26").replace(ENC_BACKTICK_RE$1, "`").replace(ENC_CARET_RE$1, "^").replace(SLASH_RE$1, "%2F");
}
function encodeQueryKey$1(text) {
	return encodeQueryValue$1(text).replace(EQUAL_RE$1, "%3D");
}
function decode$1(text = "") {
	try {
		return decodeURIComponent("" + text);
	} catch {
		return "" + text;
	}
}
function decodePath(text) {
	return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
	return decode$1(text.replace(PLUS_RE$1, " "));
}
function decodeQueryValue(text) {
	return decode$1(text.replace(PLUS_RE$1, " "));
}
function parseQuery$1(parametersString = "") {
	const object = /* @__PURE__ */ Object.create(null);
	if (parametersString[0] === "?") parametersString = parametersString.slice(1);
	for (const parameter of parametersString.split("&")) {
		const s = parameter.match(/([^=]+)=?(.*)/) || [];
		if (s.length < 2) continue;
		const key = decodeQueryKey(s[1]);
		if (key === "__proto__" || key === "constructor") continue;
		const value = decodeQueryValue(s[2] || "");
		if (object[key] === void 0) object[key] = value;
		else if (Array.isArray(object[key])) object[key].push(value);
		else object[key] = [object[key], value];
	}
	return object;
}
function encodeQueryItem(key, value) {
	if (typeof value === "number" || typeof value === "boolean") value = String(value);
	if (!value) return encodeQueryKey$1(key);
	if (Array.isArray(value)) return value.map((_value) => `${encodeQueryKey$1(key)}=${encodeQueryValue$1(_value)}`).join("&");
	return `${encodeQueryKey$1(key)}=${encodeQueryValue$1(value)}`;
}
function stringifyQuery$1(query) {
	return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
var PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
var PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
var PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
var PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
var TRAILING_SLASH_RE$1 = /\/$|\/\?|\/#/;
var JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
	if (typeof opts === "boolean") opts = { acceptRelative: opts };
	if (opts.strict) return PROTOCOL_STRICT_REGEX.test(inputString);
	return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
	return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/");
	return TRAILING_SLASH_RE$1.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
	if (!hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex !== -1) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
	}
	const [s0, ...s] = path.split("?");
	return ((s0.endsWith("/") ? s0.slice(0, -1) : s0) || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/") ? input : input + "/";
	if (hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex !== -1) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
		if (!path) return fragment;
	}
	const [s0, ...s] = path.split("?");
	return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withBase(input, base) {
	if (isEmptyURL(base) || hasProtocol(input)) return input;
	const _base = withoutTrailingSlash(base);
	if (input.startsWith(_base)) {
		const nextChar = input[_base.length];
		if (!nextChar || nextChar === "/" || nextChar === "?") return input;
	}
	return joinURL(_base, input);
}
function withoutBase(input, base) {
	if (isEmptyURL(base)) return input;
	const _base = withoutTrailingSlash(base);
	if (!input.startsWith(_base)) return input;
	const nextChar = input[_base.length];
	if (nextChar && nextChar !== "/" && nextChar !== "?") return input;
	return "/" + input.slice(_base.length).replace(/^\/+/, "");
}
function withQuery(input, query) {
	const parsed = parseURL$1(input);
	parsed.search = stringifyQuery$1({
		...parseQuery$1(parsed.search),
		...query
	});
	return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
	return !url || url === "/";
}
function isNonEmptyURL(url) {
	return url && url !== "/";
}
function joinURL(base, ...input) {
	let url = base || "";
	for (const segment of input.filter((url2) => isNonEmptyURL(url2))) if (url) {
		const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
		url = withTrailingSlash(url) + _segment;
	} else url = segment;
	return url;
}
function joinRelativeURL(..._input) {
	const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
	const input = _input.filter(Boolean);
	const segments = [];
	let segmentsDepth = 0;
	for (const i of input) {
		if (!i || i === "/") continue;
		for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
			if (!s || s === ".") continue;
			if (s === "..") {
				if (segments.length === 1 && hasProtocol(segments[0])) continue;
				segments.pop();
				segmentsDepth--;
				continue;
			}
			if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
				segments[segments.length - 1] += "/" + s;
				continue;
			}
			segments.push(s);
			segmentsDepth++;
		}
	}
	let url = segments.join("/");
	if (segmentsDepth >= 0) {
		if (input[0]?.startsWith("/") && !url.startsWith("/")) url = "/" + url;
		else if (input[0]?.startsWith("./") && !url.startsWith("./")) url = "./" + url;
	} else url = "../".repeat(-1 * segmentsDepth) + url;
	if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) url += "/";
	return url;
}
function isSamePath(p1, p2) {
	return decode$1(withoutTrailingSlash(p1)) === decode$1(withoutTrailingSlash(p2));
}
function withoutFragment(input) {
	return stringifyParsedURL({
		...parseURL$1(input),
		hash: ""
	});
}
var protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL$1(input = "", defaultProto) {
	const _specialProtoMatch = input.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
	if (_specialProtoMatch) {
		const [, _proto, _pathname = ""] = _specialProtoMatch;
		return {
			protocol: _proto.toLowerCase(),
			pathname: _pathname,
			href: _proto + _pathname,
			auth: "",
			host: "",
			search: "",
			hash: ""
		};
	}
	if (!hasProtocol(input, { acceptRelative: true })) return defaultProto ? parseURL$1(defaultProto + input) : parsePath(input);
	const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
	let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
	if (protocol === "file:") path = path.replace(/\/(?=[A-Za-z]:)/, "");
	const { pathname, search, hash } = parsePath(path);
	return {
		protocol: protocol.toLowerCase(),
		auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
		host,
		pathname,
		search,
		hash,
		[protocolRelative]: !protocol
	};
}
function parsePath(input = "") {
	const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
	return {
		pathname,
		search,
		hash
	};
}
function stringifyParsedURL(parsed) {
	const pathname = parsed.pathname || "";
	const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
	const hash = parsed.hash || "";
	const auth = parsed.auth ? parsed.auth + "@" : "";
	const host = parsed.host || "";
	return (parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "") + auth + host + pathname + search + hash;
}
// node_modules/defu/dist/defu.mjs
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
	if (Symbol.iterator in value) return false;
	if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
	return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
	if (!isPlainObject(defaults)) return _defu(baseObject, {}, namespace, merger);
	const object = { ...defaults };
	for (const key of Object.keys(baseObject)) {
		if (key === "__proto__" || key === "constructor") continue;
		const value = baseObject[key];
		if (value === null || value === void 0) continue;
		if (merger && merger(object, key, value, namespace)) continue;
		if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
		else if (isPlainObject(value) && isPlainObject(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
		else object[key] = value;
	}
	return object;
}
function createDefu(merger) {
	return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
var defu = createDefu();
// node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
	if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
		warnKeyDropped(key);
		return;
	}
	return value;
}
function warnKeyDropped(key) {
	console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
	if (typeof value !== "string") return value;
	if (value[0] === "\"" && value[value.length - 1] === "\"" && value.indexOf("\\") === -1) return value.slice(1, -1);
	const _value = value.trim();
	if (_value.length <= 9) switch (_value.toLowerCase()) {
		case "true": return true;
		case "false": return false;
		case "undefined": return;
		case "null": return null;
		case "nan": return NaN;
		case "infinity": return Number.POSITIVE_INFINITY;
		case "-infinity": return Number.NEGATIVE_INFINITY;
	}
	if (!JsonSigRx.test(value)) {
		if (options.strict) throw new SyntaxError("[destr] Invalid JSON");
		return value;
	}
	try {
		if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
			if (options.strict) throw new Error("[destr] Possible prototype pollution");
			return JSON.parse(value, jsonParseTransform);
		}
		return JSON.parse(value);
	} catch (error) {
		if (options.strict) throw error;
		return value;
	}
}
// node_modules/h3/dist/index.mjs
function hasProp(obj, prop) {
	try {
		return prop in obj;
	} catch {
		return false;
	}
}
var H3Error = class extends Error {
	static __h3_error__ = true;
	statusCode = 500;
	fatal = false;
	unhandled = false;
	statusMessage;
	data;
	cause;
	constructor(message, opts = {}) {
		super(message, opts);
		if (opts.cause && !this.cause) this.cause = opts.cause;
	}
	toJSON() {
		const obj = {
			message: this.message,
			statusCode: sanitizeStatusCode(this.statusCode, 500)
		};
		if (this.statusMessage) obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
		if (this.data !== void 0) obj.data = this.data;
		return obj;
	}
};
function createError$1(input) {
	if (typeof input === "string") return new H3Error(input);
	if (isError(input)) return input;
	const err = new H3Error(input.message ?? input.statusMessage ?? "", { cause: input.cause || input });
	if (hasProp(input, "stack")) try {
		Object.defineProperty(err, "stack", { get() {
			return input.stack;
		} });
	} catch {
		try {
			err.stack = input.stack;
		} catch {}
	}
	if (input.data) err.data = input.data;
	if (input.statusCode) err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
	else if (input.status) err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
	if (input.statusMessage) err.statusMessage = input.statusMessage;
	else if (input.statusText) err.statusMessage = input.statusText;
	if (err.statusMessage) {
		const originalMessage = err.statusMessage;
		if (sanitizeStatusMessage(err.statusMessage) !== originalMessage) console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
	}
	if (input.fatal !== void 0) err.fatal = input.fatal;
	if (input.unhandled !== void 0) err.unhandled = input.unhandled;
	return err;
}
function isError(input) {
	return input?.constructor?.__h3_error__ === true;
}
var DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
	return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
	if (!statusCode) return defaultStatusCode;
	if (typeof statusCode === "string") statusCode = Number.parseInt(statusCode, 10);
	if (statusCode < 100 || statusCode > 999) return defaultStatusCode;
	return statusCode;
}
globalThis.Headers;
globalThis.Response;
// node_modules/nuxt/dist/app/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError = (error) => {
	if (isNuxtError(error)) return error;
	if (typeof error !== "string" && error?.statusText) error.message ??= error.statusText;
	const nuxtError = createError$1(error ?? {});
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
/** An error raised deliberately with an HTTP status, as h3 recognises one. */
function isHTTPError(value) {
	return value instanceof Error && value.constructor?.__h3_error__ === true;
}
/**
* Wrap whatever the app threw. Anything other than an HTTP error is marked `unhandled`,
* which keeps its message and `data` out of the response and the payload. In development
* the thrown value and where the app was are remembered for the error report.
*
* @internal
*/
function createErrorFromThrown(thrown, context) {
	const error = createError(thrown);
	if (error !== thrown && !isHTTPError(thrown)) error.unhandled = true;
	return error;
}
// node_modules/nuxt/dist/app/utils.js
var PROBE_BASE_A = "https://a.invalid/probe/";
var PROBE_BASE_B = "https://b.invalid/probe/";
function parseAnchorURL(value, base = PROBE_BASE_A) {
	try {
		return new URL(value, base);
	} catch {
		return null;
	}
}
function resolvesWithoutBase(value) {
	const resolved = parseAnchorURL(value);
	return !!resolved && resolved.href === parseAnchorURL(value, PROBE_BASE_B)?.href;
}
/** Whether a URL string is a path rooted at the current origin, so carries no protocol. */
function isRootedPath(value) {
	if (value[0] !== "/" || value[1] === "/" || value[1] === "\\") return false;
	return value[1] !== "	" && value[1] !== "\n" && value[1] !== "\r" || !resolvesWithoutBase(value);
}
/** Whether a URL string carries its own protocol or authority. */
function isAbsoluteHref(value) {
	return !!value && !isRootedPath(value) && resolvesWithoutBase(value);
}
/** The script-capable protocol a URL string would navigate to, or `null` when it is safe. */
function getScriptProtocol(value) {
	if (!value || isRootedPath(value)) return null;
	let resolved = parseAnchorURL(value.replace(/[\u0000-\u001F\u007F\s]+/g, ""));
	while (resolved?.protocol === "view-source:") resolved = parseAnchorURL(resolved.pathname);
	if (!resolved) return "";
	return isScriptProtocol(resolved.protocol) ? resolved.protocol : null;
}
/** Returns the value unchanged when safe to use as an anchor `href`, or `null`. */
function sanitizeAnchorHref(value) {
	return getScriptProtocol(value) === null ? value : null;
}
var BOT_RE = /bot\b|chrome-lighthouse|facebookexternalhit|google\b/i;
function isBotUserAgent(userAgent) {
	return BOT_RE.test(userAgent);
}
// node_modules/nuxt/dist/app/components/injections.js
var LayoutMetaSymbol = Symbol("layout-meta");
var LayoutSymbol = Symbol("layout");
var PageRouteSymbol = Symbol("route");
// node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = (() => {
	return useNuxtApp()?.$router;
});
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function getParentScope(scope) {
	const internal = scope;
	return internal.parent ?? internal.subs?.sub;
}
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = getParentScope(scope);
	}
	return false;
}
/** @since 3.0.0 */
var useRoute$1 = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
function navigateTo(to, options) {
	to ||= "/";
	const isPathForm = typeof to === "string" || "path" in to;
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	if (options?.open) {
		const protocol = getScriptProtocol(toPath);
		if (protocol !== null) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
		const openPath = isPathForm && !isAbsoluteHref(toPath) && !toPath.startsWith("#") ? joinURL((/* @__PURE__ */ useRuntimeConfig$1()).app.baseURL, toPath) : toPath;
		const { target = "_blank", windowFeatures = {} } = options.open;
		const features = [];
		for (const [feature, value] of Object.entries(windowFeatures)) if (value !== void 0) features.push(`${feature.toLowerCase()}=${value}`);
		open(openPath, target, features.join(", "));
		return Promise.resolve();
	}
	const isExternalHost = isAbsoluteHref(toPath);
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const protocol = getScriptProtocol(toPath);
		if (protocol !== null) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	if (!isExternal && inMiddleware) {
		if (options?.replace) {
			if (typeof to === "string") {
				const { pathname, search, hash } = parseURL$1(to);
				return {
					path: pathname,
					...search && { query: parseQuery$1(search) },
					...hash && { hash },
					replace: true
				};
			}
			return {
				...to,
				replace: true
			};
		}
		return to;
	}
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (isExternal) {
		nuxtApp._cookieWriters?.forEach((write) => write());
		window.addEventListener("pagehide", (event) => {
			if (!event.persisted) nuxtApp._scope.stop();
		}, { once: true });
		if (options?.replace) location.replace(toPath);
		else location.href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
}
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL$1(url);
	return encodeVueRouterPath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
var ENC_PIPE_RE$1 = /%7C/g;
var ENC_BRACKET_OPEN_RE$1 = /%5B/g;
var ENC_BRACKET_CLOSE_RE$1 = /%5D/g;
var ENC_ENC_SLASH_RE = /%252F/gi;
var HASH_RE$1 = /#/g;
var QUESTION_MARK_RE = /\?/g;
/**
* Apply vue-router's own path encoding, which leaves sub-delimiters like `&`
* and `+` literal. This must stay in sync with `encodeVueRouterPath` in
* `unrouting`, which encodes the route records we need to match against.
*/
function encodeVueRouterPath(value) {
	return encodeURI(value).replace(ENC_PIPE_RE$1, "|").replace(ENC_BRACKET_OPEN_RE$1, "[").replace(ENC_BRACKET_CLOSE_RE$1, "]").replace(HASH_RE$1, "%23").replace(QUESTION_MARK_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F");
}
// node_modules/nuxt/dist/app/composables/error.js
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => /* @__PURE__ */ toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError(error);
	try {
		const error = /* @__PURE__ */ useError();
		useNuxtApp().hooks.callHook("app:error", nuxtError);
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/**
* Notify the app of an error caught for a crawler without rendering the error
* page, so the bot indexes the server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _notifyCrawlerError = (nuxtApp, error) => {
	const result = nuxtApp.callHook("app:error", createErrorFromThrown(error));
	appDiagnostics.NUXT_E1012({
		userAgent: navigator.userAgent,
		cause: error
	});
	return result;
};
/**
* Show the error page unless the current client is a crawler, in which case the
* bot receives the already server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _showErrorUnlessCrawler = async (nuxtApp, error) => {
	if (isBotUserAgent(navigator.userAgent)) {
		await _notifyCrawlerError(nuxtApp, error);
		return;
	}
	await nuxtApp.runWithContext(() => showError(createErrorFromThrown(error)));
};
/** @since 3.0.0 */
var clearError = async (options = {}) => {
	const nuxtApp = useNuxtApp();
	const error = /* @__PURE__ */ useError();
	nuxtApp.callHook("app:error:cleared", options);
	if (options.redirect) await useRouter().replace(options.redirect);
	error.value = void 0;
};
// node_modules/ofetch/dist/shared/ofetch.CWycOUEr.mjs
var FetchError = class extends Error {
	constructor(message, opts) {
		super(message, opts);
		this.name = "FetchError";
		if (opts?.cause && !this.cause) this.cause = opts.cause;
	}
};
function createFetchError(ctx) {
	const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
	const method = ctx.request?.method || ctx.options?.method || "GET";
	const url = ctx.request?.url || String(ctx.request) || "/";
	const fetchError = new FetchError(`${`[${method}] ${JSON.stringify(url)}`}: ${ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>"}${errorMessage ? ` ${errorMessage}` : ""}`, ctx.error ? { cause: ctx.error } : void 0);
	for (const key of [
		"request",
		"options",
		"response"
	]) Object.defineProperty(fetchError, key, { get() {
		return ctx[key];
	} });
	for (const [key, refKey] of [
		["data", "_data"],
		["status", "status"],
		["statusCode", "status"],
		["statusText", "statusText"],
		["statusMessage", "statusText"]
	]) Object.defineProperty(fetchError, key, { get() {
		return ctx.response && ctx.response[refKey];
	} });
	return fetchError;
}
var payloadMethods = new Set(Object.freeze([
	"PATCH",
	"POST",
	"PUT",
	"DELETE"
]));
function isPayloadMethod(method = "GET") {
	return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	if (value instanceof FormData || value instanceof URLSearchParams) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
var textTypes = /* @__PURE__ */ new Set([
	"image/svg",
	"application/xml",
	"application/xhtml",
	"application/html"
]);
var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
	if (!_contentType) return "json";
	const contentType = _contentType.split(";").shift() || "";
	if (JSON_RE.test(contentType)) return "json";
	if (contentType === "text/event-stream") return "stream";
	if (textTypes.has(contentType) || contentType.startsWith("text/")) return "text";
	return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
	const headers = mergeHeaders(input?.headers ?? request?.headers, defaults?.headers, Headers);
	let query;
	if (defaults?.query || defaults?.params || input?.params || input?.query) query = {
		...defaults?.params,
		...defaults?.query,
		...input?.params,
		...input?.query
	};
	return {
		...defaults,
		...input,
		query,
		params: query,
		headers
	};
}
function mergeHeaders(input, defaults, Headers) {
	if (!defaults) return new Headers(input);
	const headers = new Headers(defaults);
	if (input) for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) headers.set(key, value);
	return headers;
}
async function callHooks(context, hooks) {
	if (hooks) {
		if (Array.isArray(hooks)) for (const hook of hooks) await hook(context);
		else await hooks(context);
	}
}
var retryStatusCodes = /* @__PURE__ */ new Set([
	408,
	409,
	425,
	429,
	500,
	502,
	503,
	504
]);
var nullBodyResponses = /* @__PURE__ */ new Set([
	101,
	204,
	205,
	304
]);
function createFetch(globalOptions = {}) {
	const { fetch = globalThis.fetch, Headers = globalThis.Headers, AbortController = globalThis.AbortController } = globalOptions;
	async function onError(context) {
		const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
		if (context.options.retry !== false && !isAbort) {
			let retries;
			if (typeof context.options.retry === "number") retries = context.options.retry;
			else retries = isPayloadMethod(context.options.method) ? 0 : 1;
			const responseCode = context.response && context.response.status || 500;
			if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
				const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
				if (retryDelay > 0) await new Promise((resolve) => setTimeout(resolve, retryDelay));
				return $fetchRaw(context.request, {
					...context.options,
					retry: retries - 1
				});
			}
		}
		const error = createFetchError(context);
		if (Error.captureStackTrace) Error.captureStackTrace(error, $fetchRaw);
		throw error;
	}
	const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
		const context = {
			request: _request,
			options: resolveFetchOptions(_request, _options, globalOptions.defaults, Headers),
			response: void 0,
			error: void 0
		};
		if (context.options.method) context.options.method = context.options.method.toUpperCase();
		if (context.options.onRequest) {
			await callHooks(context, context.options.onRequest);
			if (!(context.options.headers instanceof Headers)) context.options.headers = new Headers(context.options.headers || {});
		}
		if (typeof context.request === "string") {
			if (context.options.baseURL) context.request = withBase(context.request, context.options.baseURL);
			if (context.options.query) {
				context.request = withQuery(context.request, context.options.query);
				delete context.options.query;
			}
			if ("query" in context.options) delete context.options.query;
			if ("params" in context.options) delete context.options.params;
		}
		if (context.options.body && isPayloadMethod(context.options.method)) {
			if (isJSONSerializable(context.options.body)) {
				const contentType = context.options.headers.get("content-type");
				if (typeof context.options.body !== "string") context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(context.options.body).toString() : JSON.stringify(context.options.body);
				if (!contentType) context.options.headers.set("content-type", "application/json");
				if (!context.options.headers.has("accept")) context.options.headers.set("accept", "application/json");
			} else if ("pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || typeof context.options.body.pipe === "function") {
				if (!("duplex" in context.options)) context.options.duplex = "half";
			}
		}
		let abortTimeout;
		if (!context.options.signal && context.options.timeout) {
			const controller = new AbortController();
			abortTimeout = setTimeout(() => {
				const error = /* @__PURE__ */ new Error("[TimeoutError]: The operation was aborted due to timeout");
				error.name = "TimeoutError";
				error.code = 23;
				controller.abort(error);
			}, context.options.timeout);
			context.options.signal = controller.signal;
		}
		try {
			context.response = await fetch(context.request, context.options);
		} catch (error) {
			context.error = error;
			if (context.options.onRequestError) await callHooks(context, context.options.onRequestError);
			return await onError(context);
		} finally {
			if (abortTimeout) clearTimeout(abortTimeout);
		}
		if ((context.response.body || context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD") {
			const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
			switch (responseType) {
				case "json": {
					const data = await context.response.text();
					const parseFunction = context.options.parseResponse || destr;
					context.response._data = parseFunction(data);
					break;
				}
				case "stream":
					context.response._data = context.response.body || context.response._bodyInit;
					break;
				default: context.response._data = await context.response[responseType]();
			}
		}
		if (context.options.onResponse) await callHooks(context, context.options.onResponse);
		if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
			if (context.options.onResponseError) await callHooks(context, context.options.onResponseError);
			return await onError(context);
		}
		return context.response;
	};
	const $fetch = async function $fetch2(request, options) {
		return (await $fetchRaw(request, options))._data;
	};
	$fetch.raw = $fetchRaw;
	$fetch.native = (...args) => fetch(...args);
	$fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
		...globalOptions,
		...customGlobalOptions,
		defaults: {
			...globalOptions.defaults,
			...customGlobalOptions.defaults,
			...defaultOptions
		}
	});
	return $fetch;
}
// node_modules/ofetch/dist/index.mjs
var _globalThis = (function() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	throw new Error("unable to locate global object");
})();
var fetch$1 = _globalThis.fetch ? (...args) => _globalThis.fetch(...args) : () => Promise.reject(/* @__PURE__ */ new Error("[ofetch] global.fetch is not supported!"));
var Headers$1 = _globalThis.Headers;
var AbortController$1 = _globalThis.AbortController;
var $fetch$2 = createFetch({
	fetch: fetch$1,
	Headers: Headers$1,
	AbortController: AbortController$1
});
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnitro.client.mjs
var useRuntimeConfig = () => window?.__NUXT__?.config || window?.useNuxtApp?.().payload?.config;
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fpaths.mjs
var getAppConfig = () => useRuntimeConfig().app;
var baseURL = () => getAppConfig().baseURL;
var buildAssetsDir = () => getAppConfig().buildAssetsDir;
var buildAssetsURL = (...path) => joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
var publicAssetsURL = (...path) => {
	const appConfig = getAppConfig();
	const publicBase = appConfig.cdnURL || appConfig.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
};
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch$2.create({ baseURL: baseURL() });
var $fetch = globalThis.$fetch;
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
// node_modules/nuxt/dist/app/composables/server-prefetch.js
/** Client-side `onServerPrefetch`, which only keeps the component a `useId()` async boundary. */
function onServerPrefetch(target = getCurrentInstance()) {
	const instance = target;
	if (instance && !instance.sp) instance.sp = [];
}
// node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/unhead/dist/shared/unhead.CHEy9ana.mjs
function defineHeadPlugin(plugin, key) {
	if (key && typeof plugin === "function") plugin.key = key;
	return plugin;
}
// node_modules/unhead/dist/shared/unhead.DspMpm6y.mjs
var BACKSLASH_RE = /\\/g;
var LT_RE$1 = /</g;
var DOUBLE_QUOTE_RE = /"/g;
var TOKEN_RE = /%\w+(?:\.\w+)?/g;
var SepSub = "%separator";
function sub(p, token, isJson = false) {
	let val;
	if (token === "s" || token === "pageTitle") val = p.pageTitle;
	else if (token.includes(".")) {
		const dotIndex = token.indexOf(".");
		val = p[token.substring(0, dotIndex)]?.[token.substring(dotIndex + 1)];
	} else val = p[token];
	if (val !== void 0) {
		const str = typeof val === "number" ? String(val) : String(val || "");
		return isJson ? str.replace(BACKSLASH_RE, "\\\\").replace(LT_RE$1, "\\u003C").replace(DOUBLE_QUOTE_RE, "\\\"") : str;
	}
}
function processTemplateParams(s, p, sep, isJson = false) {
	if (typeof s !== "string" || !s.includes("%")) return s;
	let decoded = s;
	try {
		decoded = decodeURI(s);
	} catch {}
	const tokens = decoded.match(TOKEN_RE);
	if (!tokens) return s;
	const hasSepSub = s.includes(SepSub);
	s = s.replace(TOKEN_RE, (token) => {
		if (token === SepSub || !tokens.includes(token)) return token;
		const re = sub(p, token.slice(1), isJson);
		return re !== void 0 ? re : token;
	}).trim();
	if (hasSepSub) s = s.split(SepSub).map((part) => part.trim()).filter((part) => part !== "").join(sep ? ` ${sep} ` : " ");
	return s;
}
// node_modules/unhead/dist/shared/unhead.D9VfQWNo.mjs
var sortTags$1 = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
var formatKey = (k) => !k.includes(":key") ? k.split(":").join(":key:") : k;
var AliasSortingPlugin = /* @__PURE__ */ defineHeadPlugin({
	key: "aliasSorting",
	hooks: { "tags:resolve": (ctx) => {
		let m = false;
		for (const t of ctx.tags) {
			const p = t.tagPriority;
			if (!p) continue;
			const s = String(p);
			if (s.startsWith("before:")) {
				const k = formatKey(s.slice(7));
				const l = ctx.tagMap.get(k);
				if (l) {
					if (typeof l.tagPriority === "number") t.tagPriority = l.tagPriority;
					t._p = l._p - 1;
					m = true;
				}
			} else if (s.startsWith("after:")) {
				const k = formatKey(s.slice(6));
				const l = ctx.tagMap.get(k);
				if (l) {
					if (typeof l.tagPriority === "number") t.tagPriority = l.tagPriority;
					t._p = l._p + 1;
					m = true;
				}
			}
		}
		if (m) ctx.tags = ctx.tags.sort(sortTags$1);
	} }
});
var DeprecationsPlugin = /* @__PURE__ */ defineHeadPlugin({
	key: "deprecations",
	hooks: { "entries:normalize": ({ tags }) => {
		for (const tag of tags) {
			if (tag.props.children) {
				tag.innerHTML = tag.props.children;
				delete tag.props.children;
			}
			if (tag.props.hid) {
				tag.key = tag.props.hid;
				delete tag.props.hid;
			}
			if (tag.props.vmid) {
				tag.key = tag.props.vmid;
				delete tag.props.vmid;
			}
			if ("body" in tag.props) {
				if (tag.props.body) tag.tagPosition = "bodyClose";
				delete tag.props.body;
			}
			if (tag.props.renderPriority != null) {
				tag.tagPriority = tag.props.renderPriority;
				delete tag.props.renderPriority;
			}
		}
	} }
});
function isThenable(v) {
	return typeof v?.then === "function";
}
var maxSyncPrefix = 256;
function walkArrayPromises(v, index) {
	if (index === v.length) return;
	if (index === maxSyncPrefix) {
		const values2 = new Array(v.length);
		let hasThenable = false;
		for (; index < v.length; index++) {
			const value2 = walkPromises(v[index]);
			values2[index] = value2;
			hasThenable ||= isThenable(value2);
		}
		return hasThenable ? values2 : void 0;
	}
	const value = walkPromises(v[index]);
	if (isThenable(value)) {
		const values2 = new Array(v.length);
		values2[index] = value;
		for (let rest = index + 1; rest < v.length; rest++) values2[rest] = walkPromises(v[rest]);
		return values2;
	}
	const values = walkArrayPromises(v, index + 1);
	if (values) values[index] = value;
	return values;
}
function walkObjectPromises(v, keys, index) {
	if (index === keys.length) return;
	if (index === maxSyncPrefix) {
		const values2 = new Array(keys.length);
		let hasThenable = false;
		for (; index < keys.length; index++) {
			const value2 = walkPromises(v[keys[index]]);
			values2[index] = value2;
			hasThenable ||= isThenable(value2);
		}
		return hasThenable ? values2 : void 0;
	}
	const value = walkPromises(v[keys[index]]);
	if (isThenable(value)) {
		const values2 = new Array(keys.length);
		values2[index] = value;
		for (let rest = index + 1; rest < keys.length; rest++) values2[rest] = walkPromises(v[keys[rest]]);
		return values2;
	}
	const values = walkObjectPromises(v, keys, index + 1);
	if (values) values[index] = value;
	return values;
}
function walkPromises(v) {
	if (typeof v === "function") return v;
	if (isThenable(v)) return Promise.resolve(v).then(walkPromises);
	if (Array.isArray(v)) {
		const values = walkArrayPromises(v, 0);
		return values ? Promise.all(values) : v;
	}
	if (v?.constructor === Object) {
		const keys = Object.keys(v);
		const values = walkObjectPromises(v, keys, 0);
		if (values) return Promise.all(values).then((resolved) => Object.fromEntries(keys.map((key, index) => [key, resolved[index]])));
	}
	return v;
}
var PromisesPlugin = /* @__PURE__ */ defineHeadPlugin((head) => {
	const pending = /* @__PURE__ */ new WeakMap();
	return {
		key: "promises",
		hooks: { "entries:resolve": (ctx) => {
			for (let index = ctx.entries.length - 1; index >= 0; index--) {
				const entry = ctx.entries[index];
				const input = entry.input;
				if (pending.get(entry) === input) {
					ctx.entries.splice(index, 1);
					continue;
				}
				const result = walkPromises(input);
				if (!isThenable(result)) {
					pending.delete(entry);
					continue;
				}
				pending.set(entry, input);
				ctx.entries.splice(index, 1);
				Promise.resolve(result).then((resolved) => {
					if (pending.get(entry) !== input) return;
					pending.delete(entry);
					entry.input = resolved;
					delete entry._tags;
					head.invalidate?.();
				}, () => {
					if (pending.get(entry) === input) pending.delete(entry);
				});
			}
		} }
	};
}, "promises");
var SupportedAttrs = {
	meta: "content",
	link: "href",
	htmlAttrs: "lang"
};
var contentAttrs = ["innerHTML", "textContent"];
function processIfNeeded(value, params, separator, isJson = false) {
	return typeof value === "string" && value.includes("%") ? processTemplateParams(value, params, separator, isJson) : value;
}
var TemplateParamsPlugin = /* @__PURE__ */ defineHeadPlugin((head) => {
	return {
		key: "template-params",
		hooks: {
			"tags:resolve": ({ tagMap, tags }) => {
				const params = tagMap.get("templateParams")?.props || {};
				const sep = params.separator || "|";
				delete params.separator;
				params.pageTitle = processIfNeeded(params.pageTitle || head._title || "", params, sep);
				for (const tag of tags) {
					if (tag.processTemplateParams === false) continue;
					const v = SupportedAttrs[tag.tag];
					if (v && typeof tag.props[v] === "string") tag.props[v] = processIfNeeded(tag.props[v], params, sep);
					else if (tag.processTemplateParams || tag.tag === "titleTemplate" || tag.tag === "title") {
						for (const p of contentAttrs) if (typeof tag[p] === "string") tag[p] = processIfNeeded(tag[p], params, sep, tag.tag === "script" && typeof tag.props.type === "string" && tag.props.type.endsWith("json"));
					}
				}
				head._templateParams = params;
				head._separator = sep;
			},
			"tags:afterResolve": ({ tagMap }) => {
				const title = tagMap.get("title");
				if (title?.textContent && title.processTemplateParams !== false) title.textContent = processIfNeeded(title.textContent, head._templateParams, head._separator);
			}
		}
	};
}, "template-params");
// node_modules/unhead/dist/shared/unhead.CGPOfp5O.mjs
var DupeableTags = /* @__PURE__ */ new Set([
	"link",
	"style",
	"script",
	"noscript"
]);
var TagsWithInnerContent = /* @__PURE__ */ new Set([
	"title",
	"titleTemplate",
	"script",
	"style",
	"noscript"
]);
var HasElementTags = /* @__PURE__ */ new Set([
	"base",
	"meta",
	"link",
	"style",
	"script",
	"noscript"
]);
var ValidHeadTags = /* @__PURE__ */ new Set([
	"title",
	"base",
	"htmlAttrs",
	"bodyAttrs",
	"meta",
	"link",
	"style",
	"script",
	"noscript"
]);
var UniqueTags = /* @__PURE__ */ new Set([
	"base",
	"title",
	"titleTemplate",
	"bodyAttrs",
	"htmlAttrs",
	"templateParams"
]);
var TagConfigKeys = /* @__PURE__ */ new Set([
	"key",
	"tagPosition",
	"tagPriority",
	"tagDuplicateStrategy",
	"innerHTML",
	"textContent",
	"processTemplateParams"
]);
var UsesMergeStrategy = /* @__PURE__ */ new Set([
	"templateParams",
	"htmlAttrs",
	"bodyAttrs"
]);
var MetaTagsArrayable = /* @__PURE__ */ new Set([
	"theme-color",
	"google-site-verification",
	"author",
	"og:locale:alternate",
	"og:image",
	"og:video",
	"og:audio",
	"article:author",
	"article:tag",
	"book:author",
	"book:tag",
	"twitter:image"
]);
var TagPriorityAliases = {
	critical: -8,
	high: -1,
	low: 2
};
var hasContent = (value) => typeof value === "number" ? Number.isFinite(value) : value;
// @__NO_SIDE_EFFECTS__
function isUnsafeKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}
// node_modules/unhead/dist/shared/unhead.Bm4Y6XQI.mjs
function createHooks(hooks) {
	const instance = new HookableCore();
	for (const key in hooks || {}) instance.hook(key, hooks[key]);
	return instance;
}
function callHook(head, hook, ctx) {
	if (!(head.hooks?._hooks?.[hook])?.length) return;
	return head.hooks?.callHook(hook, ctx);
}
// node_modules/unhead/dist/shared/unhead.DJuZwX9c.mjs
var META_NOREWRITE_RE = /^(?:viewport|description|keywords|robots)$/;
var META_KEY_ATTRS = [
	"name",
	"property",
	"http-equiv"
];
function isMetaArrayDupeKey(v) {
	const i = v.indexOf(":");
	if (i === -1) return false;
	const key = v.slice(i + 1);
	return MetaTagsArrayable.has(key) || key.startsWith("og:image:") || key.startsWith("og:video:") || key.startsWith("og:audio:") || key.startsWith("twitter:image:");
}
function dedupeKey(tag) {
	const { props, tag: t, key } = tag;
	if (UniqueTags.has(t)) return t;
	if (t === "link") {
		if (props.rel === "canonical") return "canonical";
		if (props.rel === "alternate" && props.hreflang) return `alternate:${props.hreflang}`;
	}
	if (props.charset) return "charset";
	if (t === "meta") for (const n of META_KEY_ATTRS) {
		const v = props[n];
		if (v !== void 0) return `meta:${v}${(typeof v !== "string" || !v.includes(":")) && !META_NOREWRITE_RE.test(v) && key ? `:key:${key}` : ""}`;
	}
	if (key) return `${t}:key:${key}`;
	if (props.id) return `${t}:id:${props.id}`;
	if (t === "link" && props.rel && props.href) return `link:${props.rel}:${props.href}`;
	return TagsWithInnerContent.has(t) && (tag.textContent || tag.innerHTML) ? `${t}:content:${tag.textContent || tag.innerHTML}` : void 0;
}
function hashTag(tag) {
	const identity = tag._h || tag._d || tag.textContent || tag.innerHTML;
	if (identity) return String(identity);
	const keys = Object.keys(tag.props).sort();
	let hash = `${tag.tag}:`;
	let separator = "";
	for (const key of keys) {
		hash += `${separator}${key}:${String(tag.props[key])}`;
		separator = ",";
	}
	return hash;
}
function walkResolver(val, resolve, key) {
	if (key === "_resolver") return val;
	if (typeof val === "function" && (!key || key !== "titleTemplate" && !key.startsWith("on"))) val = val();
	const v = resolve ? resolve(key, val) : val;
	if (Array.isArray(v)) {
		let out;
		for (let i = 0; i < v.length; i++) {
			const r = walkResolver(v[i], resolve);
			if (out) out[i] = r;
			else if (r !== v[i]) {
				out = v.slice(0, i);
				out[i] = r;
			}
		}
		return out || v;
	}
	if (v?.constructor === Object) {
		let next;
		for (const k in v) {
			const unsafe = /* @__PURE__ */ isUnsafeKey(k);
			const r = unsafe ? void 0 : walkResolver(v[k], resolve, k);
			if (!next && (unsafe || r !== v[k])) {
				next = {};
				for (const pk in v) {
					if (pk === k) break;
					next[pk] = v[pk];
				}
			}
			if (next && !unsafe) next[k] = r;
		}
		return next || v;
	}
	return v;
}
var INVALID_ATTR_NAME_RE = /[\s"'<>/=\x00-\x1F\x7F]/;
function normalizeStyleClassProps(key, value) {
	const isStyle = key === "style";
	const store = isStyle ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
	const add = (v) => {
		if (!v) return;
		if (isStyle) {
			const i = v.indexOf(":");
			i > 0 && store.set(v.slice(0, i).trim(), v.slice(i + 1).trim());
		} else v.split(" ").forEach((c) => c && store.add(c));
	};
	if (typeof value === "string") (isStyle ? value.split(";") : [value]).forEach(add);
	else if (Array.isArray(value)) value.forEach(add);
	else if (value && typeof value === "object") for (const k in value) {
		const v = value[k];
		v && v !== "false" && (isStyle ? store.set(k.trim(), String(v)) : add(k));
	}
	return store;
}
function normalizeProps(tag, input) {
	tag.props = tag.props || {};
	if (!input) return tag;
	if (tag.tag === "templateParams") {
		tag.props = input;
		return tag;
	}
	const isHtmlTag = HasElementTags.has(tag.tag) || tag.tag === "htmlAttrs" || tag.tag === "bodyAttrs";
	for (const prop in input) {
		if (/* @__PURE__ */ isUnsafeKey(prop)) continue;
		const isData = prop.startsWith("data-");
		const isHtmlAttr = isHtmlTag && !TagConfigKeys.has(prop);
		const key = isHtmlAttr && !isData ? prop.toLowerCase() : prop;
		if (isHtmlAttr && (!key || INVALID_ATTR_NAME_RE.test(key))) continue;
		const value = input[prop];
		if (value === null) tag.props[key] = null;
		else if (prop === "class" || prop === "style") tag.props[prop] = normalizeStyleClassProps(prop, value);
		else if (TagConfigKeys.has(prop)) {
			if ((prop === "textContent" || prop === "innerHTML") && typeof value === "object") {
				const type = input.type || "application/json";
				if (type.endsWith("json") || type === "speculationrules" || type === "importmap") {
					tag.props.type = type;
					tag[prop] = JSON.stringify(value);
				}
			} else tag[prop] = value;
		} else if (value !== void 0) {
			const str = String(value);
			const isMeta = tag.tag === "meta" && key === "content";
			tag.props[key] = str === "true" || str === "" ? isData || isMeta ? str : true : !value && isData && str === "false" ? "false" : value;
		}
	}
	return tag;
}
function resolveHeadInput(input, propResolvers) {
	let resolve;
	if (propResolvers.length) {
		resolve = (key, val) => {
			for (let i = 0; i < propResolvers.length; i++) val = propResolvers[i](key, val);
			return val;
		};
		input = resolve(void 0, input);
	}
	return walkResolver(input, resolve);
}
function normalizeTag(tagName, _input) {
	const tag = normalizeProps({
		tag: tagName,
		props: {}
	}, typeof _input === "object" && typeof _input !== "function" ? _input : { [tagName === "script" || tagName === "noscript" || tagName === "style" ? "innerHTML" : "textContent"]: _input });
	if (tag.key && DupeableTags.has(tag.tag)) tag.props["data-hid"] = tag._h = tag.key;
	if (tag.tag === "script" && typeof tag.innerHTML === "object") {
		tag.innerHTML = JSON.stringify(tag.innerHTML);
		tag.props.type = tag.props.type || "application/json";
	}
	if (Array.isArray(tag.props.content)) {
		const tags = [];
		for (const content of tag.props.content) tags.push({
			...tag,
			props: {
				...tag.props,
				content
			}
		});
		return tags;
	}
	return tag;
}
function pushNormalizedTag(tags, tag) {
	if (Array.isArray(tag)) for (const t of tag) tags.push(t);
	else tags.push(tag);
}
function normalizeEntryToTags(input, propResolvers) {
	if (!input) return [];
	if (typeof input === "function") input = input();
	input = resolveHeadInput(input, propResolvers);
	const tags = [];
	for (const key in input) {
		const value = input[key];
		if (value !== void 0) {
			if (Array.isArray(value)) for (const v of value) pushNormalizedTag(tags, normalizeTag(key, v));
			else pushNormalizedTag(tags, normalizeTag(key, value));
		}
	}
	return tags;
}
var LT_RE = /</g;
var SCRIPT_END_RE = /<\/script/g;
var sortTags = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
var DEFAULT_TAG_WEIGHT = () => 100;
function isEmptyProps(props) {
	for (const _ in props) return false;
	return true;
}
var TAG_MUTATING_HOOK_RE = /^tags:|:render/;
function syncEntryHookCache(head, hooks) {
	const count = (hooks["entries:resolve"]?.length || 0) + (hooks["entries:normalize"]?.length || 0);
	if (head._h !== count) {
		head._h = count;
		for (const entry of head.entries.values()) delete entry._tags;
	}
}
function cloneTagsInPlace(tags) {
	for (let i = 0; i < tags.length; i++) {
		const t = tags[i];
		const props = { ...t.props };
		if (props.class instanceof Set) props.class = new Set(props.class);
		if (props.style instanceof Map) props.style = new Map(props.style);
		tags[i] = {
			...t,
			props
		};
	}
}
function valuesToTags(ctx, sortFlatMeta) {
	const tags = ctx.tags;
	let w = 0;
	for (const value of ctx.tagMap.values()) if (Array.isArray(value)) for (const tag of value) tags[w++] = tag;
	else tags[w++] = value;
	tags.length = w;
	if (sortFlatMeta) tags.sort(sortTags);
}
function dedupeTags(ctx) {
	let hasFlatMeta = false;
	for (const next of ctx.tags.sort(sortTags)) {
		const k = next._d || hashTag(next);
		if (!k) continue;
		const prev = ctx.tagMap.get(k);
		if (!prev) {
			ctx.tagMap.set(k, next);
			continue;
		}
		if ((next.tagDuplicateStrategy || (UsesMergeStrategy.has(next.tag) ? "merge" : null) || (next.key && next.key === prev.key ? "merge" : null)) === "merge") {
			const props = { ...prev.props };
			for (const p in next.props) props[p] = p === "style" ? new Map([...prev.props.style || /* @__PURE__ */ new Map(), ...next.props[p]]) : p === "class" ? /* @__PURE__ */ new Set([...prev.props.class || [], ...next.props[p]]) : next.props[p];
			ctx.tagMap.set(k, {
				...next,
				props
			});
		} else if (next._p >> 10 === prev._p >> 10 && next.tag === "meta" && isMetaArrayDupeKey(k)) {
			ctx.tagMap.set(k, Object.assign([...Array.isArray(prev) ? prev : [prev], next], next));
			hasFlatMeta = true;
		} else if (next._w === prev._w ? next._p > prev._p : next._w < prev._w) ctx.tagMap.set(k, next);
	}
	return hasFlatMeta;
}
function resolveTitleTemplate(ctx, head) {
	const title = ctx.tagMap.get("title");
	const tpl = ctx.tagMap.get("titleTemplate");
	head._title = title?.textContent;
	if (!tpl) return;
	const fn = tpl.textContent;
	head._titleTemplate = fn;
	if (!fn) return;
	let v = typeof fn === "function" ? fn(title?.textContent) : fn;
	if (typeof v === "string" && !head.plugins.has("template-params")) v = v.replace("%s", title?.textContent || "");
	if (title) v === null ? ctx.tagMap.delete("title") : ctx.tagMap.set("title", {
		...title,
		textContent: v
	});
	else ctx.tagMap.set("titleTemplate", {
		...tpl,
		tag: "title",
		textContent: v
	});
}
function sanitizeTagsInPlace(tags) {
	let w = 0;
	for (let t of tags) {
		const { innerHTML, tag, props } = t;
		if (!ValidHeadTags.has(tag) || isEmptyProps(props) && !hasContent(innerHTML) && !hasContent(t.textContent)) continue;
		if (tag === "meta") {
			if (!hasContent(props.content) && !props["http-equiv"] && !props.charset) continue;
		}
		if (tag === "script" && (innerHTML || t.textContent)) {
			const type = String(props.type);
			const isJsonLike = type.endsWith("json") || type === "importmap" || type === "speculationrules";
			const escape = (content) => isJsonLike ? (typeof content === "string" ? content : JSON.stringify(content)).replace(LT_RE, "\\u003C") : typeof content === "string" ? content.replace(SCRIPT_END_RE, "<\\/script") : content;
			t = { ...t };
			if (innerHTML) t.innerHTML = escape(innerHTML);
			if (t.textContent) t.textContent = escape(t.textContent);
			t._d = dedupeKey(t);
		}
		tags[w++] = t;
	}
	tags.length = w;
	return tags;
}
function resolveTags(head, options) {
	const weightFn = options?.tagWeight ?? head.resolvedOptions._tagWeight ?? DEFAULT_TAG_WEIGHT;
	const ctx = {
		tagMap: /* @__PURE__ */ new Map(),
		tags: []
	};
	const hooks = head.hooks?._hooks || {};
	syncEntryHookCache(head, hooks);
	for (const e of head.entries.values()) if (e._pending !== void 0) {
		e.input = e._pending;
		delete e._pending;
		delete e._tags;
		delete e._precomputedTags;
	}
	let entries;
	if (hooks["entries:resolve"]?.length || hooks["entries:normalize"]?.length) {
		entries = [...head.entries.values()];
		if (hooks["entries:resolve"]?.length) callHook(head, "entries:resolve", {
			entries,
			...ctx
		});
	}
	syncEntryHookCache(head, hooks);
	for (const e of entries || head.entries.values()) {
		let tags = e._tags;
		if (!tags) {
			if (e._precomputedTags && weightFn === head.resolvedOptions._tagWeight && !hooks["entries:normalize"]?.length && !hooks["entries:resolve"]?.length && (!e.options || isEmptyProps(e.options))) tags = e._precomputedTags;
			else {
				tags = normalizeEntryToTags(e.input, head.resolvedOptions.propResolvers || []);
				if (e.options && !isEmptyProps(e.options)) for (const t of tags) Object.assign(t, e.options);
				if (hooks["entries:normalize"]?.length) {
					const normalizeCtx = {
						tags,
						entry: e
					};
					callHook(head, "entries:normalize", normalizeCtx);
					tags = normalizeCtx.tags;
				}
				for (let i = 0; i < tags.length; i++) {
					const t = tags[i];
					t._w = weightFn(t);
					t._p = (e._i << 10) + i;
					t._d = dedupeKey(t);
					if (!t._d) t._h = hashTag(t);
				}
				e._tags = tags;
			}
		}
		ctx.tags.push(...tags);
	}
	for (const name in hooks) if (hooks[name]?.length && TAG_MUTATING_HOOK_RE.test(name)) {
		cloneTagsInPlace(ctx.tags);
		break;
	}
	const hasFlatMeta = dedupeTags(ctx);
	resolveTitleTemplate(ctx, head);
	valuesToTags(ctx, hasFlatMeta);
	callHook(head, "tags:beforeResolve", ctx);
	callHook(head, "tags:resolve", ctx);
	callHook(head, "tags:afterResolve", ctx);
	return sanitizeTagsInPlace(ctx.tags);
}
// node_modules/@unhead/vue/dist/shared/vue.DKb5ZKVl.mjs
var headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function injectHead$1() {
	if (hasInjectionContext()) {
		const instance = inject(headSymbol);
		if (instance) return instance;
	}
	throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
	return { install(app) {
		app.config.globalProperties.$unhead = head;
		app.config.globalProperties.$head = head;
		app.provide(headSymbol, head);
	} }.install;
}
// node_modules/@unhead/vue/dist/shared/vue.D2XR8FqS.mjs
var VueResolver = /* @__PURE__ */ Object.assign((_, value) => /* @__PURE__ */ isRef(value) ? toValue(value) : value, { _static: true });
// node_modules/@unhead/vue/dist/shared/vue.CXwiCT15.mjs
function useHead$1(input, options = {}) {
	const head = options.head || /* @__PURE__ */ injectHead$1();
	return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
	const scope = getCurrentScope();
	if (scope && !scope.active) return {
		patch() {},
		dispose() {},
		_i: -1
	};
	const deactivated = /* @__PURE__ */ ref(false);
	if (options.onRendered && scope) {
		const _onRendered = options.onRendered;
		options = {
			...options,
			onRendered: (ctx) => scope.run(() => _onRendered(ctx))
		};
	}
	let entry;
	watchEffect(() => {
		const i = deactivated.value ? {} : walkResolver(input, VueResolver);
		if (entry) entry.patch(i);
		else entry = head.push(i, options);
	});
	if (getCurrentInstance()) {
		onBeforeUnmount(() => {
			entry.dispose();
		});
		onDeactivated(() => {
			deactivated.value = true;
		});
		onActivated(() => {
			deactivated.value = false;
		});
	} else if (scope) onScopeDispose(() => entry.dispose());
	return entry;
}
// node_modules/unhead/dist/shared/unhead.D7HkBzZn.mjs
function registerPlugin(head, p) {
	if (typeof p === "function" && p.key && head.plugins.has(p.key)) return;
	const plugin = typeof p === "function" ? p(head) : p;
	const key = plugin.key || String(head.plugins.size + 1);
	if (!head.plugins.get(key)) {
		head.plugins.set(key, plugin);
		for (const k in plugin.hooks || {}) head.hooks?.hook(k, plugin.hooks[k]);
	}
}
// @__NO_SIDE_EFFECTS__
function createUnhead(renderer, resolvedOptions = {}) {
	const ssr = !resolvedOptions.document;
	const entries = /* @__PURE__ */ new Map();
	const head = {
		_entryCount: 1,
		_h: 0,
		plugins: /* @__PURE__ */ new Map(),
		resolvedOptions,
		ssr,
		entries,
		hooks: void 0,
		render: () => renderer(head),
		use: (p) => registerPlugin(head, p),
		push(input, _options) {
			const _i = _options?._index ?? head._entryCount++;
			const options = _options ? { ..._options } : {};
			delete options.head;
			delete options.onRendered;
			delete options._index;
			const entry = {
				_i,
				input,
				options
			};
			entries.set(_i, entry);
			return {
				_i,
				dispose() {
					entries.delete(_i);
				},
				patch(input2) {
					if (ssr) {
						entry.input = input2;
						delete entry._tags;
					} else entry._pending = input2;
					if (!entries.has(_i)) entries.set(_i, entry);
				}
			};
		}
	};
	resolvedOptions.init?.forEach((e) => e && head.push(e));
	return head;
}
// node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject("usehead");
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead(input, options = {}) {
	return useHead$1(input, {
		head: options.head || injectHead(options.nuxt),
		...options
	});
}
// node_modules/nuxt/dist/app/diagnostics/state.js
/**
* E7xxx
* Payload / state / cookie runtime diagnostics.
*/
var stateDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = () => ({});
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					const handleSettle = (e) => {
						link.removeEventListener("load", handleSettle);
						link.removeEventListener("error", handleSettle);
						if (e.type === "error") rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`));
						else res(e);
					};
					link.addEventListener("load", handleSettle);
					link.addEventListener("error", handleSettle);
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// node_modules/nuxt/dist/app/composables/manifest.js
var $fetch$1$1 = $fetch;
function routeRulesMatcher$1(path) {
	return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default(path);
}
var manifest;
function fetchManifest() {
	let _manifest;
	_manifest = $fetch$1$1(buildAssetsURL(`builds/meta/${(/* @__PURE__ */ useRuntimeConfig$1()).app.buildId}.json`), { responseType: "json" }).then((res) => {
		if (!res || typeof res !== "object" || !Array.isArray(res.prerendered)) throw manifestDiagnostics.NUXT_E5004();
		return res;
	});
	manifest = _manifest;
	_manifest.catch((e) => {
		if (manifest === _manifest) manifest = void 0;
		manifestDiagnostics.NUXT_E5002({ cause: e });
	});
	return _manifest;
}
/** @since 3.7.4 */
function getAppManifest() {
	return manifest || fetchManifest();
}
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher$1(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
// node_modules/devalue/src/constants.js
var MAX_ARRAY_LEN = 2 ** 32 - 1;
var MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
// node_modules/devalue/src/utils.js
/** @param {number} n */
function is_valid_array_index(n) {
	if (!Number.isInteger(n)) return false;
	if (n < 0) return false;
	if (n > MAX_ARRAY_INDEX) return false;
	return true;
}
/** @param {number} n */
function is_valid_array_len(n) {
	if (!Number.isInteger(n)) return false;
	if (n < 0) return false;
	if (n > MAX_ARRAY_LEN) return false;
	return true;
}
// node_modules/devalue/src/base64.js
/**	@type {(base64: string) => ArrayBuffer} */
function decode_native(base64) {
	return Uint8Array.fromBase64(base64).buffer;
}
/**	@type {(base64: string) => ArrayBuffer} */
function decode_buffer(base64) {
	return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
/**	@type {(base64: string) => ArrayBuffer} */
function decode_legacy(base64) {
	const binary_string = atob(base64);
	const len = binary_string.length;
	const array = new Uint8Array(len);
	for (let i = 0; i < len; i++) array[i] = binary_string.charCodeAt(i);
	return array.buffer;
}
var native = typeof Uint8Array.fromBase64 === "function";
var buffer = typeof process === "object" && process.versions?.node !== void 0;
var decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
// node_modules/devalue/src/operations.js
/**
* Merges caller-provided operation overrides over the defaults. Iterating the
* default keys (rather than the override's own keys) means nullish members
* fall back to the default, and inherited members — e.g. from a class
* instance — are picked up.
*
* @template {Record<string, any>} T
* @param {T} defaults
* @param {Partial<T> | undefined} overrides
* @returns {T}
*/
function merge_operations(defaults, overrides) {
	if (!overrides) return defaults;
	const merged = {};
	for (const key of Object.keys(defaults)) merged[key] = overrides[key] ?? defaults[key];
	return merged;
}
var array_buffer_byte_length = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength")?.get;
var shared_array_buffer_byte_length = typeof SharedArrayBuffer === "undefined" ? void 0 : Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength")?.get;
var default_parse_operations = /* @__PURE__ */ Object.freeze({
	fromPrimitive: (primitive) => primitive,
	fromISOString: (iso) => new Date(iso),
	fromStringValue: (tag, text) => {
		if (tag === "URL") return new URL(text);
		if (tag === "URLSearchParams") return new URLSearchParams(text);
		return Temporal[tag.slice(9)].from(text);
	},
	fromArrayBuffer: (buffer) => buffer,
	fromRegExpInfo: (source, flags) => new RegExp(source, flags),
	fromViewInfo: (tag, buffer, byteOffset, length) => {
		try {
			array_buffer_byte_length.call(buffer);
		} catch (error) {
			if (!shared_array_buffer_byte_length) throw error;
			shared_array_buffer_byte_length.call(buffer);
		}
		const Constructor = globalThis[tag];
		return byteOffset !== void 0 ? new Constructor(buffer, byteOffset, length) : new Constructor(buffer);
	},
	box: (value) => Object(value),
	createArray: (length) => new Array(length),
	createSparseArray: (length) => {
		/** @type {any[]} */
		const array = [];
		array[MAX_ARRAY_INDEX] = void 0;
		delete array[MAX_ARRAY_INDEX];
		array.length = length;
		return array;
	},
	createObject: () => ({}),
	createNullPrototypeObject: () => Object.create(null),
	createSet: () => /* @__PURE__ */ new Set(),
	createMap: () => /* @__PURE__ */ new Map(),
	set: (target, key, value) => {
		target[key] = value;
	},
	addValue: (set, value) => {
		set.add(value);
	},
	addEntry: (map, key, value) => {
		map.set(key, value);
	}
});
// node_modules/devalue/src/parse.js
function invalid() {
	throw new Error("Invalid input");
}
/**
* Revive a value serialized with `devalue.stringify`
* @param {string} serialized
* @param {Record<string, (value: any) => any>} [revivers]
* @param {import('./types.js').ParseOptions} [options]
*/
function parse(serialized, revivers, options) {
	return unflatten(JSON.parse(serialized), revivers, options);
}
/**
* Revive a value flattened with `devalue.stringify`
* @param {number | any[]} parsed
* @param {Record<string, (value: any) => any>} [revivers]
* @param {import('./types.js').ParseOptions} [options]
*/
function unflatten(parsed, revivers, options) {
	/** @type {import('./types.js').ParseOperations} */
	const ops = merge_operations(default_parse_operations, options?.operations);
	if (typeof parsed === "number") return hydrate(parsed, true);
	if (!Array.isArray(parsed) || parsed.length === 0) invalid();
	const values = parsed;
	const hydrated = Array(values.length);
	/**
	* A set of values currently being hydrated with custom revivers,
	* used to detect invalid cyclical dependencies
	* @type {Set<number> | null}
	*/
	let hydrating = null;
	/**
	* @param {number} index
	* @returns {any}
	*/
	function get_raw(index) {
		if (!is_valid_array_index(index) || index >= values.length) invalid();
		return values[index];
	}
	/**
	* @param {number} index
	* @returns {any}
	*/
	function hydrate(index, standalone = false) {
		if (index === -1) return ops.fromPrimitive(void 0);
		if (index === -3) return ops.fromPrimitive(NaN);
		if (index === -4) return ops.fromPrimitive(Infinity);
		if (index === -5) return ops.fromPrimitive(-Infinity);
		if (index === -6) return ops.fromPrimitive(-0);
		if (standalone || typeof index !== "number") invalid();
		if (index in hydrated) return hydrated[index];
		if (index >= values.length) invalid();
		const value = values[index];
		if (!value || typeof value !== "object") hydrated[index] = ops.fromPrimitive(value);
		else if (Array.isArray(value)) {
			if (typeof value[0] === "string") {
				const type = value[0];
				const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
				if (reviver) {
					let i = value[1];
					if (typeof i !== "number") i = values.push(value[1]) - 1;
					if (Object.hasOwn(hydrated, i)) return hydrated[index] = reviver(hydrated[i]);
					hydrating ??= /* @__PURE__ */ new Set();
					if (hydrating.has(i)) throw new Error("Invalid circular reference");
					hydrating.add(i);
					hydrated[index] = reviver(hydrate(i));
					hydrating.delete(i);
					return hydrated[index];
				}
				switch (type) {
					case "Date":
						hydrated[index] = ops.fromISOString(value[1]);
						break;
					case "Set":
						const set = ops.createSet();
						hydrated[index] = set;
						for (let i = 1; i < value.length; i += 1) ops.addValue(set, hydrate(value[i]));
						break;
					case "Map":
						const map = ops.createMap();
						hydrated[index] = map;
						for (let i = 1; i < value.length; i += 2) ops.addEntry(map, hydrate(value[i]), hydrate(value[i + 1]));
						break;
					case "RegExp":
						hydrated[index] = ops.fromRegExpInfo(value[1], value[2]);
						break;
					case "Object": {
						const wrapped_index = value[1];
						if (!(wrapped_index === -3 || wrapped_index === -4 || wrapped_index === -5 || wrapped_index === -6)) {
							const wrapped = get_raw(wrapped_index);
							const is_bigint = Array.isArray(wrapped) && wrapped[0] === "BigInt";
							if ((wrapped === void 0 || typeof wrapped === "object") && !is_bigint) invalid();
						}
						hydrated[index] = ops.box(hydrate(wrapped_index));
						break;
					}
					case "BigInt":
						hydrated[index] = ops.fromPrimitive(BigInt(value[1]));
						break;
					case "null":
						const obj = ops.createNullPrototypeObject();
						hydrated[index] = obj;
						for (let i = 1; i < value.length; i += 2) {
							const key = value[i];
							if (typeof key !== "string") throw new Error("Cannot parse an object with a non-string key");
							if (key === "__proto__") throw new Error("Cannot parse an object with a `__proto__` property");
							ops.set(obj, key, hydrate(value[i + 1]));
						}
						break;
					case "Int8Array":
					case "Uint8Array":
					case "Uint8ClampedArray":
					case "Int16Array":
					case "Uint16Array":
					case "Float16Array":
					case "Int32Array":
					case "Uint32Array":
					case "Float32Array":
					case "Float64Array":
					case "BigInt64Array":
					case "BigUint64Array":
					case "DataView": {
						const buffer_index = value[1];
						const raw = get_raw(buffer_index);
						if (!Array.isArray(raw) || raw[0] !== "ArrayBuffer") invalid();
						const buffer = hydrate(buffer_index);
						hydrated[index] = ops.fromViewInfo(type, buffer, value[2], value[3]);
						break;
					}
					case "ArrayBuffer": {
						const base64 = value[1];
						if (typeof base64 !== "string") throw new Error("Invalid ArrayBuffer encoding");
						hydrated[index] = ops.fromArrayBuffer(decode64(base64));
						break;
					}
					case "URL":
					case "URLSearchParams":
					case "Temporal.Duration":
					case "Temporal.Instant":
					case "Temporal.PlainDate":
					case "Temporal.PlainTime":
					case "Temporal.PlainDateTime":
					case "Temporal.PlainMonthDay":
					case "Temporal.PlainYearMonth":
					case "Temporal.ZonedDateTime":
						hydrated[index] = ops.fromStringValue(type, value[1]);
						break;
					default: throw new Error(`Unknown type ${type}`);
				}
			} else if (value[0] === -7) {
				const len = value[1];
				if (!is_valid_array_len(len)) invalid();
				const array = ops.createSparseArray(len);
				hydrated[index] = array;
				for (let i = 2; i < value.length; i += 2) {
					const idx = value[i];
					if (!is_valid_array_index(idx) || idx >= len) invalid();
					ops.set(array, idx, hydrate(value[i + 1]));
				}
			} else {
				const array = ops.createArray(value.length);
				hydrated[index] = array;
				for (let i = 0; i < value.length; i += 1) {
					const n = value[i];
					if (n === -2) continue;
					ops.set(array, i, hydrate(n));
				}
			}
		} else {
			const object = ops.createObject();
			hydrated[index] = object;
			for (const key of Object.keys(value)) {
				if (key === "__proto__") throw new Error("Cannot parse an object with a `__proto__` property");
				ops.set(object, key, hydrate(value[key]));
			}
		}
		return hydrated[index];
	}
	return hydrate(0);
}
// node_modules/nuxt/dist/app/composables/payload.js
/** @since 3.0.0 */
async function loadPayload(url, opts = {}) {
	return null;
}
async function _importPayload(payloadURL, cache, signal, promoted) {
	return null;
}
function _getRoutePath(url) {
	return new URL(url, "http://localhost").pathname;
}
/** @internal */
function isCachedPayloadRoute(url) {
	return !!getRouteRules({ path: _getRoutePath(url) }).payload;
}
var payloadCache = null;
/** @since 3.4.0 */
async function getNuxtClientPayload() {
	if (payloadCache) return payloadCache;
	const el = document.getElementById("__NUXT_DATA__");
	if (!el) return {};
	const inlineData = await parsePayload(el.textContent || "");
	const externalData = el.dataset.src ? await _importPayload(el.dataset.src, inlineData.prerenderedAt ? "force-cache" : "no-cache") : void 0;
	payloadCache = {
		...inlineData,
		...externalData,
		...window.__NUXT__
	};
	if (payloadCache.config?.public) payloadCache.config.public = /* @__PURE__ */ reactive(payloadCache.config.public);
	return payloadCache;
}
async function parsePayload(payload) {
	return await parse(payload, useNuxtApp()._payloadRevivers);
}
/**
* This is an experimental function for configuring passing rich data from server -> client.
*
* This function _must_ be called in a Nuxt plugin that is `unshift`ed to the beginning of the Nuxt plugins array.
* @since 3.4.0
*/
function definePayloadReviver(name, revive) {
	useNuxtApp()._payloadRevivers[name] = revive;
}
// node_modules/nuxt/dist/app/compat/idle-callback.js
var requestIdleCallback = globalThis.requestIdleCallback || ((cb) => {
	const start = Date.now();
	const idleDeadline = {
		didTimeout: false,
		timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
	};
	return setTimeout(() => {
		cb(idleDeadline);
	}, 1);
});
var cancelIdleCallback = globalThis.cancelIdleCallback || ((id) => {
	clearTimeout(id);
});
// node_modules/nuxt/dist/app/internal/prefetch-util.js
var IS_2G_RE = /2g/;
/**
* Whether the connection can afford speculative work.
* https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
* @internal
*/
function canPrefetch() {
	const connection = navigator.connection;
	if (!connection) return true;
	return !connection.saveData && !IS_2G_RE.test(connection.effectiveType || "");
}
/**
* The destination a piece of prefetch work belongs to. The hash does not affect what is fetched.
* @internal
*/
function prefetchGroup(url) {
	const { pathname, search } = new URL(url, window.location.href);
	return pathname + search;
}
// node_modules/nuxt/dist/app/internal/prefetch.js
/** drained in this order */
var PREFETCH_PRIORITIES = [
	"route",
	"payload",
	"island",
	"hint"
];
var DEFAULT_TOTAL_CONCURRENCY = 12;
var DEFAULT_CONCURRENCY = {
	route: 8,
	payload: 8,
	island: 4,
	hint: 8
};
function createPrefetchScheduler(options = {}) {
	const limits = {
		...DEFAULT_CONCURRENCY,
		...options.concurrency
	};
	const total = options.total ?? DEFAULT_TOTAL_CONCURRENCY;
	const canPrefetch = options.canPrefetch;
	const defer = options.defer;
	const queues = {
		route: [],
		payload: [],
		island: [],
		hint: []
	};
	const lists = PREFETCH_PRIORITIES.map((priority) => queues[priority]);
	const promoted = /* @__PURE__ */ new WeakSet();
	const keys = /* @__PURE__ */ new Map();
	const active = {
		route: 0,
		payload: 0,
		island: 0,
		hint: 0
	};
	let activeTotal = 0;
	const activeNavigationTasks = /* @__PURE__ */ new Map();
	const appController = new AbortController();
	const droppedController = new AbortController();
	droppedController.abort();
	function release(task) {
		if (keys.get(task.key) === task) keys.delete(task.key);
	}
	function drop(task) {
		release(task);
		Promise.resolve().then(() => task.run(droppedController.signal, false)).catch(() => {});
	}
	function drain() {
		if (canPrefetch && !canPrefetch()) return;
		while (activeTotal < total) {
			const priority = PREFETCH_PRIORITIES.find((priority) => queues[priority].length && active[priority] < limits[priority]);
			if (!priority) return;
			const task = queues[priority].shift();
			start(task, promoted.delete(task));
		}
	}
	function start(task, isPromoted) {
		const controller = task.scope === "app" ? appController : new AbortController();
		if (task.scope === "navigation") activeNavigationTasks.set(task, controller);
		active[task.priority]++;
		activeTotal++;
		let settled = false;
		const complete = () => {
			if (settled) return;
			settled = true;
			active[task.priority]--;
			activeTotal--;
			activeNavigationTasks.delete(task);
			release(task);
			drain();
		};
		controller.signal.addEventListener("abort", complete, { once: true });
		const run = () => Promise.resolve().then(() => task.run(controller.signal, isPromoted)).then(complete, complete);
		if (defer) defer(run, isPromoted, task.priority);
		else run();
	}
	const isRetained = (task, retainGroup) => retainGroup !== void 0 && task.group === retainGroup && task.priority !== "hint";
	return {
		schedule(task) {
			const batch = [];
			for (const candidate of Array.isArray(task) ? task : [task]) {
				if (keys.has(candidate.key)) {
					drop(candidate);
					continue;
				}
				keys.set(candidate.key, candidate);
				batch.push(candidate);
			}
			for (let i = batch.length - 1; i >= 0; i--) queues[batch[i].priority].unshift(batch[i]);
			drain();
		},
		promote(group) {
			for (const list of lists) {
				const wanted = [];
				const rest = [];
				for (const task of list) {
					if (task.group === group) promoted.add(task);
					(task.group === group ? wanted : rest).push(task);
				}
				list.length = 0;
				list.push(...wanted, ...rest);
			}
			drain();
		},
		reset(retainGroup) {
			for (const list of lists) for (let i = list.length - 1; i >= 0; i--) {
				const task = list[i];
				if (task.scope === "navigation" && !isRetained(task, retainGroup)) {
					list.splice(i, 1);
					drop(task);
				}
			}
			for (const [task, controller] of [...activeNavigationTasks]) {
				if (isRetained(task, retainGroup)) continue;
				controller.abort();
			}
			drain();
		},
		resume: drain
	};
}
// node_modules/nuxt/dist/app/internal/prefetch-scheduler.js
var IDLE_START_TIMEOUT_MS = 1e3;
/**
* Speculative work yields to user input. Work the user has shown intent in does not, and
* neither do route chunks, whose start latency is what a navigation ends up waiting on.
* https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API
*/
function defer(run, promoted, priority) {
	if (promoted || priority === "route") return run();
	const scheduler = globalThis.scheduler;
	if (scheduler?.postTask) scheduler.postTask(run, { priority: "background" }).catch(() => {});
	else requestIdleCallback(run, { timeout: IDLE_START_TIMEOUT_MS });
}
/**
* The single scheduler every client-side prefetch mechanism queues work on.
* @internal
*/
function usePrefetchScheduler(nuxtApp = useNuxtApp()) {
	if (nuxtApp._prefetch) return nuxtApp._prefetch;
	let navigating = false;
	const scheduler = createPrefetchScheduler({
		canPrefetch: () => canPrefetch() && !navigating && document.visibilityState !== "hidden",
		defer
	});
	nuxtApp._prefetch = scheduler;
	navigator.connection?.addEventListener?.("change", () => scheduler.resume());
	document.addEventListener("visibilitychange", () => scheduler.resume());
	const router = nuxtApp.$router;
	router.beforeEach(() => {
		navigating = true;
	});
	router.afterEach((to) => {
		navigating = false;
		scheduler.reset(prefetchGroup(to.fullPath));
	});
	router.onError(() => {
		navigating = false;
		scheduler.resume();
	});
	return scheduler;
}
function parseRevivedData(data) {
	try {
		return JSON.parse(data);
	} catch {
		return data;
	}
}
var revivers = [
	["NuxtError", (data) => createError(data)],
	["EmptyShallowRef", (data) => /* @__PURE__ */ shallowRef(data === "_" ? void 0 : data === "0n" ? BigInt(0) : parseRevivedData(data))],
	["EmptyRef", (data) => /* @__PURE__ */ ref(data === "_" ? void 0 : data === "0n" ? BigInt(0) : parseRevivedData(data))],
	["ShallowRef", (data) => /* @__PURE__ */ shallowRef(data)],
	["ShallowReactive", (data) => /* @__PURE__ */ shallowReactive(data)],
	["Ref", (data) => /* @__PURE__ */ ref(data)],
	["Reactive", (data) => /* @__PURE__ */ reactive(data)]
];
var plugin$9 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:client",
	order: -30,
	async setup(nuxtApp) {
		for (const [reviver, fn] of revivers) definePayloadReviver(reviver, fn);
		Object.assign(nuxtApp.payload, await nuxtApp.runWithContext(getNuxtClientPayload));
		delete window.__NUXT__;
	}
});
// node_modules/nuxt/dist/head/runtime/install-client-head.js
function installClientHead(nuxtApp, head) {
	head.push(appHead);
	nuxtApp.vueApp.use(head);
	let pauseDOMUpdates = true;
	const syncHead = () => {
		pauseDOMUpdates = false;
		head.render();
	};
	head.hooks?.hook("dom:beforeRender", (context) => {
		context.shouldRender = !pauseDOMUpdates;
	});
	nuxtApp.hooks.hook("page:start", () => {
		pauseDOMUpdates = true;
	});
	nuxtApp.hooks.hook("page:finish", () => {
		if (!nuxtApp.isHydrating) syncHead();
	});
	nuxtApp.hooks.hook("app:error", syncHead);
	nuxtApp.hooks.hook("app:suspense:resolve", syncHead);
	const originalPush = head.push.bind(head);
	head.push = ((input, options) => {
		const entry = originalPush(input, options);
		const originalDispose = entry.dispose.bind(entry);
		entry.dispose = () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.finally(originalDispose);
			else originalDispose();
		};
		return entry;
	});
}
// node_modules/unhead/dist/shared/unhead.C5Bksi2B.mjs
function createClientHeadAdapter(core, hooks, render) {
	const corePush = core.push;
	const head = core;
	head.ssr = false;
	head.hooks = hooks;
	head.dirty = !!head.dirty;
	head.use = (p) => registerPlugin(head, p);
	head.render = () => render(head);
	function notify() {
		hooks.callHook("entries:updated", head);
		if (!head._b) head.render();
	}
	head.invalidate = () => {
		for (const entry of head.entries.values()) delete entry._tags;
		head.dirty = true;
		notify();
	};
	head.push = (input, entryOptions) => {
		const unhook = entryOptions?.onRendered ? hooks.hook("dom:rendered", entryOptions.onRendered) : void 0;
		const active = corePush(input, entryOptions);
		const entry = core.entries.get(active._i);
		if (entry) entry._o = input;
		head.dirty = true;
		notify();
		return {
			_i: active._i,
			patch(input2) {
				active.patch(input2);
				head.dirty = true;
				notify();
			},
			dispose() {
				unhook?.();
				if (core.entries.has(active._i)) {
					active.dispose();
					head.invalidate();
				}
			}
		};
	};
	return head;
}
// node_modules/unhead/dist/shared/unhead.DD4N5B4k.mjs
var WHITESPACE_RE = /\s+/;
// @__NO_SIDE_EFFECTS__
function createDomRenderer(options = {}) {
	return (head) => _renderDOMHead(head, options);
}
function hasPendingEntries(head) {
	for (const entry of head.entries.values()) if (entry._pending !== void 0) return true;
	return false;
}
function createDomState(head, dom) {
	const state = {
		_d: dom,
		_t: dom.title,
		_e: /* @__PURE__ */ new Map([["htmlAttrs", dom.documentElement], ["bodyAttrs", dom.body]]),
		_p: {},
		_s: {},
		_l: /* @__PURE__ */ new Map()
	};
	for (const entry of head.entries.values()) if (entry._o !== void 0) {
		const orig = entry._o;
		for (const t of ["bodyAttrs", "htmlAttrs"]) {
			const cls = orig[t]?.class;
			if (typeof cls === "string") {
				const $el = state._e.get(t);
				for (const c of cls.split(WHITESPACE_RE)) if (c) state._p[`${t}:attr:class:${c}`] = () => $el.classList.remove(c);
			}
		}
	}
	return state;
}
function _renderDOMHead(head, options = {}) {
	const dom = options.document || head.resolvedOptions.document;
	const activeState = head._dom;
	if (!dom || head._du || activeState && activeState._d === dom && !head.dirty && !hasPendingEntries(head)) return false;
	const defaultView = dom.defaultView;
	head._du = true;
	let didRender = false;
	try {
		let track = function(key, fn, fresh) {
			renderState._s[key] = !fresh && previous[key] || fn;
			delete previous[key];
		}, trackEvent = function(id, k, ev, source, $el, target) {
			const key = `${id}:event:${k}`;
			const prev = renderState._l.get(key);
			if (prev && prev[0] === target && prev[1] === ev && prev[2] === source) {
				track(key, prev[4]);
				return;
			}
			prev?.[4]();
			const dk = `data-${k}`;
			const handler = ((e) => source.call($el, e));
			const cleanup = () => {
				target.removeEventListener(ev, handler);
				if ($el.getAttribute(dk) === "") $el.removeAttribute(dk);
				if (renderState._l.get(key)?.[3] === handler) renderState._l.delete(key);
			};
			target.addEventListener(ev, handler);
			renderState._l.set(key, [
				target,
				ev,
				source,
				handler,
				cleanup
			]);
			$el.setAttribute(dk, "");
			track(key, cleanup, true);
		}, trackCtx = function({ id, $el, tag }) {
			renderState._e.set(id, $el);
			if (!tag.tag.endsWith("Attrs")) {
				const text = tag.textContent;
				if (text != null && text !== "") {
					if (text !== $el.textContent) $el.textContent = text;
					track(`${id}:text`, () => {
						if ($el.textContent === text) $el.textContent = "";
					}, true);
				}
				const html = tag.innerHTML;
				if (html != null && html !== "") {
					if (html !== $el.innerHTML) $el.innerHTML = html;
					track(`${id}:html`, () => {
						if ($el.innerHTML === html) $el.innerHTML = "";
					}, true);
				}
				const elKey = `${id}:el`;
				track(elKey, previous[elKey] || (() => {
					$el?.remove();
					renderState._e.delete(id);
				}));
			}
			for (const k in tag.props) {
				const v = tag.props[k];
				if (k[0] === "o" && k[1] === "n" && typeof v === "function") {
					const ev = k.slice(2);
					if ($el?.dataset?.[`${k}fired`]) v.call($el, new ((defaultView?.Event) || Event)(ev));
					trackEvent(id, k, ev, v, $el, tag.tag === "bodyAttrs" && defaultView ? defaultView : $el);
					continue;
				}
				const ck = `${id}:attr:${k}`;
				if (k === "class" && v) for (const c of v) {
					const key = `${ck}:${c}`;
					track(key, previous[key] || (() => $el.classList.remove(c)));
					if (!$el.classList.contains(c)) $el.classList.add(c);
				}
				else if (k === "style" && v) for (const [sk, sv] of v) {
					const key = `${ck}:${sk}`;
					track(key, previous[key] || (() => $el.style.removeProperty(sk)));
					$el.style.setProperty(sk, sv);
				}
				else if (v !== false && v !== null) {
					if ($el.getAttribute(k) !== v) $el.setAttribute(k, v === true ? "" : String(v));
					track(ck, previous[ck] || (() => $el.removeAttribute(k)));
				}
			}
		};
		const beforeRenderCtx = {
			shouldRender: true,
			tags: []
		};
		callHook(head, "dom:beforeRender", beforeRenderCtx);
		if (!beforeRenderCtx.shouldRender) return false;
		let state = activeState;
		if (state?._d !== dom) {
			if (state) {
				for (const k in state._s) state._s[k]();
				for (const k in state._p) state._p[k]();
				state._s = state._p = {};
				state._e.clear();
				state._l.clear();
			}
			state = void 0;
		}
		if (!state) state = createDomState(head, dom);
		else state._p = state._s;
		state._s = {};
		const renderState = state;
		const previous = renderState._p;
		const pending = [];
		const frag = {};
		head.dirty = false;
		const rawTags = resolveTags(head, options.tagWeight ? { tagWeight: options.tagWeight } : void 0);
		const tags = [];
		const dupeKeyCounter = {};
		for (const tag of rawTags) {
			const count = dupeKeyCounter[tag._d] || 0;
			const id = (count ? `${tag._d}:${count}` : tag._d) || tag._h;
			const ctx = {
				tag,
				id,
				shouldRender: true
			};
			if (tag.tag === "meta" && tag._d && isMetaArrayDupeKey(tag._d)) dupeKeyCounter[tag._d] = count + 1;
			tags.push(ctx);
			if (tag.tag === "title") {
				dom.title = tag.textContent;
				track("title:", () => dom.title = renderState._t);
				continue;
			}
			ctx.$el = renderState._e.get(id);
			if (ctx.$el) trackCtx(ctx);
			else if (HasElementTags.has(tag.tag)) pending.push(ctx);
		}
		if (pending.length) {
			const tracked = new Set(renderState._e.values());
			for (const el of [...dom.body.children, ...dom.head.children]) {
				const elTag = el.tagName.toLowerCase();
				if (!HasElementTags.has(elTag) || tracked.has(el)) continue;
				const props = { innerHTML: el.innerHTML };
				for (const n of el.getAttributeNames()) props[n] = el.getAttribute(n);
				const next = normalizeProps({
					tag: elTag,
					props: {}
				}, props);
				next.key = el.getAttribute("data-hid") || void 0;
				const dedupe = dedupeKey(next) || hashTag(next);
				let k = dedupe;
				let c = 1;
				while (renderState._e.has(k)) k = `${dedupe}:${c++}`;
				renderState._e.set(k, el);
			}
		}
		for (const ctx of pending) {
			const found = renderState._e.get(ctx.id);
			ctx.$el = found || dom.createElement(ctx.tag.tag);
			trackCtx(ctx);
			if (!found) (frag[ctx.tag.tagPosition || "head"] ??= dom.createDocumentFragment()).appendChild(ctx.$el);
		}
		if (frag.head) dom.head.appendChild(frag.head);
		if (frag.bodyOpen) dom.body.insertBefore(frag.bodyOpen, dom.body.firstChild);
		if (frag.bodyClose) dom.body.appendChild(frag.bodyClose);
		for (const k in previous) previous[k]();
		head._dom = renderState;
		didRender = true;
		callHook(head, "dom:rendered", { renders: tags });
	} catch (e) {
		head.dirty = true;
		throw e;
	} finally {
		head._du = false;
	}
	if (didRender && (head.dirty || hasPendingEntries(head))) _renderDOMHead(head, options);
	return didRender;
}
// node_modules/unhead/dist/shared/unhead.CaeaMM5q.mjs
var tagWeight = (tag) => typeof tag.tagPriority === "number" ? tag.tagPriority : 100 + (TagPriorityAliases[tag.tagPriority] || 0);
function createHead$1(options = {}) {
	options.document = options.document || (typeof window !== "undefined" ? document : void 0);
	const renderer = options.render || /* @__PURE__ */ createDomRenderer({ document: options.document });
	const head = createClientHeadAdapter(/* @__PURE__ */ createUnhead(renderer, {
		document: options.document,
		propResolvers: options.propResolvers,
		_tagWeight: tagWeight,
		init: []
	}), createHooks(options.hooks), renderer);
	options.plugins?.forEach((p) => head.use(p));
	options.init?.forEach((e) => e && head.push(e));
	return head;
}
// node_modules/@unhead/vue/dist/client.mjs
// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
	const domRenderer = /* @__PURE__ */ createDomRenderer();
	let head;
	let renderId = 0;
	const debouncedRenderer = () => {
		const id = ++renderId;
		setTimeout(() => {
			if (id === renderId) domRenderer(head);
		}, 0);
	};
	head = createHead$1({
		render: debouncedRenderer,
		...options
	});
	head.install = /* @__PURE__ */ vueInstall(head);
	return head;
}
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Funhead-options.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Funhead_options_default = {
	disableDefaults: true,
	plugins: [
		DeprecationsPlugin,
		PromisesPlugin,
		TemplateParamsPlugin,
		AliasSortingPlugin
	]
};
// node_modules/nuxt/dist/head/runtime/plugins/unhead.client.js
var plugin$8 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		installClientHead(nuxtApp, /* @__PURE__ */ createHead(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Funhead_options_default));
	}
});
// node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey$1 = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = override ?? matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
var wrapInKeepAlive = (props, children) => {
	return { default: () => props ? h(KeepAlive, props === true ? {} : props, children) : children };
};
/** @since 3.9.0 */
function toArray$1(value) {
	return Array.isArray(value) ? value : [value];
}
// node_modules/vue-router/dist/useApi-SF8tY_yo.js
/*!
* vue-router v5.5.1
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
/**
* Checks if a path is absolute, meaning it starts with a `/`.
*
* @param path - path to check
*
* @internal
*/
var isAbsolutePath = (path) => path.startsWith("/");
/**
* Allows differentiating lazy components from functional components and vue-class-component
* @internal
*
* @param component
*/
function isRouteComponent(component) {
	return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
	return obj.__esModule || obj[Symbol.toStringTag] === "Module" || obj.default && isRouteComponent(obj.default);
}
var assign = Object.assign;
function applyToParams(fn, params) {
	const newParams = {};
	for (const key in params) {
		const value = params[key];
		newParams[key] = isArray(value) ? value.map(fn) : fn(value);
	}
	return newParams;
}
var noop = () => {};
/**
* Typesafe alternative to Array.isArray
* https://github.com/microsoft/TypeScript/pull/48228
*
* @internal
*/
var isArray = Array.isArray;
function mergeOptions(defaults, partialOptions) {
	const options = {};
	for (const key in defaults) options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
	return options;
}
var NavigationFailureSymbol = Symbol("");
/**
* Enumeration with all possible types for navigation failures. Can be passed to
* {@link isNavigationFailure} to check for specific failures.
*/
var NavigationFailureType = /* @__PURE__ */ function(NavigationFailureType) {
	/**
	* An aborted navigation is a navigation that failed because a navigation
	* guard returned `false` or called `next(false)`
	*/
	NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
	/**
	* A cancelled navigation is a navigation that failed because a more recent
	* navigation finished started (not necessarily finished).
	*/
	NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
	/**
	* A duplicated navigation is a navigation that failed because it was
	* initiated while already being at the exact same location.
	*/
	NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
	return NavigationFailureType;
}({});
/**
* Creates a typed NavigationFailure object.
* @internal
* @param type - NavigationFailureType
* @param params - { from, to }
*/
function createRouterError(type, params) {
	return assign(/* @__PURE__ */ new Error(), {
		type,
		[NavigationFailureSymbol]: true
	}, params);
}
function isNavigationFailure(error, type) {
	return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
/**
* RouteRecord being rendered by the closest ancestor Router View. Used for
* `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
* Location Matched
*
* @internal
*/
var matchedRouteKey = Symbol("");
/**
* Allows overriding the router view depth to control which component in
* `matched` is rendered. rvd stands for Router View Depth
*
* @internal
*/
var viewDepthKey = Symbol("");
/**
* Allows overriding the router instance returned by `useRouter` in tests. r
* stands for router
*
* @internal
*/
var routerKey = Symbol("");
/**
* Allows overriding the current route returned by `useRoute` in tests. rl
* stands for route location
*
* @internal
*/
var routeLocationKey = Symbol("");
/**
* Allows overriding the current route used by router-view. Internally this is
* used when the `route` prop is passed.
*
* @internal
*/
var routerViewLocationKey = Symbol("");
/**
* Callbacks called by the closest ancestor router-view once it displays a new
* route. Used by `onRouteRendered()`.
*
* @internal
*/
var routerViewOnRouteRenderedKey = Symbol("");
/**
* Returns the current route location. Equivalent to using `$route` inside
* templates. Inside a `<RouterView>` with a `route` prop, returns that route
* instead.
*/
function useRoute(_name) {
	return inject(routeLocationKey);
}
// node_modules/vue-router/dist/devtools-RytpElE1.js
/*!
* vue-router v5.5.1
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
var isBrowser = typeof document !== "undefined";
/**
* Encoding Rules (␣ = Space)
* - Path: ␣ " < > # ? { }
* - Query: ␣ " < > # & =
* - Hash: ␣ " < > `
*
* On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
* defines some extra characters to be encoded. Most browsers do not encode them
* in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
* also encode `!'()*`. Leaving un-encoded only ASCII alphanumeric(`a-zA-Z0-9`)
* plus `-._~`. This extra safety should be applied to query by patching the
* string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
* should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
* into a `/` if directly typed in. The _backtick_ (`````) should also be
* encoded everywhere because some browsers like FF encode it when directly
* written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
*/
/**
* NOTE: `replaceAll()` is not faster than `replace()` with a global RegExp.
* Benchmarks do not show a clear benefit for these simple replacements:
* https://github.com/mathiasbynens/string-prototype-replace-regexp-benchmark
*/
var HASH_RE = /#/g;
var AMPERSAND_RE = /&/g;
var SLASH_RE = /\//g;
var EQUAL_RE = /=/g;
var IM_RE = /\?/g;
var PLUS_RE = /\+/g;
/**
* NOTE: It's not clear to me if we should encode the + symbol in queries, it
* seems to be less flexible than not doing so and I can't find out the legacy
* systems requiring this for regular requests like text/html. In the standard,
* the encoding of the plus character is only mentioned for
* application/x-www-form-urlencoded
* (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
* leave the plus character as is in queries. To be more flexible, we allow the
* plus character on the query, but it can also be manually encoded by the user.
*
* Resources:
* - https://url.spec.whatwg.org/#urlencoded-parsing
* - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
*/
var ENC_BRACKET_OPEN_RE = /%5B/g;
var ENC_BRACKET_CLOSE_RE = /%5D/g;
var ENC_CARET_RE = /%5E/g;
var ENC_BACKTICK_RE = /%60/g;
var ENC_CURLY_OPEN_RE = /%7B/g;
var ENC_PIPE_RE = /%7C/g;
var ENC_CURLY_CLOSE_RE = /%7D/g;
var ENC_SPACE_RE = /%20/g;
/**
* Encode characters that need to be encoded on the path, search and hash
* sections of the URL.
*
* @internal
* @param text - string to encode
* @returns encoded string
*/
function commonEncode(text) {
	return text == null ? "" : encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
/**
* Encode characters that need to be encoded on the hash section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeHash(text) {
	return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
/**
* Encode characters that need to be encoded query values on the query
* section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeQueryValue(text) {
	return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
/**
* Like `encodeQueryValue` but also encodes the `=` character.
*
* @param text - string to encode
*/
function encodeQueryKey(text) {
	return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
/**
* Encode characters that need to be encoded on the path section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodePath(text) {
	return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
/**
* Encode characters that need to be encoded on the path section of the URL as a
* param. This function encodes everything {@link encodePath} does plus the
* slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
* string instead.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeParam(text) {
	return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
	if (text == null) return null;
	try {
		return decodeURIComponent("" + text);
	} catch {}
	return "" + text;
}
var TRAILING_SLASH_RE = /\/$/;
var removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
/**
* Transforms a URI into a normalized history location
*
* @param parseQuery
* @param location - URI to normalize
* @param currentLocation - current absolute location. Allows resolving relative
* paths. Must start with `/`. Defaults to `/`
* @returns a normalized history location
*/
function parseURL(parseQuery, location, currentLocation = "/") {
	let path, query = {}, searchString = "", hash = "";
	const hashPos = location.indexOf("#");
	let searchPos = location.indexOf("?");
	searchPos = hashPos >= 0 && searchPos > hashPos ? -1 : searchPos;
	if (searchPos >= 0) {
		path = location.slice(0, searchPos);
		searchString = location.slice(searchPos, hashPos > 0 ? hashPos : location.length);
		query = parseQuery(searchString.slice(1));
	}
	if (hashPos >= 0) {
		path = path || location.slice(0, hashPos);
		hash = location.slice(hashPos, location.length);
	}
	path = resolveRelativePath(path != null ? path : location, currentLocation);
	return {
		fullPath: path + searchString + hash,
		path,
		query,
		hash: decode(hash)
	};
}
/**
* Stringifies a URL object
*
* @param stringifyQuery
* @param location
*/
function stringifyURL(stringifyQuery, location) {
	const query = location.query ? stringifyQuery(location.query) : "";
	return location.path + (query && "?") + query + (location.hash || "");
}
/**
* Strips off the base from the beginning of a location.pathname in a non-case-sensitive way.
*
* @param pathname - location.pathname
* @param base - base to strip off
*/
function stripBase(pathname, base) {
	if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) return pathname;
	return pathname.slice(base.length) || "/";
}
/**
* Checks if two RouteLocation are equal. This means that both locations are
* pointing towards the same {@link RouteRecord} and that all `params`, `query`
* parameters and `hash` are the same
*
* @param stringifyQuery - A function that takes a query object of type LocationQueryRaw and returns a string representation of it.
* @param a - first {@link RouteLocation}
* @param b - second {@link RouteLocation}
*/
function isSameRouteLocation(stringifyQuery, a, b) {
	const aLastIndex = a.matched.length - 1;
	const bLastIndex = b.matched.length - 1;
	return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery(a.query) === stringifyQuery(b.query) && a.hash === b.hash;
}
/**
* Check if two `RouteRecords` are equal. Takes into account aliases: they are
* considered equal to the `RouteRecord` they are aliasing.
*
* @param a - first {@link RouteRecord}
* @param b - second {@link RouteRecord}
*/
function isSameRouteRecord(a, b) {
	return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (var key in a) if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
	return true;
}
function isSameRouteLocationParamsValue(a, b) {
	return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : (a && a.valueOf()) === (b && b.valueOf());
}
/**
* Check if two arrays are the same or if an array with one single entry is the
* same as another primitive value. Used to check query and parameters
*
* @param a - array of values
* @param b - array of values or a single value
*/
function isEquivalentArray(a, b) {
	return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
/**
* Resolves a relative path that starts with `.`.
*
* @param to - path location we are resolving
* @param from - currentLocation.path, should start with `/`
*/
function resolveRelativePath(to, from) {
	if (isAbsolutePath(to)) return to;
	if (!to) return from;
	const fromSegments = from.split("/");
	const toSegments = to.split("/");
	const lastToSegment = toSegments[toSegments.length - 1];
	if (lastToSegment === ".." || lastToSegment === ".") toSegments.push("");
	let position = fromSegments.length - 1;
	let toPosition;
	let segment;
	for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
		segment = toSegments[toPosition];
		if (segment === ".") continue;
		if (segment === "..") {
			if (position > 1) position--;
		} else break;
	}
	return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
/**
* Initial route location where the router is. Can be used in navigation guards
* to differentiate the initial navigation.
*
* @example
* ```js
* import { START_LOCATION } from 'vue-router'
*
* router.beforeEach((to, from) => {
*   if (from === START_LOCATION) {
*     // initial navigation
*   }
* })
* ```
*/
var START_LOCATION_NORMALIZED = {
	path: "/",
	name: void 0,
	params: {},
	query: {},
	hash: "",
	fullPath: "/",
	matched: [],
	meta: {},
	redirectedFrom: void 0
};
/**
* Creates the reactive route returned by `useRoute()` from a route ref.
*
* @internal
*/
function createReactiveRoute(routeRef) {
	const route = {};
	for (const key in START_LOCATION_NORMALIZED) Object.defineProperty(route, key, {
		get: () => routeRef.value[key],
		enumerable: true
	});
	return /* @__PURE__ */ shallowReactive(route);
}
/**
* Normalizes a base by removing any trailing slash and reading the base tag if
* present.
*
* @param base - base to normalize
*/
function normalizeBase(base) {
	if (!base) {
		if (isBrowser) {
			const baseEl = document.querySelector("base");
			base = baseEl && baseEl.getAttribute("href") || "/";
			base = base.replace(/^\w+:\/\/[^/]+/, "");
		} else base = "/";
	}
	if (base[0] !== "/" && base[0] !== "#") base = "/" + base;
	return removeTrailingSlash(base);
}
var BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location) {
	return base.replace(BEFORE_HASH_RE, "#") + location;
}
function getElementPosition(el, offset) {
	const docRect = document.documentElement.getBoundingClientRect();
	const elRect = el.getBoundingClientRect();
	return {
		behavior: offset.behavior,
		left: elRect.left - docRect.left - (offset.left || 0),
		top: elRect.top - docRect.top - (offset.top || 0)
	};
}
function scrollToPosition(position) {
	let scrollToOptions;
	if ("el" in position) {
		const positionEl = position.el;
		const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
		const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
		if (!el) return;
		scrollToOptions = getElementPosition(el, position);
	} else scrollToOptions = position;
	if ("scrollBehavior" in document.documentElement.style) window.scrollTo(scrollToOptions);
	else window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
}
/**
* Key of the scroll positions saved in `sessionStorage`. They persist across
* reloads and documents of the same tab.
*/
var SCROLL_KEY = "vue-router:scroll";
function readScrollPositions() {
	try {
		return assign({}, JSON.parse(sessionStorage[SCROLL_KEY]));
	} catch {
		return {};
	}
}
var scrollPositions = /*#__PURE__*/ readScrollPositions();
function persistScrollPositions() {
	try {
		sessionStorage[SCROLL_KEY] = JSON.stringify(scrollPositions);
	} catch {}
}
function getScrollKey(path, delta) {
	return (history.state ? history.state.position - delta : -1) + path;
}
/**
* Saves the position of the entry `delta` steps before the current one.
*/
function saveScrollPosition(path, delta = 0) {
	if (history.scrollRestoration === "manual") {
		scrollPositions[getScrollKey(path, delta)] = {
			left: window.scrollX,
			top: window.scrollY
		};
		persistScrollPositions();
	}
}
/**
* Consumes the saved position of the current entry.
*/
function getSavedScrollPosition(path) {
	const key = getScrollKey(path, 0);
	const scroll = scrollPositions[key];
	delete scrollPositions[key];
	persistScrollPositions();
	return scroll;
}
function invalidateScrollPositions(position, replace = false) {
	for (const key in scrollPositions) {
		const entryPosition = parseInt(key, 10);
		if (entryPosition === position || !replace && entryPosition > position) delete scrollPositions[key];
	}
	persistScrollPositions();
}
/**
* ScrollBehavior instance used by the router to compute and restore the scroll
* position when navigating.
*/
function isRouteLocation(route) {
	return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
	return typeof name === "string" || typeof name === "symbol";
}
/**
* Transforms a queryString into a {@link LocationQuery} object. Accept both, a
* version with the leading `?` and without Should work as URLSearchParams

* @internal
*
* @param search - search string to parse
* @returns a query object
*/
function parseQuery(search) {
	const query = {};
	if (search === "" || search === "?") return query;
	const searchParams = (search[0] === "?" ? search.slice(1) : search).split("&");
	for (let i = 0; i < searchParams.length; ++i) {
		const searchParam = searchParams[i].replace(PLUS_RE, " ");
		const eqPos = searchParam.indexOf("=");
		const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
		const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
		if (key in query) {
			let currentValue = query[key];
			if (!isArray(currentValue)) currentValue = query[key] = [currentValue];
			currentValue.push(value);
		} else query[key] = value;
	}
	return query;
}
/**
* Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
* doesn't prepend a `?`
*
* @internal
*
* @param query - query object to stringify
* @returns string version of the query without the leading `?`
*/
function stringifyQuery(query) {
	let search = "";
	for (let key in query) {
		const value = query[key];
		key = encodeQueryKey(key);
		if (value == null) {
			if (value !== void 0) search += (search.length ? "&" : "") + key;
			continue;
		}
		(isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)]).forEach((value) => {
			if (value !== void 0) {
				search += (search.length ? "&" : "") + key;
				if (value != null) search += "=" + value;
			}
		});
	}
	return search;
}
/**
* Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
* numbers into strings, removing keys with an undefined value and replacing
* undefined with null in arrays
*
* @param query - query object to normalize
* @returns a normalized query object
*/
function normalizeQuery(query) {
	const normalizedQuery = {};
	for (const key in query) {
		const value = query[key];
		if (value !== void 0) normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
	}
	return normalizedQuery;
}
/**
* Create a list of callbacks that can be reset. Used to create before and after navigation guards list
*/
function useCallbacks() {
	let handlers = [];
	function add(handler) {
		handlers.push(handler);
		return () => {
			const i = handlers.indexOf(handler);
			if (i > -1) handlers.splice(i, 1);
		};
	}
	function reset() {
		handlers = [];
	}
	return {
		add,
		list: () => handlers.slice(),
		reset
	};
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
	const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
	return () => new Promise((resolve, reject) => {
		const next = (valid) => {
			if (valid === false) reject(createRouterError(4, {
				from,
				to
			}));
			else if (valid instanceof Error) reject(valid);
			else if (isRouteLocation(valid)) reject(createRouterError(2, {
				from: to,
				to: valid
			}));
			else {
				if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") enterCallbackArray.push(valid);
				resolve();
			}
		};
		const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
		let guardCall = Promise.resolve(guardReturn);
		if (guard.length < 3) guardCall = guardCall.then(next);
		guardCall.catch((err) => reject(err));
	});
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
	const guards = [];
	for (const record of matched) for (const name in record.components) {
		let rawComponent = record.components[name];
		if (guardType !== "beforeRouteEnter" && !record.instances[name]) continue;
		if (isRouteComponent(rawComponent)) {
			const guard = (rawComponent.__vccOpts || rawComponent)[guardType];
			guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
		} else {
			let componentPromise = rawComponent();
			guards.push(() => componentPromise.then((resolved) => {
				if (!resolved) throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
				const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
				record.mods[name] = resolved;
				record.components[name] = resolvedComponent;
				const guard = (resolvedComponent.__vccOpts || resolvedComponent)[guardType];
				return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
			}));
		}
	}
	return guards;
}
/**
* Split the leaving, updating, and entering records.
* @internal
*
* @param  to - Location we are navigating to
* @param from - Location we are navigating from
*/
function extractChangingRecords(to, from) {
	const leavingRecords = [];
	const updatingRecords = [];
	const enteringRecords = [];
	const len = Math.max(from.matched.length, to.matched.length);
	for (let i = 0; i < len; i++) {
		const recordFrom = from.matched[i];
		if (recordFrom) {
			if (to.matched.find((record) => isSameRouteRecord(record, recordFrom))) updatingRecords.push(recordFrom);
			else leavingRecords.push(recordFrom);
		}
		const recordTo = to.matched[i];
		if (recordTo) {
			if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) enteringRecords.push(recordTo);
		}
	}
	return [
		leavingRecords,
		updatingRecords,
		enteringRecords
	];
}
/**
* Returns the internal behavior of a {@link RouterLink} without the rendering part.
*
* @param props - a `to` location and an optional `replace` flag
*/
function useLink(props) {
	const router = inject(routerKey);
	const currentRoute = inject(routeLocationKey);
	const route = computed(() => {
		const to = unref(props.to);
		return router.resolve(to);
	});
	const activeRecordIndex = computed(() => {
		const { matched } = route.value;
		const { length } = matched;
		const routeMatched = matched[length - 1];
		const currentMatched = currentRoute.matched;
		if (!routeMatched || !currentMatched.length) return -1;
		const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
		if (index > -1) return index;
		const parentRecordPath = getOriginalPath(matched[length - 2]);
		return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
	});
	const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
	const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
	function navigate(e = {}) {
		if (guardEvent(e)) {
			const p = router[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop);
			if (props.viewTransition && typeof document !== "undefined" && "startViewTransition" in document) document.startViewTransition(() => p);
			return p;
		}
		return Promise.resolve();
	}
	/**
	* NOTE: update {@link _RouterLinkI}'s `$slots` type when updating this
	*/
	return {
		route,
		href: computed(() => route.value.href),
		isActive,
		isExactActive,
		navigate
	};
}
/** @internal */
function preferSingleVNode(vnodes) {
	return vnodes.length === 1 ? vnodes[0] : vnodes;
}
/**
* Component to render a link that triggers a navigation on click.
*/
var RouterLink = /* @__PURE__ */ defineComponent({
	name: "RouterLink",
	compatConfig: { MODE: 3 },
	props: {
		to: {
			type: [String, Object],
			required: true
		},
		replace: Boolean,
		activeClass: String,
		exactActiveClass: String,
		custom: Boolean,
		ariaCurrentValue: {
			type: String,
			default: "page"
		},
		viewTransition: Boolean
	},
	useLink,
	setup(props, { slots }) {
		const link = /* @__PURE__ */ reactive(useLink(props));
		const { options } = inject(routerKey);
		const elClass = computed(() => ({
			[getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
			[getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
		}));
		return () => {
			const children = slots.default && preferSingleVNode(slots.default(link));
			return props.custom ? children : h("a", {
				"aria-current": link.isExactActive ? props.ariaCurrentValue : null,
				href: link.href,
				onClick: link.navigate,
				class: elClass.value
			}, children);
		};
	}
});
/** @internal */
function guardEvent(e) {
	if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
	if (e.defaultPrevented) return;
	if (e.button !== void 0 && e.button !== 0) return;
	if (e.currentTarget && e.currentTarget.getAttribute) {
		const target = e.currentTarget.getAttribute("target");
		if (/\b_blank\b/i.test(target)) return;
	}
	if (e.preventDefault) e.preventDefault();
	return true;
}
/** @internal */
function includesParams(outer, inner) {
	for (const key in inner) {
		const innerValue = inner[key];
		const outerValue = outer[key];
		if (isArray(innerValue)) {
			if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value.valueOf() !== outerValue[i].valueOf())) return false;
		} else if (innerValue !== outerValue) return false;
	}
	return true;
}
/**
* Get the original path value of a record by following its aliasOf
* @param record
*/
function getOriginalPath(record) {
	return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
/**
* Utility class to get the active class based on defaults.
* @param propClass
* @param globalClass
* @param defaultClass
*/
var getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
// node_modules/vue-router/dist/vue-router.js
/*!
* vue-router v5.5.1
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
/**
* Creates a normalized history location from a window.location object
* @param base - The base path
* @param location - The window.location object
*/
function createCurrentLocation$1(base, location) {
	const { pathname, search, hash } = location;
	const hashPos = base.indexOf("#");
	if (hashPos > -1) {
		let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
		let pathFromHash = hash.slice(slicePos);
		if (pathFromHash[0] !== "/") pathFromHash = "/" + pathFromHash;
		return stripBase(pathFromHash, "");
	}
	return stripBase(pathname, base) + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
	let listeners = [];
	let teardowns = [];
	let pauseState = null;
	const popStateHandler = ({ state }) => {
		const to = createCurrentLocation$1(base, location);
		const from = currentLocation.value;
		const fromState = historyState.value;
		let delta = 0;
		if (state) {
			currentLocation.value = to;
			historyState.value = state;
			if (pauseState && pauseState === from) {
				pauseState = null;
				return;
			}
			delta = fromState ? state.position - fromState.position : 0;
		} else replace(to);
		listeners.forEach((listener) => {
			listener(currentLocation.value, from, {
				delta,
				type: "pop",
				direction: delta ? delta > 0 ? "forward" : "back" : ""
			});
		});
	};
	function pauseListeners() {
		pauseState = currentLocation.value;
	}
	function listen(callback) {
		listeners.push(callback);
		const teardown = () => {
			const index = listeners.indexOf(callback);
			if (index > -1) listeners.splice(index, 1);
		};
		teardowns.push(teardown);
		return teardown;
	}
	function pageHideListener() {
		saveScrollPosition(currentLocation.value);
	}
	function destroy() {
		for (const teardown of teardowns) teardown();
		teardowns = [];
		window.removeEventListener("popstate", popStateHandler);
		window.removeEventListener("pagehide", pageHideListener);
	}
	window.addEventListener("popstate", popStateHandler);
	window.addEventListener("pagehide", pageHideListener);
	return {
		pauseListeners,
		listen,
		destroy
	};
}
/**
* Creates a state object
*/
function buildState(back, current, forward, replaced = false) {
	return {
		back,
		current,
		forward,
		replaced,
		position: window.history.length
	};
}
function useHistoryStateNavigation(base) {
	const { history, location } = window;
	const currentLocation = { value: createCurrentLocation$1(base, location) };
	const historyState = { value: history.state };
	if (!historyState.value) changeLocation(currentLocation.value, {
		back: null,
		current: currentLocation.value,
		forward: null,
		position: history.length - 1,
		replaced: true
	}, true);
	function changeLocation(to, state, replace) {
		/**
		* if a base tag is provided, and we are on a normal domain, we have to
		* respect the provided `base` attribute because pushState() will use it and
		* potentially erase anything before the `#` like at
		* https://github.com/vuejs/router/issues/685 where a base of
		* `/folder/#` but a base of `/` would erase the `/folder/` section. If
		* there is no host, the `<base>` tag makes no sense and if there isn't a
		* base tag we can just use everything after the `#`.
		*/
		const hashIndex = base.indexOf("#");
		const url = hashIndex > -1 ? (location.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : "/." + base + to;
		try {
			history[replace ? "replaceState" : "pushState"](state, "", url);
			historyState.value = state;
		} catch (err) {
			console.error(err);
			location[replace ? "replace" : "assign"](url);
		}
	}
	function replace(to, data) {
		const state = assign({}, history.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
		changeLocation(to, state, true);
		invalidateScrollPositions(state.position, true);
		currentLocation.value = to;
	}
	function push(to, data) {
		const currentState = assign({}, historyState.value, history.state, { forward: to });
		changeLocation(currentState.current, currentState, true);
		invalidateScrollPositions(currentState.position);
		saveScrollPosition(currentState.current);
		changeLocation(to, assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data), false);
		currentLocation.value = to;
	}
	return {
		location: currentLocation,
		state: historyState,
		push,
		replace
	};
}
/**
* Creates an HTML5 history. Most common history for single page applications.
*
* @param base -
*/
function createWebHistory(base) {
	base = normalizeBase(base);
	const historyNavigation = useHistoryStateNavigation(base);
	const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
	function go(delta, triggerListeners = true) {
		if (!triggerListeners) historyListeners.pauseListeners();
		history.go(delta);
	}
	const routerHistory = assign({
		location: "",
		base,
		go,
		createHref: createHref.bind(null, base)
	}, historyNavigation, historyListeners);
	Object.defineProperty(routerHistory, "location", {
		enumerable: true,
		get: () => historyNavigation.location.value
	});
	Object.defineProperty(routerHistory, "state", {
		enumerable: true,
		get: () => historyNavigation.state.value
	});
	return routerHistory;
}
var ROOT_TOKEN = {
	type: 0,
	value: ""
};
var VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
	if (!path) return [[]];
	if (path === "/") return [[ROOT_TOKEN]];
	if (!isAbsolutePath(path)) throw new Error(`Invalid path "${path}"`);
	function crash(message) {
		throw new Error(`ERR (${state})/"${buffer}": ${message}`);
	}
	let state = 0;
	let previousState = state;
	const tokens = [];
	let segment;
	function finalizeSegment() {
		if (segment) tokens.push(segment);
		segment = [];
	}
	let i = 0;
	let char;
	let buffer = "";
	let customRe = "";
	function consumeBuffer() {
		if (!buffer) return;
		if (state === 0) segment.push({
			type: 0,
			value: buffer
		});
		else if (state === 1 || state === 2 || state === 3) {
			if (segment.length > 1 && (char === "*" || char === "+")) crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
			segment.push({
				type: 1,
				value: buffer,
				regexp: customRe,
				repeatable: char === "*" || char === "+",
				optional: char === "*" || char === "?"
			});
		} else crash("Invalid state to consume buffer");
		buffer = "";
	}
	function addCharToBuffer() {
		buffer += char;
	}
	while (i < path.length) {
		char = path[i++];
		switch (state) {
			case 0:
				if (char === "\\") {
					previousState = state;
					state = 4;
				} else if (char === "/") {
					if (buffer) consumeBuffer();
					finalizeSegment();
				} else if (char === ":") {
					consumeBuffer();
					state = 1;
				} else addCharToBuffer();
				break;
			case 4:
				addCharToBuffer();
				state = previousState;
				break;
			case 1:
				if (char === "(") state = 2;
				else if (VALID_PARAM_RE.test(char)) addCharToBuffer();
				else {
					consumeBuffer();
					state = 0;
					if (char !== "*" && char !== "?" && char !== "+") i--;
				}
				break;
			case 2:
				if (char === ")") {
					if (customRe[customRe.length - 1] == "\\") customRe = customRe.slice(0, -1) + char;
					else state = 3;
				} else customRe += char;
				break;
			case 3:
				consumeBuffer();
				state = 0;
				if (char !== "*" && char !== "?" && char !== "+") i--;
				customRe = "";
				break;
			default: crash("Unknown state");
		}
	}
	if (state === 2) crash(`Unfinished custom RegExp for param "${buffer}"`);
	consumeBuffer();
	finalizeSegment();
	return tokens;
}
var BASE_PARAM_PATTERN = "[^/]+?";
var BASE_PATH_PARSER_OPTIONS = {
	sensitive: false,
	strict: false,
	start: true,
	end: true
};
var REGEX_CHARS_RE = /[.+*?^${}()[\]/\\|]/g;
/**
* Creates a path parser from an array of Segments (a segment is an array of Tokens)
*
* @param segments - array of segments returned by tokenizePath
* @param extraOptions - optional options for the regexp
* @returns a PathParser
*/
function tokensToParser(segments, extraOptions) {
	const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
	const score = [];
	let pattern = options.start ? "^" : "";
	const keys = [];
	const hasBackreference = segments.some((segment) => segment.some((token) => token.type === 1 && /\\[1-9k]/.test(token.regexp || "")));
	for (const segment of segments) {
		const segmentScores = segment.length ? [] : [90];
		if (options.strict && !segment.length) pattern += "/";
		for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
			const token = segment[tokenIndex];
			let subSegmentScore = 40 + (options.sensitive ? .25 : 0);
			if (token.type === 0) {
				if (!tokenIndex) pattern += "/";
				pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
				subSegmentScore += 40;
			} else if (token.type === 1) {
				const { value, repeatable, optional, regexp } = token;
				keys.push({
					name: value,
					repeatable,
					optional
				});
				const re = regexp ? regexp : BASE_PARAM_PATTERN;
				if (re !== BASE_PARAM_PATTERN) {
					subSegmentScore += 10;
					try {
						new RegExp(`(${re})`);
					} catch (err) {
						throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` + err.message);
					}
				}
				let subPattern = repeatable && re !== ".+" && re !== ".*" ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;
				const next = segment[tokenIndex + 1];
				const afterNext = segment[tokenIndex + 2];
				if (!hasBackreference && !regexp && !repeatable && afterNext && afterNext.type === 1 && !afterNext.regexp && next.type === 0) subPattern = `([^/](?:(?!${next.value.replace(REGEX_CHARS_RE, "\\$&")})[^/])*)`;
				if (!tokenIndex) subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
				if (optional) subPattern += "?";
				pattern += subPattern;
				subSegmentScore += 20;
				if (optional) subSegmentScore += -8;
				if (repeatable) subSegmentScore += -20;
				if (re === ".*") subSegmentScore += -50;
			}
			segmentScores.push(subSegmentScore);
		}
		score.push(segmentScores);
	}
	if (options.strict && options.end) {
		const i = score.length - 1;
		score[i][score[i].length - 1] += .7000000000000001;
	}
	if (!options.strict) pattern += "/?";
	if (options.end) pattern += "$";
	else if (options.strict && !pattern.endsWith("/")) pattern += "(?:/|$)";
	const re = new RegExp(pattern, options.sensitive ? "" : "i");
	function parse(path) {
		const match = path.match(re);
		const params = {};
		if (!match) return null;
		for (let i = 1; i < match.length; i++) {
			const value = match[i] || "";
			const key = keys[i - 1];
			params[key.name] = value && key.repeatable ? value.split("/") : value;
		}
		return params;
	}
	function stringify(params) {
		let path = "";
		let avoidDuplicatedSlash = false;
		for (const segment of segments) {
			if (!avoidDuplicatedSlash || !path.endsWith("/")) path += "/";
			avoidDuplicatedSlash = false;
			for (const token of segment) if (token.type === 0) path += token.value;
			else if (token.type === 1) {
				const { value, repeatable, optional } = token;
				const param = value in params ? params[value] : "";
				if (isArray(param) && !repeatable) throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
				const text = isArray(param) ? param.join("/") : param;
				if (!text) {
					if (optional) {
						if (segment.length < 2) {
							if (path.endsWith("/")) path = path.slice(0, -1);
							else avoidDuplicatedSlash = true;
						}
					} else throw new Error(`Missing required param "${value}"`);
				}
				path += text;
			}
		}
		return path || "/";
	}
	return {
		re,
		score,
		keys,
		parse,
		stringify
	};
}
/**
* Compares an array of numbers as used in PathParser.score and returns a
* number. This function can be used to `sort` an array
*
* @param a - first array of numbers
* @param b - second array of numbers
* @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
* should be sorted first
*/
function compareScoreArray(a, b) {
	let i = 0;
	while (i < a.length && i < b.length) {
		const diff = b[i] - a[i];
		if (diff) return diff;
		i++;
	}
	if (a.length < b.length) return a.length === 1 && a[0] === 80 ? -1 : 1;
	else if (a.length > b.length) return b.length === 1 && b[0] === 80 ? 1 : -1;
	return 0;
}
/**
* Compare function that can be used with `sort` to sort an array of PathParser
*
* @param a - first PathParser
* @param b - second PathParser
* @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
*/
function comparePathParserScore(a, b) {
	let i = 0;
	const aScore = a.score;
	const bScore = b.score;
	while (i < aScore.length && i < bScore.length) {
		const comp = compareScoreArray(aScore[i], bScore[i]);
		if (comp) return comp;
		i++;
	}
	if (Math.abs(bScore.length - aScore.length) === 1) {
		if (isLastScoreNegative(aScore)) return 1;
		if (isLastScoreNegative(bScore)) return -1;
	}
	return bScore.length - aScore.length;
}
/**
* This allows detecting splats at the end of a path: /home/:id(.*)*
*
* @param score - score to check
* @returns true if the last entry is negative
*/
function isLastScoreNegative(score) {
	const last = score[score.length - 1];
	return score.length > 0 && last[last.length - 1] < 0;
}
var PATH_PARSER_OPTIONS_DEFAULTS = {
	strict: false,
	end: true,
	sensitive: false
};
function createRouteRecordMatcher(record, parent, options) {
	const matcher = assign(tokensToParser(tokenizePath(record.path), options), {
		record,
		parent,
		children: [],
		alias: []
	});
	if (parent) {
		if (!matcher.record.aliasOf === !parent.record.aliasOf) parent.children.push(matcher);
	}
	return matcher;
}
/**
* Creates a Router Matcher.
*
* @internal
* @param routes - array of initial routes
* @param globalOptions - global route options
*/
function createRouterMatcher(routes, globalOptions) {
	const matchers = [];
	const matcherMap = /* @__PURE__ */ new Map();
	globalOptions = mergeOptions(PATH_PARSER_OPTIONS_DEFAULTS, globalOptions);
	function getRecordMatcher(name) {
		return matcherMap.get(name);
	}
	function addRoute(record, parent, originalRecord) {
		const isRootAdd = !originalRecord;
		const mainNormalizedRecord = normalizeRouteRecord(record);
		mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
		const options = mergeOptions(globalOptions, record);
		const normalizedRecords = [mainNormalizedRecord];
		if ("alias" in record) {
			const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
			for (const alias of aliases) normalizedRecords.push(normalizeRouteRecord(assign({}, mainNormalizedRecord, {
				components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
				path: alias,
				aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
			})));
		}
		let matcher;
		let originalMatcher;
		for (const normalizedRecord of normalizedRecords) {
			const { path } = normalizedRecord;
			if (parent && !isAbsolutePath(path)) {
				const parentPath = parent.record.path;
				const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
				normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
			}
			matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
			if (originalRecord) originalRecord.alias.push(matcher);
			else {
				originalMatcher = originalMatcher || matcher;
				if (originalMatcher !== matcher) originalMatcher.alias.push(matcher);
				if (isRootAdd && record.name && !isAliasRecord(matcher)) removeRoute(record.name);
			}
			if (isMatchable(matcher)) insertMatcher(matcher);
			if (mainNormalizedRecord.children) {
				const children = mainNormalizedRecord.children;
				for (let i = 0; i < children.length; i++) addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
			}
			originalRecord = originalRecord || matcher;
		}
		return originalMatcher ? () => {
			removeRoute(originalMatcher);
		} : noop;
	}
	function removeRoute(matcherRef) {
		if (isRouteName(matcherRef)) {
			const matcher = matcherMap.get(matcherRef);
			if (matcher) {
				matcherMap.delete(matcherRef);
				matchers.splice(matchers.indexOf(matcher), 1);
				matcher.children.forEach(removeRoute);
				matcher.alias.forEach(removeRoute);
			}
		} else {
			const index = matchers.indexOf(matcherRef);
			if (index > -1) {
				matchers.splice(index, 1);
				if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name);
				matcherRef.children.forEach(removeRoute);
				matcherRef.alias.forEach(removeRoute);
			}
		}
	}
	function getRoutes() {
		return matchers;
	}
	function insertMatcher(matcher) {
		const index = findInsertionIndex(matcher, matchers);
		matchers.splice(index, 0, matcher);
		if (matcher.record.name && !isAliasRecord(matcher)) matcherMap.set(matcher.record.name, matcher);
	}
	function resolve(location, currentLocation) {
		let matcher;
		let params = {};
		let path;
		let name;
		if ("name" in location && location.name) {
			matcher = matcherMap.get(location.name);
			if (!matcher) throw createRouterError(1, { location });
			name = matcher.record.name;
			params = assign(pickParams(currentLocation.params, matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)), location.params && pickParams(location.params, matcher.keys.map((k) => k.name)));
			path = matcher.stringify(params);
		} else if (location.path != null) {
			path = location.path;
			matcher = matchers.find((m) => m.re.test(path));
			if (matcher) {
				params = matcher.parse(path);
				name = matcher.record.name;
				matcher.keys.forEach((key) => {
					if (key.optional && !params[key.name]) delete params[key.name];
				});
			}
		} else {
			matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
			if (!matcher) throw createRouterError(1, {
				location,
				currentLocation
			});
			name = matcher.record.name;
			params = assign({}, currentLocation.params, location.params);
			path = matcher.stringify(params);
		}
		const matched = [];
		let parentMatcher = matcher;
		while (parentMatcher) {
			matched.unshift(parentMatcher.record);
			parentMatcher = parentMatcher.parent;
		}
		return {
			name,
			path,
			params,
			matched,
			meta: mergeMetaFields(matched)
		};
	}
	routes.forEach((route) => addRoute(route));
	function clearRoutes() {
		matchers.length = 0;
		matcherMap.clear();
	}
	return {
		addRoute,
		resolve,
		removeRoute,
		clearRoutes,
		getRoutes,
		getRecordMatcher
	};
}
/**
* Picks an object param to contain only specified keys.
*
* @param params - params object to pick from
* @param keys - keys to pick
*/
function pickParams(params, keys) {
	const newParams = {};
	for (const key of keys) if (key in params) newParams[key] = params[key];
	return newParams;
}
/**
* Normalizes a RouteRecordRaw. Creates a copy
*
* @param record
* @returns the normalized version
*/
function normalizeRouteRecord(record) {
	const normalized = {
		path: record.path,
		redirect: record.redirect,
		name: record.name,
		meta: record.meta || {},
		aliasOf: record.aliasOf,
		beforeEnter: record.beforeEnter,
		props: normalizeRecordProps(record),
		children: record.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: "components" in record ? record.components || null : record.component && { default: record.component }
	};
	Object.defineProperty(normalized, "mods", { value: {} });
	return normalized;
}
/**
* Normalize the optional `props` in a record to always be an object similar to
* components. Also accept a boolean for components.
* @param record
*/
function normalizeRecordProps(record) {
	const propsObject = {};
	const props = record.props || false;
	if ("component" in record) propsObject.default = props;
	else for (const name in record.components) propsObject[name] = typeof props === "object" ? props[name] : props;
	return propsObject;
}
/**
* Checks if a record or any of its parent is an alias
* @param record
*/
function isAliasRecord(record) {
	while (record) {
		if (record.record.aliasOf) return true;
		record = record.parent;
	}
	return false;
}
/**
* Merge meta fields of an array of records
*
* @param matched - array of matched records
*/
function mergeMetaFields(matched) {
	return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
/**
* Performs a binary search to find the correct insertion index for a new matcher.
*
* Matchers are primarily sorted by their score. If scores are tied then we also consider parent/child relationships,
* with descendants coming before ancestors. If there's still a tie, new routes are inserted after existing routes.
*
* @param matcher - new matcher to be inserted
* @param matchers - existing matchers
*/
function findInsertionIndex(matcher, matchers) {
	let lower = 0;
	let upper = matchers.length;
	while (lower !== upper) {
		const mid = lower + upper >> 1;
		if (comparePathParserScore(matcher, matchers[mid]) < 0) upper = mid;
		else lower = mid + 1;
	}
	const insertionAncestor = getInsertionAncestor(matcher);
	if (insertionAncestor) upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
	return upper;
}
function getInsertionAncestor(matcher) {
	let ancestor = matcher;
	while (ancestor = ancestor.parent) if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) return ancestor;
}
/**
* Checks if a matcher can be reachable. This means if it's possible to reach it as a route. For example, routes without
* a component, or name, or redirect, are just used to group other routes.
* @param matcher
* @param matcher.record record of the matcher
* @returns
*/
function isMatchable({ record }) {
	return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
var RouterViewImpl = /*#__PURE__*/ defineComponent({
	name: "RouterView",
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: "default"
		},
		route: Object
	},
	compatConfig: { MODE: 3 },
	setup(props, { attrs, slots }) {
		const injectedRoute = inject(routerViewLocationKey);
		const routeToDisplay = computed(() => props.route || injectedRoute.value);
		const injectedDepth = inject(viewDepthKey, 0);
		const depth = computed(() => {
			let initialDepth = unref(injectedDepth);
			const { matched } = routeToDisplay.value;
			let matchedRoute;
			while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) initialDepth++;
			return initialDepth;
		});
		const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
		provide(viewDepthKey, computed(() => depth.value + 1));
		provide(matchedRouteKey, matchedRouteRef);
		provide(routerViewLocationKey, routeToDisplay);
		provide(routeLocationKey, createReactiveRoute(routeToDisplay));
		const onRouteRenderedCallbacks = /* @__PURE__ */ new Set();
		provide(routerViewOnRouteRenderedKey, onRouteRenderedCallbacks);
		const viewRef = /* @__PURE__ */ ref();
		let settledRoute = START_LOCATION_NORMALIZED;
		const { app } = getCurrentInstance().appContext;
		watch(() => [
			viewRef.value,
			matchedRouteRef.value,
			props.name
		], ([instance, to, name], [oldInstance, from, _oldName]) => {
			if (to) {
				to.instances[name] = instance;
				if (from && from !== to && instance && instance === oldInstance) {
					if (!to.leaveGuards.size) to.leaveGuards = from.leaveGuards;
					if (!to.updateGuards.size) to.updateGuards = from.updateGuards;
				}
			}
			if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
		}, { flush: "post" });
		return () => {
			const route = routeToDisplay.value;
			const currentName = props.name;
			const matchedRoute = matchedRouteRef.value;
			const ViewComponent = matchedRoute && matchedRoute.components[currentName];
			if (!ViewComponent) return normalizeSlot$1(slots.default, {
				Component: ViewComponent,
				route
			});
			const routePropsOption = matchedRoute.props[currentName];
			const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
			const onVnodeUnmounted = (vnode) => {
				if (vnode.component.isUnmounted) matchedRoute.instances[currentName] = null;
			};
			const onVnodeSettled = (vnode) => nextTick(() => {
				while (!vnode.el && vnode.component) vnode = vnode.component.subTree;
				if (settledRoute === route || routeToDisplay.value !== route || vnode.el?.getRootNode() !== app._container.getRootNode()) return;
				const from = settledRoute;
				settledRoute = route;
				for (const callback of onRouteRenderedCallbacks) callback(route, from);
			});
			const component = h(ViewComponent, assign({}, routeProps, attrs, {
				onVnodeUnmounted,
				onVnodeMounted: onVnodeSettled,
				onVnodeUpdated: onVnodeSettled,
				ref: viewRef
			}));
			return normalizeSlot$1(slots.default, {
				Component: component,
				route
			}) || component;
		};
	}
});
function normalizeSlot$1(slot, data) {
	if (!slot) return null;
	const slotContent = slot(data);
	return slotContent.length === 1 ? slotContent[0] : slotContent;
}
/**
* Component to display the current route the user is at.
*/
var RouterView = RouterViewImpl;
/**
* Creates a Router instance that can be used by a Vue app.
*
* @param options - {@link RouterOptions}
*/
function createRouter(options) {
	const matcher = options.matcher || createRouterMatcher(options.routes, options);
	const parseQuery$1 = options.parseQuery || parseQuery;
	const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
	const routerHistory = options.history;
	const beforeGuards = useCallbacks();
	const beforeResolveGuards = useCallbacks();
	const afterGuards = useCallbacks();
	const currentRoute = /* @__PURE__ */ shallowRef(START_LOCATION_NORMALIZED);
	const routesVersion = /* @__PURE__ */ shallowRef(0);
	let pendingLocation = START_LOCATION_NORMALIZED;
	if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) history.scrollRestoration = "manual";
	const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
	const encodeParams = applyToParams.bind(null, encodeParam);
	const decodeParams = applyToParams.bind(null, decode);
	function addRoute(parentOrRoute, route) {
		let parent;
		let record;
		if (isRouteName(parentOrRoute)) {
			parent = matcher.getRecordMatcher(parentOrRoute);
			record = route;
		} else record = parentOrRoute;
		const removeRoute = matcher.addRoute(record, parent);
		routesVersion.value++;
		return () => {
			removeRoute();
			routesVersion.value++;
		};
	}
	function removeRoute(name) {
		const recordMatcher = matcher.getRecordMatcher(name);
		if (recordMatcher) {
			matcher.removeRoute(recordMatcher);
			routesVersion.value++;
		}
	}
	function clearRoutes() {
		matcher.clearRoutes();
		routesVersion.value++;
	}
	function getRoutes() {
		return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
	}
	function hasRoute(name) {
		return !!matcher.getRecordMatcher(name);
	}
	function resolve(rawLocation, currentLocation) {
		routesVersion.value;
		if (typeof rawLocation === "string") {
			currentLocation = currentLocation || (rawLocation.startsWith("/") ? START_LOCATION_NORMALIZED : currentRoute.value);
			const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
			const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
			const href = routerHistory.createHref(locationNormalized.fullPath);
			return assign(locationNormalized, matchedRoute, {
				params: decodeParams(matchedRoute.params),
				redirectedFrom: void 0,
				href
			});
		}
		currentLocation = assign({}, currentLocation || (rawLocation.path != null && rawLocation.path.startsWith("/") && !("name" in rawLocation && rawLocation.name) ? START_LOCATION_NORMALIZED : currentRoute.value));
		let matcherLocation;
		if (rawLocation.path != null) matcherLocation = assign({}, rawLocation, { path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path });
		else {
			const targetParams = assign({}, rawLocation.params);
			for (const key in targetParams) if (targetParams[key] == null) delete targetParams[key];
			matcherLocation = assign({}, rawLocation, { params: encodeParams(targetParams) });
			currentLocation.params = encodeParams(currentLocation.params);
		}
		const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
		const hash = rawLocation.hash || "";
		matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
		const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
			hash: encodeHash(hash),
			path: matchedRoute.path
		}));
		const href = routerHistory.createHref(fullPath);
		return assign({
			fullPath,
			hash,
			query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
		}, matchedRoute, {
			redirectedFrom: void 0,
			href
		});
	}
	function locationAsObject(to) {
		return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
	}
	function checkCanceledNavigation(to, from) {
		if (pendingLocation !== to) return createRouterError(8, {
			from,
			to
		});
	}
	function push(to) {
		return pushWithRedirect(to);
	}
	function replace(to) {
		return push(assign(locationAsObject(to), { replace: true }));
	}
	function handleRedirectRecord(to, from) {
		const lastMatched = to.matched[to.matched.length - 1];
		if (lastMatched && lastMatched.redirect) {
			const { redirect } = lastMatched;
			let newTargetLocation = typeof redirect === "function" ? redirect(to, from) : redirect;
			if (typeof newTargetLocation === "string") {
				newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
				newTargetLocation.params = {};
			}
			return assign({
				query: to.query,
				hash: to.hash,
				params: newTargetLocation.path != null ? {} : to.params
			}, newTargetLocation);
		}
	}
	function pushWithRedirect(to, redirectedFrom) {
		const targetLocation = pendingLocation = resolve(to);
		const from = currentRoute.value;
		const data = to.state;
		const force = to.force;
		const replace = to.replace === true;
		const shouldRedirect = handleRedirectRecord(targetLocation, from);
		if (shouldRedirect) return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
			state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
			force,
			replace
		}), redirectedFrom || targetLocation);
		const toLocation = targetLocation;
		toLocation.redirectedFrom = redirectedFrom;
		let failure;
		if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
			failure = createRouterError(16, {
				to: toLocation,
				from
			});
			handleScroll(from, from);
		}
		return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure) => {
			if (failure) {
				if (isNavigationFailure(failure, 2)) return pushWithRedirect(assign({ replace }, locationAsObject(failure.to), {
					state: typeof failure.to === "object" ? assign({}, data, failure.to.state) : data,
					force
				}), redirectedFrom || toLocation);
			} else failure = finalizeNavigation(toLocation, from, true, replace, data);
			triggerAfterEach(toLocation, from, failure);
			return failure;
		});
	}
	/**
	* Helper to reject and skip all navigation guards if a new navigation happened
	* @param to
	* @param from
	*/
	function checkCanceledNavigationAndReject(to, from) {
		const error = checkCanceledNavigation(to, from);
		return error ? Promise.reject(error) : Promise.resolve();
	}
	function runWithContext(fn) {
		const app = installedApps.values().next().value;
		return app && typeof app.runWithContext === "function" ? app.runWithContext(fn) : fn();
	}
	function navigate(to, from) {
		let guards;
		const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
		guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
		for (const record of leavingRecords) record.leaveGuards.forEach((guard) => {
			guards.push(guardToPromiseFn(guard, to, from));
		});
		const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
		guards.push(canceledNavigationCheck);
		return runGuardQueue(guards).then(() => {
			guards = [];
			for (const guard of beforeGuards.list()) guards.push(guardToPromiseFn(guard, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
			for (const record of updatingRecords) record.updateGuards.forEach((guard) => {
				guards.push(guardToPromiseFn(guard, to, from));
			});
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = [];
			for (const record of enteringRecords) if (record.beforeEnter) {
				if (isArray(record.beforeEnter)) for (const beforeEnter of record.beforeEnter) guards.push(guardToPromiseFn(beforeEnter, to, from));
				else guards.push(guardToPromiseFn(record.beforeEnter, to, from));
			}
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			to.matched.forEach((record) => record.enterCallbacks = {});
			guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = [];
			for (const guard of beforeResolveGuards.list()) guards.push(guardToPromiseFn(guard, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
	}
	function triggerAfterEach(to, from, failure) {
		afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
	}
	/**
	* - Cleans up any navigation guards
	* - Changes the url if necessary
	* - Calls the scrollBehavior
	*/
	function finalizeNavigation(toLocation, from, isPush, replace, data) {
		const error = checkCanceledNavigation(toLocation, from);
		if (error) return error;
		const isFirstNavigation = from === START_LOCATION_NORMALIZED;
		const savedPosition = isBrowser && (isFirstNavigation || !isPush) && getSavedScrollPosition(toLocation.fullPath);
		if (isPush) {
			if (replace || isFirstNavigation) routerHistory.replace(toLocation.fullPath, data);
			else routerHistory.push(toLocation.fullPath, data);
		}
		currentRoute.value = toLocation;
		handleScroll(toLocation, from, savedPosition);
		markAsReady();
	}
	let removeHistoryListener;
	function setupListeners() {
		if (removeHistoryListener) return;
		removeHistoryListener = routerHistory.listen((to, _from, info) => {
			if (!router.listening) return;
			const toLocation = resolve(to);
			const shouldRedirect = handleRedirectRecord(toLocation, router.currentRoute.value);
			if (shouldRedirect) {
				pushWithRedirect(assign(shouldRedirect, {
					replace: true,
					force: true
				}), toLocation).catch(noop);
				return;
			}
			pendingLocation = toLocation;
			const from = currentRoute.value;
			if (isBrowser && info.delta) saveScrollPosition(from.fullPath, info.delta);
			navigate(toLocation, from).catch((error) => {
				if (isNavigationFailure(error, 12)) return error;
				if (isNavigationFailure(error, 2)) {
					pushWithRedirect(assign(locationAsObject(error.to), { force: true }), toLocation).then((failure) => {
						if (isNavigationFailure(failure, 20) && !info.delta && info.type === "pop") routerHistory.go(-1, false);
					}).catch(noop);
					return Promise.reject();
				}
				if (info.delta) routerHistory.go(-info.delta, false);
				return triggerError(error, toLocation, from);
			}).then((failure) => {
				failure = failure || finalizeNavigation(toLocation, from, false);
				if (failure) {
					if (info.delta && !isNavigationFailure(failure, 8)) routerHistory.go(-info.delta, false);
					else if (info.type === "pop" && isNavigationFailure(failure, 20)) routerHistory.go(-1, false);
				}
				triggerAfterEach(toLocation, from, failure);
			}).catch(noop);
		});
	}
	let readyHandlers = useCallbacks();
	let errorListeners = useCallbacks();
	let ready;
	/**
	* Trigger errorListeners added via onError and throws the error as well
	*
	* @param error - error to throw
	* @param to - location we were navigating to when the error happened
	* @param from - location we were navigating from when the error happened
	* @returns the error as a rejected promise
	*/
	function triggerError(error, to, from) {
		markAsReady(error);
		const list = errorListeners.list();
		if (list.length) list.forEach((handler) => handler(error, to, from));
		else console.error(error);
		return Promise.reject(error);
	}
	function isReady() {
		if (ready && currentRoute.value !== START_LOCATION_NORMALIZED) return Promise.resolve();
		return new Promise((resolve, reject) => {
			readyHandlers.add([resolve, reject]);
		});
	}
	function markAsReady(err) {
		if (!ready) {
			ready = !err;
			setupListeners();
			readyHandlers.list().forEach(([resolve, reject]) => err ? reject(err) : resolve());
			readyHandlers.reset();
		}
		return err;
	}
	function handleScroll(to, from, savedPosition) {
		const { scrollBehavior } = options;
		if (!isBrowser || !scrollBehavior) return Promise.resolve();
		return nextTick().then(() => scrollBehavior(to, from, savedPosition || null)).then((position) => to === currentRoute.value && position && scrollToPosition(position)).catch((err) => to === currentRoute.value && triggerError(err, to, from));
	}
	const go = (delta) => routerHistory.go(delta);
	let started;
	const installedApps = /* @__PURE__ */ new Set();
	const router = {
		currentRoute,
		listening: true,
		addRoute,
		removeRoute,
		clearRoutes,
		hasRoute,
		getRoutes,
		resolve,
		options,
		push,
		replace,
		go,
		back: () => go(-1),
		forward: () => go(1),
		beforeEach: beforeGuards.add,
		beforeResolve: beforeResolveGuards.add,
		afterEach: afterGuards.add,
		onError: errorListeners.add,
		isReady,
		install(app) {
			app.component("RouterLink", RouterLink);
			app.component("RouterView", RouterView);
			app.config.globalProperties.$router = router;
			Object.defineProperty(app.config.globalProperties, "$route", {
				enumerable: true,
				get: () => unref(currentRoute)
			});
			if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
				started = true;
				push(routerHistory.location).catch((err) => {});
			}
			app.provide(routerKey, router);
			app.provide(routeLocationKey, createReactiveRoute(currentRoute));
			app.provide(routerViewLocationKey, currentRoute);
			const unmountApp = app.unmount;
			installedApps.add(app);
			app.unmount = function() {
				installedApps.delete(app);
				if (installedApps.size < 1) {
					pendingLocation = START_LOCATION_NORMALIZED;
					removeHistoryListener && removeHistoryListener();
					removeHistoryListener = null;
					currentRoute.value = START_LOCATION_NORMALIZED;
					started = false;
					ready = false;
				}
				unmountApp();
			};
		}
	};
	function runGuardQueue(guards) {
		return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
	}
	return router;
}
// node_modules/nuxt/dist/app/components/utils.js
/**
* Internal utility
* @private
*/
var _wrapInTransition = (props, children) => {
	return { default: () => props ? h(Transition, props === true ? {} : props, children) : children.default?.() };
};
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
	const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
	return typeof source === "function" ? source(route) : source;
}
/**
* Utility used within router guards
* return true if the route has been changed with a page change during navigation
*/
function isChangingPage(to, from) {
	if (to === from || from === START_LOCATION_NORMALIZED) return false;
	if (generateRouteKey(to) !== generateRouteKey(from)) return true;
	if (to.matched.every((comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default)) return false;
	return true;
}
/**
* Retrieve the HTML content from an element
* Handles `<!--[-->` Fragment elements
* @param element the element to retrieve the HTML
* @param withoutSlots purge all slots from the HTML string retrieved
* @returns {string[]|undefined} An array of string which represent the content of each element. Use `.join('')` to retrieve a component vnode.el HTML
*/
function getFragmentHTML(element, withoutSlots = false) {
	if (element) {
		if (element.nodeName === "#comment" && element.nodeValue === "[") return getFragmentChildren(element, [], withoutSlots);
		return [getElementHTML(element, withoutSlots)];
	}
}
function getFragmentChildren(element, blocks = [], withoutSlots = false) {
	let current = element;
	while (current?.nodeName && !isEndFragment(current)) {
		if (!isStartFragment(current)) blocks.push(getElementHTML(current, withoutSlots));
		current = current.nextSibling;
	}
	return blocks;
}
var ISLAND_TELEPORT_TARGET_SELECTOR = "[data-island-slot],[data-island-component]";
function getElementHTML(element, withoutSlots) {
	if (!withoutSlots || !element.querySelector?.(ISLAND_TELEPORT_TARGET_SELECTOR)) return element.outerHTML;
	const template = element.ownerDocument.createElement("template");
	template.innerHTML = element.outerHTML;
	template.content.querySelectorAll(ISLAND_TELEPORT_TARGET_SELECTOR).forEach((n) => {
		n.innerHTML = "";
	});
	return template.innerHTML;
}
/**
* Return a static vnode from an element
* Default to a div if the element is not found and if a fallback is not provided
* @param el renderer node retrieved from the component internal instance
* @param staticNodeFallback fallback string to use if the element is not found. Must be a valid HTML string
*/
function elToStaticVNode(el, staticNodeFallback) {
	const fragment = el ? getFragmentHTML(el) : staticNodeFallback ? [staticNodeFallback] : void 0;
	if (fragment) return createStaticVNode(fragment.join(""), fragment.length);
	return h("div");
}
function isStartFragment(element) {
	return element.nodeName === "#comment" && element.nodeValue === "[";
}
function isEndFragment(element) {
	return element.nodeName === "#comment" && element.nodeValue === "]";
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
/**
* Internal utility
* @private
*/
function _mergeTransitionProps(routeProps) {
	const _props = [];
	for (const prop of routeProps) {
		if (!prop) continue;
		_props.push({
			...prop,
			onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0,
			onBeforeLeave: prop.onBeforeLeave ? toArray(prop.onBeforeLeave) : void 0
		});
	}
	return defu(..._props);
}
function _startTransition(nuxtApp) {
	nuxtApp["~transitionPromise"] ||= new Promise((resolve) => {
		nuxtApp["~transitionFinish"] = resolve;
	});
}
function _finishTransition(nuxtApp) {
	nuxtApp["~transitionFinish"]?.();
	delete nuxtApp["~transitionFinish"];
	delete nuxtApp["~transitionPromise"];
}
// node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION_NORMALIZED) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(hash) {
	const elem = document.getElementById(hash.slice(1));
	if (!elem) return 0;
	return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	sensitive: false,
	...router_options_default
};
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [/* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
	if (!to.meta?.validate) return;
	const result = await Promise.resolve(to.meta.validate(to));
	if (result === true) return;
	return createError({
		fatal: true,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
}), /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
	const rules = getRouteRules({ path: to.path });
	if (rules.redirect) {
		const path = rules.redirect.includes("#") ? rules.redirect : rules.redirect + to.hash;
		if (isAbsoluteHref(path)) {
			window.location.href = path;
			return false;
		}
		return path;
	}
})];
var namedMiddleware = {};
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froutes.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default = [{
	name: "index",
	path: "/",
	component: () => __vitePreload(() => import("./De33VE6A.js"), __vite__mapDeps([0,1]), import.meta.url)
}];
// node_modules/nuxt/dist/pages/runtime/plugins/router.js
var PATH_TRAILING_SLASH_RE = /\/(?=$|[?#])/;
function createCurrentLocation(base, location, renderedPath) {
	const { pathname, search, hash } = location;
	const hashPos = base.indexOf("#");
	if (hashPos > -1) {
		const slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
		let pathFromHash = hash.slice(slicePos);
		if (pathFromHash[0] !== "/") pathFromHash = "/" + pathFromHash;
		return withoutBase(pathFromHash, "");
	}
	const displayedPath = withoutBase(pathname, base);
	const path = !renderedPath || isSamePath(displayedPath, renderedPath) ? displayedPath : renderedPath;
	return path + (path.includes("?") ? "" : search) + hash;
}
var plugin$7 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let routerBase = (/* @__PURE__ */ useRuntimeConfig$1()).app.baseURL;
		const history = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.history?.(routerBase) ?? createWebHistory(routerBase);
		const routes = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes ? await virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default) ?? virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default : virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION_NORMALIZED) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in window.history) {
						const unsub = router.beforeEach(() => {
							unsub();
							window.history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION_NORMALIZED, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		if ("scrollRestoration" in window.history) window.history.scrollRestoration = "auto";
		nuxtApp.vueApp.use(router);
		const previousRoute = /* @__PURE__ */ shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = createCurrentLocation(routerBase, window.location, nuxtApp.payload.path);
		const documentPath = withoutBase(window.location.pathname, routerBase);
		const _route = /* @__PURE__ */ shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey$1({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey$1({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = /* @__PURE__ */ shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = /* @__PURE__ */ useError();
		function endNavigation(to) {
			if (nuxtApp._middlewareTo && (nuxtApp._middlewareTo.redirectedFrom ?? nuxtApp._middlewareTo) === (to.redirectedFrom ?? to)) delete nuxtApp._middlewareTo;
		}
		router.afterEach(async (to, _from, failure) => {
			endNavigation(to);
			if (!nuxtApp.isHydrating && error.value && !isNavigationFailure(failure, NavigationFailureType.aborted | NavigationFailureType.cancelled)) await nuxtApp.runWithContext(clearError);
			if (failure) await nuxtApp.callHook("page:loading:end");
		});
		router.onError(async (_error, to) => {
			endNavigation(to);
			await nuxtApp.callHook("page:loading:end");
		});
		try {
			await router.isReady();
		} catch (error) {
			await _showErrorUnlessCrawler(nuxtApp, error);
		}
		const resolvedInitialRoute = initialURL !== router.currentRoute.value.fullPath ? router.resolve(initialURL) : router.currentRoute.value;
		const prePluginRoutePath = router.currentRoute.value.fullPath;
		const hasDeferredRoute = nuxtApp.isHydrating && nuxtApp.payload.prerenderedAt && nuxtApp.payload.path && initialURL.replace(PATH_TRAILING_SLASH_RE, "") !== nuxtApp.payload.path.replace(PATH_TRAILING_SLASH_RE, "") && isSamePath(router.currentRoute.value.path, nuxtApp.payload.path);
		syncCurrentRoute();
		function pushErroredRoute(to) {
			if (!nuxtApp.isHydrating && to.fullPath !== createCurrentLocation(routerBase, window.location)) history.push(to.fullPath);
		}
		router.beforeEach((to) => {
			if (nuxtApp.isHydrating) return;
			if (virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default(to.path).noScripts) {
				window.location.assign(router.resolve(to.fullPath).href);
				return false;
			}
		});
		router.beforeResolve((to) => {
			if (to.matched.length || isSamePath(to.path, documentPath)) return;
			const url = new URL(withBase(to.fullPath, routerBase), window.location.href);
			if (url.origin === window.location.origin) {
				window.location.assign(url);
				return false;
			}
		});
		const initialLayout = nuxtApp.payload.state._layout;
		let runningMiddleware = 0;
		router.beforeEach(async (to, from) => {
			runningMiddleware++;
			try {
				return await runMiddleware(to, from);
			} finally {
				if (--runningMiddleware === 0) delete nuxtApp._processingMiddleware;
			}
		});
		async function runMiddleware(to, from) {
			await nuxtApp.callHook("page:loading:start");
			to.meta = /* @__PURE__ */ reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !/* @__PURE__ */ isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			{
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray$1(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const run = () => nuxtApp.runWithContext(() => middleware(to, from));
						const result = await run();
						if (!nuxtApp.payload.serverRendered && nuxtApp.isHydrating) {
							if (result === false || result instanceof Error) {
								const error = result || createError({
									status: 404,
									statusText: `Page Not Found: ${initialURL}`
								});
								await nuxtApp.runWithContext(() => showError(error));
								return false;
							}
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) {
								await nuxtApp.runWithContext(() => showError(result));
								pushErroredRoute(to);
							}
							return result;
						}
					} catch (err) {
						const error = createErrorFromThrown(err);
						if (error.fatal) {
							await nuxtApp.runWithContext(() => showError(error));
							pushErroredRoute(to);
						}
						return error;
					}
				}
			}
		}
		router.afterEach((to, _from, failure) => {
			if (to.matched.length === 0 && !error.value && !isNavigationFailure(failure, NavigationFailureType.aborted | NavigationFailureType.cancelled)) return nuxtApp.runWithContext(() => showError(createError({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				if (router.currentRoute.value.fullPath !== prePluginRoutePath) {} else if (hasDeferredRoute) {
					const payloadRoute = router.resolve(nuxtApp.payload.path);
					if ("name" in payloadRoute) payloadRoute.name = void 0;
					await router.replace({
						...payloadRoute,
						force: true
					});
					const restoreDeferredRoute = () => {
						if (!nuxtApp["~restoreDeferredRoute"]) return;
						nuxtApp["~restoreDeferredRoute"] = void 0;
						const currentRoute = router.currentRoute;
						const restoredRoute = router.resolve(initialURL);
						if (restoredRoute.matched.at(-1) === currentRoute.value.matched.at(-1)) restoredRoute.meta = currentRoute.value.meta;
						currentRoute.value = restoredRoute;
						syncCurrentRoute();
						router.replace({
							...resolvedInitialRoute,
							force: true
						}).catch(() => {});
					};
					nuxtApp["~restoreDeferredRoute"] = restoreDeferredRoute;
					nuxtApp.hooks.hookOnce("app:suspense:resolve", restoreDeferredRoute);
				} else await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
});
// node_modules/nuxt/dist/app/composables/ready.js
/** @since 3.1.0 */
var onNuxtReady = (callback) => {
	const nuxtApp = useNuxtApp();
	if (nuxtApp.isHydrating) nuxtApp.hooks.hookOnce("app:suspense:resolve", () => {
		requestIdleCallback(() => callback());
	});
	else requestIdleCallback(() => callback());
};
// node_modules/nuxt/dist/app/plugins/payload.client.js
var forwardedHintEntries = /* @__PURE__ */ new Set();
var forwardedHintHrefs = /* @__PURE__ */ new Set();
var MAX_HINTS_PER_ROUTE = 2;
var FORWARDED_HINT_TIMEOUT_MS = 3e4;
function disposeHint(entry) {
	if (forwardedHintEntries.delete(entry)) entry.dispose();
}
function documentHrefs() {
	const hrefs = /* @__PURE__ */ new Set();
	for (const link of document.head.querySelectorAll("link[href]")) hrefs.add(link.href);
	return hrefs;
}
function selectHints(prefetchLinks) {
	const existingHrefs = documentHrefs();
	const selected = [];
	for (const link of prefetchLinks) {
		if (selected.length >= MAX_HINTS_PER_ROUTE) break;
		if (typeof link.href !== "string") continue;
		const href = new URL(link.href, window.location.href).href;
		if (existingHrefs.has(href) || forwardedHintHrefs.has(href)) continue;
		forwardedHintHrefs.add(href);
		if (link.as === "image") {
			const { fetchpriority: _fetchpriority, ...rest } = link;
			selected.push({
				href,
				link: rest
			});
		} else {
			const { rel: _rel, ...rest } = link;
			selected.push({
				href,
				link: {
					...rest,
					rel: "prefetch"
				}
			});
		}
	}
	return selected;
}
var plugin$6 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:payload",
	setup(nuxtApp) {
		const staticKeysToRemove = /* @__PURE__ */ new Set();
		const router = useRouter();
		const { schedule } = usePrefetchScheduler(nuxtApp);
		router.beforeResolve(async (to, from) => {
			const queryAware = isCachedPayloadRoute(to.path);
			const toURL = queryAware ? withoutFragment(to.fullPath) : to.path;
			if (toURL === (queryAware ? withoutFragment(from.fullPath) : from.path)) return;
			const payload = await loadPayload(toURL);
			if (!payload) return;
			for (const key of staticKeysToRemove) delete nuxtApp.static.data[key];
			for (const key in payload.data) {
				if (!(key in nuxtApp.static.data)) staticKeysToRemove.add(key);
				nuxtApp.static.data[key] = payload.data[key];
			}
		});
		const head = null;
		const forwardHint = (link) => (signal) => new Promise((resolve) => {
			if (signal.aborted) return resolve();
			const hint = {};
			const complete = (dispose) => {
				clearTimeout(hint.timeout);
				signal.removeEventListener("abort", onAbort);
				if (dispose && hint.entry) disposeHint(hint.entry);
				resolve();
			};
			const onAbort = () => complete(true);
			signal.addEventListener("abort", onAbort);
			hint.entry = head.push({ link: [{
				...link,
				onerror: () => complete(true),
				onload: () => complete(false)
			}] });
			forwardedHintEntries.add(hint.entry);
			hint.timeout = setTimeout(() => complete(true), FORWARDED_HINT_TIMEOUT_MS);
		});
		nuxtApp.hooks.hook("link:prefetch", (url) => {
			onNuxtReady(() => {
				const { hostname } = new URL(url, window.location.href);
				if (hostname !== window.location.hostname) return;
				const group = prefetchGroup(url);
				schedule({
					key: `payload:${url}`,
					priority: "payload",
					scope: "navigation",
					group,
					run: async (signal, promoted) => {
						if (signal.aborted) return;
						const payload = await loadPayload(url, {
							signal,
							promoted
						}).catch(() => {
							stateDiagnostics.NUXT_E7003({ url });
						});
						if (signal.aborted || true) return;
						schedule(selectHints(payload.prefetchLinks).map(({ href, link }) => ({
							key: `hint:${href}`,
							priority: "hint",
							scope: "navigation",
							group,
							run: forwardHint(link)
						})));
					}
				});
			});
		});
		onNuxtReady(() => {
			if (canPrefetch()) setTimeout(getAppManifest, 1e3);
		});
	}
});
// node_modules/nuxt/dist/app/plugins/navigation-repaint.client.js
var plugin$5 = /* @__PURE__ */ defineNuxtPlugin(() => {
	const router = useRouter();
	onNuxtReady(() => {
		router.beforeResolve(async () => {
			/**
			* This gives an opportunity for the browser to repaint, acknowledging user interaction.
			* It can reduce INP when navigating on prerendered routes.
			*
			* @see https://github.com/nuxt/nuxt/issues/26271#issuecomment-2178582037
			* @see https://vercel.com/blog/demystifying-inp-new-tools-and-actionable-insights
			*/
			await new Promise((resolve) => {
				setTimeout(resolve, 100);
				requestAnimationFrame(() => {
					setTimeout(resolve, 0);
				});
			});
		});
	});
});
// node_modules/nuxt/dist/app/plugins/check-outdated-build.client.js
var plugin$4 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
	let timeout;
	async function getLatestManifest() {
		let currentManifest;
		try {
			currentManifest = await getAppManifest();
		} catch (e) {
			const err = e;
			if (!("status" in err && (err.status === 404 || err.status === 403))) throw err;
		}
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(getLatestManifest, outdatedBuildInterval);
		try {
			const meta = await $fetch(buildAssetsURL("builds/latest.json") + `?${Date.now()}`);
			if (meta.id !== currentManifest?.id) {
				nuxtApp.hooks.callHook("app:manifest:update", meta);
				if (timeout) clearTimeout(timeout);
			}
		} catch {}
	}
	onNuxtReady(() => {
		timeout = setTimeout(getLatestManifest, outdatedBuildInterval);
	});
});
// node_modules/nuxt/dist/app/composables/chunk.js
/** @since 3.3.0 */
function reloadNuxtApp(options = {}) {
	const path = options.path || window.location.pathname;
	const url = new URL(path, window.location.href);
	if (url.host !== window.location.host) throw navigationDiagnostics.NUXT_E2010({ path });
	if (url.protocol && isScriptProtocol(url.protocol)) throw navigationDiagnostics.NUXT_E2002({
		toPath: path,
		protocol: url.protocol
	});
	let handledPath = {};
	try {
		handledPath = JSON.parse(sessionStorage.getItem("nuxt:reload") || "{}");
	} catch {}
	if (options.force || handledPath?.path !== path || handledPath?.expires < Date.now()) {
		try {
			sessionStorage.setItem("nuxt:reload", JSON.stringify({
				path,
				expires: Date.now() + (options.ttl ?? 1e4)
			}));
		} catch {}
		if (options.persistState) try {
			sessionStorage.setItem("nuxt:reload:state", JSON.stringify({ state: useNuxtApp().payload.state }));
		} catch {}
		if (window.location.pathname !== path) window.location.href = path;
		else window.location.reload();
	}
}
// node_modules/nuxt/dist/app/plugins/chunk-reload-crawler.client.js
var plugin$3 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:chunk-reload-crawler",
	setup(nuxtApp) {
		let isHydrating = true;
		nuxtApp.hooks.hookOnce("app:suspense:resolve", () => {
			isHydrating = false;
		});
		nuxtApp.hook("app:chunkError", () => {
			if (isHydrating && isBotUserAgent(navigator.userAgent)) reloadNuxtApp();
		});
	}
});
// node_modules/nuxt/dist/app/plugins/chunk-reload.client.js
var plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:chunk-reload",
	setup(nuxtApp) {
		const router = useRouter();
		const config = /* @__PURE__ */ useRuntimeConfig$1();
		const chunkErrors = /* @__PURE__ */ new Set();
		router.beforeEach(() => {
			chunkErrors.clear();
		});
		nuxtApp.hook("app:chunkError", ({ error }) => {
			chunkErrors.add(error);
		});
		function reloadAppAtPath(to) {
			reloadNuxtApp({
				path: joinURL(config.app.baseURL, to.fullPath),
				persistState: true
			});
		}
		nuxtApp.hook("app:manifest:update", () => {
			router.beforeResolve(reloadAppAtPath);
		});
		router.onError((error, to) => {
			if (chunkErrors.has(error)) reloadAppAtPath(to);
		});
	}
});
// node_modules/nuxt/dist/app/composables/preload.js
function _loadAsyncComponent(component) {
	if (component?.__asyncLoader && !component.__asyncResolved) return component.__asyncLoader();
}
function loadRouteComponents(matched) {
	return Promise.all(matched.map((route) => {
		const component = route.components?.default;
		return typeof component === "function" ? Promise.resolve(component()).catch(() => {}) : void 0;
	}));
}
/**
* Queued form of `preloadRouteComponents`, throttled and promoted with the destination's other work.
* @internal
*/
function prefetchRouteComponents(to, router) {
	const { fullPath, path, matched } = router.resolve(to);
	if (!matched.length) return;
	const scheduler = tryUseNuxtApp()?._prefetch;
	if (!scheduler) {
		loadRouteComponents(matched);
		return;
	}
	scheduler.schedule({
		key: `route:${path}`,
		priority: "route",
		scope: "navigation",
		group: prefetchGroup(fullPath),
		run: (signal) => signal.aborted ? void 0 : loadRouteComponents(matched)
	});
}
// node_modules/nuxt/dist/app/components/nuxt-link.js
var firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtLink(options) {
	const componentName = options.componentName || "NuxtLink";
	function isHashLinkWithoutHashMode(link) {
		return typeof link === "string" && link.startsWith("#");
	}
	function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
		const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
		if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") return to;
		if (typeof to === "string") return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
		const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
		return {
			...to,
			name: void 0,
			path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
		};
	}
	/**
	* The link state `<NuxtLink>` renders with. Kept separate from `useNuxtLink` so the component
	* does not resolve the `<RouterLink>` link state backing `route`/`isActive`/`isExactActive`,
	* which it never reads.
	*/
	function useLinkTarget(props) {
		const router = useRouter();
		const config = /* @__PURE__ */ useRuntimeConfig$1();
		const rootedHref = router.options?.history?.createHref ?? ((path) => joinURL(config.app.baseURL, path));
		const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
		const isAbsoluteUrl = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			return typeof path === "string" && isAbsoluteHref(path);
		});
		const isExternal = computed(() => {
			if (unref(props.external)) return true;
			const path = unref(props.to) || unref(props.href) || "";
			if (typeof path === "object") return false;
			return path === "" || isAbsoluteUrl.value;
		});
		const to = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			if (isExternal.value) return path;
			return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
		});
		const href = computed(() => {
			const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
			if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
				const raw = to.value;
				return typeof raw === "string" ? sanitizeAnchorHref(raw) : raw;
			}
			if (isExternal.value) {
				const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
				const href = typeof path === "object" ? router.resolve(path).href : path;
				const safe = typeof href === "string" ? sanitizeAnchorHref(href) : href;
				return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
			}
			if (typeof to.value === "object") return router.resolve(to.value)?.href ?? null;
			return applyTrailingSlashBehavior(isRootedPath(to.value) ? rootedHref(to.value) : router.resolve(to.value).href, effectiveTrailingSlash);
		});
		return {
			to,
			hasTarget,
			isAbsoluteUrl,
			isExternal,
			href,
			async navigate(_e) {
				if (href.value === null) return;
				await navigateTo(href.value, {
					replace: unref(props.replace),
					external: isExternal.value || hasTarget.value
				});
			}
		};
	}
	function useNuxtLink(props) {
		const router = useRouter();
		const target = useLinkTarget(props);
		const builtinRouterLink = resolveComponent("RouterLink");
		const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
		const link = target.isExternal.value ? void 0 : useBuiltinLink?.({
			...props,
			to: target.to,
			viewTransition: unref(props.viewTransition)
		});
		return {
			...target,
			isActive: link?.isActive ?? computed(() => target.to.value === router.currentRoute.value.path),
			isExactActive: link?.isExactActive ?? computed(() => target.to.value === router.currentRoute.value.path),
			route: link?.route ?? computed(() => router.resolve(target.to.value))
		};
	}
	return /* @__PURE__ */ defineComponent({
		name: componentName,
		props: {
			to: {
				type: [String, Object],
				required: false
			},
			href: {
				type: [String, Object],
				required: false
			},
			target: {
				type: String,
				required: false
			},
			rel: {
				type: String,
				required: false
			},
			noRel: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetchOn: {
				type: [String, Object],
				required: false
			},
			noPrefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			activeClass: {
				type: String,
				required: false
			},
			exactActiveClass: {
				type: String,
				required: false
			},
			prefetchedClass: {
				type: String,
				required: false
			},
			replace: {
				type: Boolean,
				default: void 0,
				required: false
			},
			ariaCurrentValue: {
				type: String,
				required: false
			},
			external: {
				type: Boolean,
				default: void 0,
				required: false
			},
			custom: {
				type: Boolean,
				default: void 0,
				required: false
			},
			trailingSlash: {
				type: String,
				required: false
			}
		},
		useLink: useNuxtLink,
		setup(props, { slots }) {
			const router = useRouter();
			const routerLinkComponent = resolveComponent("RouterLink");
			const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useLinkTarget(props);
			const prefetched = /* @__PURE__ */ shallowRef(false);
			const el = /* @__PURE__ */ ref(null);
			const elRef = (ref) => {
				el.value = props.custom ? ref?.$el?.nextElementSibling : ref?.$el;
			};
			function prefetchOn(mode) {
				return typeof props.prefetchOn === "string" ? props.prefetchOn === mode : props.prefetchOn?.[mode] ?? options.prefetchOn?.[mode];
			}
			function prefetchAllowed() {
				return Boolean((props.prefetch ?? options.prefetch) !== false && props.noPrefetch !== true && props.target !== "_blank" && canPrefetch());
			}
			function shouldPrefetch(mode) {
				return Boolean(!prefetched.value && prefetchOn(mode) && prefetchAllowed());
			}
			function resolvedPath() {
				const path = typeof to.value === "string" ? to.value : isExternal.value ? resolveRouteObject(to.value) : router.resolve(to.value).fullPath;
				return isExternal.value ? new URL(path, window.location.href).href : path;
			}
			function escalate() {
				if (!prefetched.value) {
					if (prefetchOn("interaction")) prefetch();
					return;
				}
				if (!isExternal.value) useNuxtApp()._prefetch?.promote(prefetchGroup(resolvedPath()));
			}
			async function prefetch(nuxtApp = useNuxtApp()) {
				if (prefetched.value) return;
				if (href.value === null) return;
				prefetched.value = true;
				const normalizedPath = resolvedPath();
				await Promise.all([nuxtApp.hooks.callHook("link:prefetch", normalizedPath)?.catch(() => {}), !isExternal.value && !hasTarget.value && prefetchRouteComponents(to.value, router)]);
			}
			if (!props.custom) {
				if (shouldPrefetch("visibility")) {
					const nuxtApp = useNuxtApp();
					let idleId;
					let unobserve = null;
					onMounted(() => {
						const observer = useObserver();
						onNuxtReady(() => {
							idleId = requestIdleCallback(() => {
								if (el?.value?.tagName) unobserve = observer.observe(el.value, async () => {
									unobserve?.();
									unobserve = null;
									await prefetch(nuxtApp);
								});
							});
						});
					});
					onBeforeUnmount(() => {
						if (idleId) cancelIdleCallback(idleId);
						unobserve?.();
						unobserve = null;
					});
				}
			}
			return () => {
				const target = props.target || null;
				const rel = firstNonUndefined(props.noRel ? "" : props.rel, options.externalRelAttribute, isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : "") || null;
				const getCustomSlotProps = (routerLinkSlotProps) => ({
					navigate,
					get route() {
						if (!href.value) return;
						const url = new URL(href.value, window.location.href);
						return {
							path: url.pathname,
							fullPath: url.pathname,
							get query() {
								return parseQuery$1(url.search);
							},
							hash: url.hash,
							params: {},
							name: void 0,
							matched: [],
							redirectedFrom: void 0,
							meta: {},
							href: href.value
						};
					},
					rel,
					target,
					isExternal: isExternal.value || hasTarget.value,
					isActive: false,
					isExactActive: false,
					...routerLinkSlotProps,
					href: typeof routerLinkSlotProps?.href === "string" ? sanitizeAnchorHref(routerLinkSlotProps.href) : href.value,
					prefetch,
					prefetched: prefetched.value,
					shouldPrefetch
				});
				if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
					const routerLinkProps = {
						ref: elRef,
						to: to.value,
						activeClass: props.activeClass || options.activeClass,
						exactActiveClass: props.exactActiveClass || options.exactActiveClass,
						replace: props.replace,
						ariaCurrentValue: props.ariaCurrentValue,
						custom: props.custom
					};
					if (!props.custom) {
						if ((prefetchOn("interaction") || prefetched.value) && prefetchAllowed()) {
							routerLinkProps.onPointerenter = escalate;
							routerLinkProps.onFocus = escalate;
							routerLinkProps.onPointerdown = escalate;
						}
						if (prefetched.value) routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
						routerLinkProps.rel = props.rel || void 0;
					}
					return h(routerLinkComponent, routerLinkProps, props.custom && slots.default ? { default: (slotProps) => slots.default(getCustomSlotProps(slotProps)) } : slots.default);
				}
				if (props.custom) {
					if (!slots.default) return null;
					return slots.default(getCustomSlotProps());
				}
				return h("a", {
					ref: el,
					href: href.value || null,
					rel,
					target,
					onClick: async (event) => {
						if (isExternal.value || hasTarget.value) return;
						event.preventDefault();
						try {
							const encodedHref = encodeRoutePath(href.value ?? "");
							return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
						} finally {
							if (isHashLinkWithoutHashMode(to.value)) {
								const rawHash = to.value.slice(1);
								let hash = rawHash;
								try {
									hash = decodeURIComponent(rawHash);
								} catch {}
								document.getElementById(hash)?.focus();
							}
						}
					}
				}, slots.default?.());
			};
		}
	});
}
var NuxtLink = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
	if (trailingSlash !== "append" && trailingSlash !== "remove") return to;
	const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
	if (hasProtocol(to) && !to.startsWith("http")) return to;
	return normalizeFn(to, true);
}
/** @internal */
function useObserver() {
	const nuxtApp = useNuxtApp();
	if (nuxtApp._observer) return nuxtApp._observer;
	let observer = null;
	const callbacks = /* @__PURE__ */ new Map();
	const observe = (element, callback) => {
		observer ||= new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const callback = callbacks.get(entry.target);
				if ((entry.isIntersecting || entry.intersectionRatio > 0) && callback) callback();
			}
		});
		callbacks.set(element, callback);
		observer.observe(element);
		return () => {
			callbacks.delete(element);
			observer?.unobserve(element);
			if (callbacks.size === 0) {
				observer?.disconnect();
				observer = null;
			}
		};
	};
	return nuxtApp._observer = { observe };
}
// node_modules/nuxt/dist/app/plugins/island-link-navigation.client.js
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:island-link-navigation",
	setup(nuxtApp) {}
});
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fcomponents.plugin.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default = /* @__PURE__ */ defineNuxtPlugin({ name: "nuxt:global-components" });
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Flayouts.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default = { default: /* @__PURE__ */ defineAsyncComponent(() => __vitePreload(() => import("./WuKY5LNJ.js").then((m) => m.default || m), __vite__mapDeps([2,3]), import.meta.url)) };
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.client.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_client_default = [
	plugin$9,
	plugin$8,
	plugin$7,
	plugin$6,
	plugin$5,
	plugin$4,
	plugin$3,
	plugin$2,
	plugin$1,
	virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default,
	/* @__PURE__ */ defineNuxtPlugin({
		name: "nuxt:prefetch",
		setup(nuxtApp) {
			const router = useRouter();
			nuxtApp.hooks.hook("app:mounted", () => {
				router.beforeEach(async (to) => {
					const layout = to?.meta?.layout;
					if (typeof layout === "string" && layout in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default) await _loadAsyncComponent(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default[layout]);
				});
			});
			const { schedule } = usePrefetchScheduler(nuxtApp);
			nuxtApp.hooks.hook("link:prefetch", async (url) => {
				if (hasProtocol(url)) return;
				const route = router.resolve(url);
				if (!route) return;
				const layout = route.meta.layout;
				const middleware = toArray$1(route.meta.middleware).filter((m) => typeof m === "string");
				schedule({
					key: `route:chunks:${url}`,
					priority: "route",
					scope: "navigation",
					group: prefetchGroup(url),
					run: (signal) => {
						if (signal.aborted) return;
						const loading = [];
						for (const name of middleware) {
							const handler = namedMiddleware[name];
							if (typeof handler === "function") loading.push(handler());
						}
						if (typeof layout === "string" && layout in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default) loading.push(_loadAsyncComponent(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default[layout]));
						return Promise.all(loading).catch(() => {});
					}
				});
			});
		}
	})
];
var STATIC_DIV = "<div></div>";
function isPlaceholderComment(el) {
	return el.nodeName === "#comment" && el.nodeValue === "placeholder";
}
function createPlaceholder(el) {
	if (el && !isPlaceholderComment(el)) return elToStaticVNode(el, STATIC_DIV);
	return h("div");
}
var cache = /* @__PURE__ */ new WeakMap();
/* @__NO_SIDE_EFFECTS__ */
function createClientOnly(component) {
	if (cache.has(component)) return cache.get(component);
	const clone = { ...component };
	if (clone.render) clone.render = (ctx, cache, $props, $setup, $data, $options) => {
		if ($setup.mounted$ ?? ctx.mounted$) {
			const res = component.render?.bind(ctx)(ctx, cache, $props, $setup, $data, $options);
			return res.children === null || typeof res.children === "string" ? cloneVNode(res) : h(res);
		}
		return createPlaceholder(ctx._.vnode.el);
	};
	else clone.template &&= `
      <template v-if="mounted$">${component.template}</template>
      <template v-else><div></div></template>
    `;
	clone.setup = (props, ctx) => {
		const nuxtApp = useNuxtApp();
		const mounted$ = /* @__PURE__ */ shallowRef(nuxtApp.isHydrating === false);
		const instance = getCurrentInstance();
		if (nuxtApp.isHydrating) {
			const attrs = { ...instance.attrs };
			const directives = extractDirectives(instance);
			for (const key in attrs) delete instance.attrs[key];
			onMounted(() => {
				Object.assign(instance.attrs, attrs);
				instance.vnode.dirs = directives;
			});
		}
		onMounted(() => {
			mounted$.value = true;
		});
		const setupState = component.setup?.(props, ctx) || {};
		if (isPromise(setupState)) return Promise.resolve(setupState).then((setupState) => {
			if (typeof setupState !== "function") {
				setupState ||= {};
				setupState.mounted$ = mounted$;
				return setupState;
			}
			return (...args) => {
				if (mounted$.value || !nuxtApp.isHydrating) {
					const res = setupState(...args);
					return res.children === null || typeof res.children === "string" ? cloneVNode(res) : h(res);
				}
				return createPlaceholder(instance?.vnode.el);
			};
		});
		else {
			if (typeof setupState === "function") return (...args) => {
				if (mounted$.value) {
					const res = setupState(...args);
					const attrs = clone.inheritAttrs !== false ? ctx.attrs : void 0;
					return res.children === null || typeof res.children === "string" ? cloneVNode(res, attrs) : h(res, attrs);
				}
				return createPlaceholder(instance?.vnode.el);
			};
			return Object.assign(setupState, { mounted$ });
		}
	};
	cache.set(component, clone);
	return clone;
}
function extractDirectives(instance) {
	if (!instance || !instance.vnode.dirs) return null;
	const directives = instance.vnode.dirs;
	instance.vnode.dirs = null;
	return directives;
}
// node_modules/nuxt/dist/app/composables/route-announcer.js
function createRouteAnnouncer(opts = {}) {
	const message = /* @__PURE__ */ shallowRef("");
	const politeness = /* @__PURE__ */ shallowRef(opts.politeness || "polite");
	const activeHead = injectHead();
	function set(messageValue = "", politenessSetting = "polite") {
		message.value = messageValue;
		politeness.value = politenessSetting;
	}
	function polite(msg) {
		set(msg, "polite");
	}
	function assertive(msg) {
		set(msg, "assertive");
	}
	function _updateMessageWithPageHeading() {
		set(document?.title?.trim(), politeness.value);
	}
	function _cleanup() {
		activeHead?.hooks?.removeHook("dom:rendered", _updateMessageWithPageHeading);
	}
	_updateMessageWithPageHeading();
	activeHead?.hooks?.hook("dom:rendered", _updateMessageWithPageHeading);
	return {
		_cleanup,
		message,
		politeness,
		set,
		polite,
		assertive
	};
}
/**
* composable to handle the route announcer
* @since 3.12.0
*/
function useRouteAnnouncer(opts = {}) {
	const nuxtApp = useNuxtApp();
	const announcer = nuxtApp._routeAnnouncer ||= createRouteAnnouncer(opts);
	if (opts.politeness && opts.politeness !== announcer.politeness.value) announcer.politeness.value = opts.politeness;
	if (getCurrentScope()) {
		nuxtApp._routeAnnouncerDeps ||= 0;
		nuxtApp._routeAnnouncerDeps++;
		onScopeDispose(() => {
			nuxtApp._routeAnnouncerDeps--;
			if (nuxtApp._routeAnnouncerDeps === 0) {
				announcer._cleanup();
				delete nuxtApp._routeAnnouncer;
			}
		});
	}
	return announcer;
}
// node_modules/nuxt/dist/app/components/nuxt-route-announcer.js
var NuxtRouteAnnouncer = /* @__PURE__ */ defineComponent({
	name: "NuxtRouteAnnouncer",
	props: {
		atomic: {
			type: Boolean,
			default: false
		},
		politeness: {
			type: String,
			default: "polite"
		}
	},
	setup(props, { slots, expose }) {
		const { set, polite, assertive, message, politeness } = useRouteAnnouncer({ politeness: props.politeness });
		const role = computed(() => {
			if (politeness.value === "assertive") return "alert";
			if (politeness.value === "off") return;
			return "status";
		});
		expose({
			set,
			polite,
			assertive,
			message,
			politeness
		});
		return () => h("span", {
			class: "nuxt-route-announcer",
			style: { position: "absolute" }
		}, h("span", {
			"role": role.value,
			"aria-live": politeness.value,
			"aria-atomic": props.atomic,
			"style": {
				"border": "0",
				"clip": "rect(0 0 0 0)",
				"clip-path": "inset(50%)",
				"height": "1px",
				"width": "1px",
				"overflow": "hidden",
				"position": "absolute",
				"white-space": "nowrap",
				"word-wrap": "normal",
				"margin": "-1px",
				"padding": "0"
			}
		}, slots.default ? slots.default({ message: message.value }) : message.value));
	}
});
// node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => /* @__PURE__ */ defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean,
		routeRecord: Object
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, /* @__PURE__ */ shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
// node_modules/nuxt/dist/pages/runtime/page.js
var _routeProviders = /* @__PURE__ */ new WeakMap();
var page_default = /* @__PURE__ */ defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = /* @__PURE__ */ ref();
		const forkRoute = inject(PageRouteSymbol, null);
		const keepAliveInclude = /* @__PURE__ */ new Set();
		let previousPageKey;
		expose({ pageRef });
		const _layoutMeta = inject(LayoutMetaSymbol, null);
		let vnode;
		const done = nuxtApp.deferHydration();
		let isSuspensePending = false;
		let hasResolvedOnce = false;
		let pageStartPromise;
		let suspenseKey = 0;
		if (nuxtApp.isHydrating) {
			const removeErrorHook = nuxtApp.hooks.hookOnce("app:error", done);
			const removeGuard = useRouter().beforeEach(() => {
				removeErrorHook();
				removeGuard();
			});
		}
		if (props.pageKey) watch(() => props.pageKey, (next, prev) => {
			if (next !== prev) nuxtApp.callHook("page:loading:start");
		});
		let pageLoadingEndHookAlreadyCalled = false;
		{
			const unsub = useRouter().beforeResolve(() => {
				pageLoadingEndHookAlreadyCalled = false;
			});
			onBeforeUnmount(() => {
				unsub();
				done();
			});
		}
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				const isRenderingNewRouteInOldFork = haveParentRoutesRendered(forkRoute, routeProps.route, routeProps.Component);
				const hasSameChildren = forkRoute && forkRoute.matched.length === routeProps.route.matched.length;
				if (!routeProps.Component) {
					if (vnode && !hasSameChildren && !isStaleVNode(vnode)) return vnode;
					done();
					if (!!!(props.transition ?? routeProps.route.meta.pageTransition ?? false)) return;
					return _wrapInTransition(_mergeTransitionProps([
						props.transition,
						routeProps.route.meta.pageTransition,
						false
					]), null).default();
				}
				if (vnode && _layoutMeta && !isStaleVNode(vnode) && !_layoutMeta.isCurrent(routeProps.route)) return vnode;
				if (isRenderingNewRouteInOldFork && forkRoute && (!_layoutMeta || _layoutMeta?.isCurrent(forkRoute))) {
					if ((hasSameChildren || vnode) && !isStaleVNode(vnode)) return vnode;
					return null;
				}
				const key = generateRouteKey$1(routeProps, props.pageKey);
				const willRenderAnotherChild = hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component);
				if (!nuxtApp.isHydrating && previousPageKey === key && !willRenderAnotherChild) nextTick(() => {
					if (!pageLoadingEndHookAlreadyCalled) {
						pageLoadingEndHookAlreadyCalled = true;
						nuxtApp.callHook("page:loading:end");
					}
				});
				if (isSuspensePending && previousPageKey !== key && hasResolvedOnce) suspenseKey++;
				previousPageKey = key;
				const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? false);
				const transitionProps = hasTransition && _mergeTransitionProps([
					props.transition,
					routeProps.route.meta.pageTransition,
					false,
					{ onAfterLeave() {
						_finishTransition(nuxtApp);
						nuxtApp.callHook("page:transition:finish", routeProps.Component);
					} }
				]);
				const routeKeepaliveConfig = props.keepalive ?? routeProps.route.meta.keepalive ?? false;
				const routerComponentType = routeProps.Component.type;
				const componentName = routerComponentType.name || routerComponentType.__name;
				if (routeProps.route.meta.keepalive && componentName) keepAliveInclude.add(componentName);
				let keepaliveConfig;
				if (keepAliveInclude.size > 0 && props.keepalive == null && (!routeKeepaliveConfig || typeof routeKeepaliveConfig === "object" && routeKeepaliveConfig && routeKeepaliveConfig.include)) {
					const baseConfig = typeof routeKeepaliveConfig === "object" && routeKeepaliveConfig ? { ...routeKeepaliveConfig } : {};
					const existingInclude = baseConfig.include ? Array.isArray(baseConfig.include) ? baseConfig.include : [baseConfig.include] : [];
					keepaliveConfig = {
						...baseConfig,
						include: Array.from(/* @__PURE__ */ new Set([...existingInclude, ...keepAliveInclude]))
					};
				} else keepaliveConfig = routeKeepaliveConfig;
				vnode = _wrapInTransition(hasTransition && transitionProps, wrapInKeepAlive(keepaliveConfig, h(Suspense, {
					key: suspenseKey,
					suspensible: true,
					onPending: () => {
						isSuspensePending = true;
						if (hasTransition && hasResolvedOnce) _startTransition(nuxtApp);
						pageStartPromise = nuxtApp.callHook("page:start", routeProps.Component);
					},
					onResolve: async () => {
						isSuspensePending = false;
						hasResolvedOnce = true;
						if (nuxtApp.isHydrating) nuxtApp["~restoreDeferredRoute"]?.();
						try {
							await nextTick();
							nuxtApp._route.sync?.();
							await pageStartPromise;
							await nuxtApp.callHook("page:finish", routeProps.Component);
							if (!pageLoadingEndHookAlreadyCalled && !willRenderAnotherChild) {
								pageLoadingEndHookAlreadyCalled = true;
								await nuxtApp.callHook("page:loading:end");
							}
						} finally {
							done();
						}
					}
				}, { default: () => {
					const routeProviderProps = {
						key: key || void 0,
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						renderKey: key || void 0,
						trackRootNodes: hasTransition,
						vnodeRef: pageRef,
						routeRecord: void 0
					};
					if (!keepaliveConfig) return h(RouteProvider, routeProviderProps);
					const routeProviderKey = routerComponentType;
					let PageRouteProvider = _routeProviders.get(routeProviderKey);
					if (!PageRouteProvider) {
						PageRouteProvider = defineRouteProvider(componentName);
						_routeProviders.set(routeProviderKey, PageRouteProvider);
					}
					return h(PageRouteProvider, routeProviderProps);
				} }))).default();
				return vnode;
			}) });
		};
	}
});
function haveParentRoutesRendered(fork, newRoute, Component) {
	if (!fork) return false;
	const index = newRoute.matched.findIndex((m) => m.components?.default === Component?.type);
	if (index === -1) return false;
	const newParents = newRoute.matched.slice(0, index).filter((m) => m.components?.default);
	if (!newParents.length) return false;
	const forkParents = fork.matched.filter((m) => m.components?.default);
	return newParents.some((c, i) => c.components?.default !== forkParents[i]?.components?.default) || Component && generateRouteKey$1({
		route: newRoute,
		Component
	}) !== generateRouteKey$1({
		route: fork,
		Component
	});
}
function hasChildrenRoutes(fork, newRoute, Component) {
	if (!fork) return false;
	return newRoute.matched.findIndex((m) => m.components?.default === Component?.type) < newRoute.matched.length - 1;
}
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
function isStaleVNode(vnode) {
	return !!vnode && (!!vnode.suspense?.isUnmounted || !!vnode.component?.isUnmounted);
}
// node_modules/nuxt/dist/app/composables/layout.js
function routeRulesMatcher(path) {
	return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default(path);
}
function resolveLayoutName(route, name) {
	return unref(name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path ?? "/").appLayout ?? "default";
}
// node_modules/nuxt/dist/app/components/nuxt-layout.js
var LayoutLoader = /* @__PURE__ */ defineComponent({
	name: "LayoutLoader",
	inheritAttrs: false,
	props: {
		name: String,
		layoutProps: Object
	},
	setup(props, context) {
		return () => h(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default[props.name], props.layoutProps, context.slots);
	}
});
var nuxt_layout_default = /* @__PURE__ */ defineComponent({
	name: "NuxtLayout",
	inheritAttrs: false,
	props: {
		name: {
			type: [
				String,
				Boolean,
				Object
			],
			default: null
		},
		fallback: {
			type: [String, Object],
			default: null
		}
	},
	setup(props, context) {
		const nuxtApp = useNuxtApp();
		const injectedRoute = inject(PageRouteSymbol);
		const route = !injectedRoute || injectedRoute === useRoute$1() ? useRoute() : injectedRoute;
		const layout = computed(() => {
			let layout = resolveLayoutName(route, props.name);
			if (layout && !(layout in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default)) {
				if (props.fallback) layout = unref(props.fallback);
			}
			return layout;
		});
		provide(LayoutSymbol, layout);
		const resolveRouteLayout = (routeToCheck) => resolveLayoutName(routeToCheck, props.name);
		const layoutRef = /* @__PURE__ */ shallowRef();
		context.expose({ layoutRef });
		const done = nuxtApp.deferHydration();
		if (nuxtApp.isHydrating) {
			const removeErrorHook = nuxtApp.hooks.hookOnce("app:error", done);
			const removeGuard = useRouter().beforeEach(() => {
				removeErrorHook();
				removeGuard();
			});
		}
		onBeforeUnmount(() => {
			done();
		});
		let lastLayout;
		return () => {
			const hasTransition = !!layout.value && layout.value in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default && !!(route?.meta.layoutTransition ?? false);
			const transitionProps = hasTransition && _mergeTransitionProps([
				route?.meta.layoutTransition,
				false,
				{
					onBeforeLeave() {
						_startTransition(nuxtApp);
					},
					onAfterLeave() {
						_finishTransition(nuxtApp);
					}
				}
			]);
			const previouslyRenderedLayout = lastLayout;
			lastLayout = layout.value;
			return _wrapInTransition(transitionProps, { default: () => h(Suspense, {
				suspensible: true,
				onResolve: async () => {
					await nextTick(done);
				}
			}, { default: () => h(LayoutProvider, {
				layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
				key: layout.value || void 0,
				name: layout.value,
				shouldProvide: !props.name,
				resolveRouteLayout,
				isRenderingNewLayout: (name) => {
					return name !== previouslyRenderedLayout && name === layout.value;
				},
				hasTransition
			}, context.slots) }) }).default();
		};
	}
});
var LayoutProvider = /* @__PURE__ */ defineComponent({
	name: "NuxtLayoutProvider",
	inheritAttrs: false,
	props: {
		name: { type: [String, Boolean] },
		layoutProps: { type: Object },
		hasTransition: { type: Boolean },
		shouldProvide: { type: Boolean },
		isRenderingNewLayout: {
			type: Function,
			required: true
		},
		resolveRouteLayout: {
			type: Function,
			required: true
		}
	},
	setup(props, context) {
		const name = props.name;
		if (props.shouldProvide) provide(LayoutMetaSymbol, { isCurrent: (route) => name === false || name === props.resolveRouteLayout(route) });
		const injectedRoute = inject(PageRouteSymbol);
		const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute$1();
		const enclosingLayout = inject(LayoutMetaSymbol, null);
		if (isNotWithinNuxtPage) {
			const vueRouterRoute = useRoute();
			const reactiveChildRoute = {};
			for (const _key in vueRouterRoute) {
				const key = _key;
				Object.defineProperty(reactiveChildRoute, key, {
					enumerable: true,
					get: () => {
						return props.isRenderingNewLayout(props.name) && (!enclosingLayout || enclosingLayout.isCurrent(vueRouterRoute)) ? vueRouterRoute[key] : injectedRoute[key];
					}
				});
			}
			provide(PageRouteSymbol, /* @__PURE__ */ shallowReactive(reactiveChildRoute));
		}
		return () => {
			if (!name || typeof name === "string" && !(name in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default)) return context.slots.default?.();
			return h(LayoutLoader, {
				key: name,
				layoutProps: props.layoutProps,
				name
			}, context.slots);
		};
	}
});
// \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
// app/app.vue
var __nuxt_component_0_client_wrapped = /* @__PURE__ */ createClientOnly(NuxtRouteAnnouncer);
var _sfc_main$1 = {};
function _sfc_render(_ctx, _cache) {
	const _component_NuxtRouteAnnouncer = __nuxt_component_0_client_wrapped;
	const _component_NuxtPage = page_default;
	const _component_NuxtLayout = nuxt_layout_default;
	return openBlock(), createBlock(_component_NuxtLayout, null, {
		default: withCtx(() => [createVNode(_component_NuxtRouteAnnouncer), createVNode(_component_NuxtPage)]),
		_: 1
	});
}
var app_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render]]);
// app/error.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = { class: "error-page" };
var _hoisted_2 = { class: "error-card" };
var _hoisted_3 = { class: "error-code" };
var _hoisted_4 = { class: "error-title" };
var _hoisted_5 = { class: "error-desc" };
var _hoisted_6 = { class: "error-actions" };
// app/error.vue
var error_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "error",
	props: { error: {} },
	setup(__props) {
		const props = __props;
		const is404 = computed(() => props.error.statusCode === 404);
		useHead({ title: () => is404.value ? "页面未找到" : "出错了" });
		return (_ctx, _cache) => {
			const _component_NuxtLink = NuxtLink;
			return openBlock(), createElementBlock("div", _hoisted_1$1, [createBaseVNode("div", _hoisted_2, [
				createBaseVNode("div", _hoisted_3, toDisplayString(__props.error.statusCode), 1),
				createBaseVNode("h1", _hoisted_4, toDisplayString(unref(is404) ? "页面走丢了" : "出错了"), 1),
				createBaseVNode("p", _hoisted_5, toDisplayString(unref(is404) ? "抱歉，您访问的页面不存在或已被移除。" : __props.error.message || "发生了未知错误，请稍后再试。"), 1),
				createBaseVNode("div", _hoisted_6, [createVNode(_component_NuxtLink, {
					to: "/",
					class: "btn btn-primary"
				}, {
					default: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode("返回首页", -1)])]),
					_: 1
				})])
			])]);
		};
	}
}), [["__scopeId", "data-v-c642b38c"]]);
// virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
// node_modules/nuxt/dist/app/components/nuxt-root.vue
var _hoisted_1 = { key: 0 };
var _sfc_main = {
	__name: "nuxt-root",
	setup(__props) {
		const nuxtApp = useNuxtApp();
		const onResolve = nuxtApp.deferHydration();
		if (nuxtApp.isHydrating) {
			const removeErrorHook = nuxtApp.hooks.hookOnce("app:error", onResolve);
			const removeGuard = useRouter().beforeEach(() => {
				removeErrorHook();
				removeGuard();
			});
		}
		window.location.pathname;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute$1());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = false;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			if (isBotUserAgent(navigator.userAgent)) {
				_notifyCrawlerError(nuxtApp, err);
				return false;
			}
			if (isNuxtError(err) && (err.fatal || err.unhandled)) {
				nuxtApp.runWithContext(() => showError(createErrorFromThrown(err, {
					instance: target,
					route: nuxtApp._route
				})));
				onServerPrefetch();
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = false;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Suspense, { onResolve: unref(onResolve) }, {
				default: withCtx(() => [unref(abortRender) ? (openBlock(), createElementBlock("div", _hoisted_1)) : unref(error) ? (openBlock(), createBlock(unref(error_default), {
					key: 1,
					error: unref(error)
				}, null, 8, ["error"])) : unref(islandContext) ? (openBlock(), createBlock(unref(IslandRenderer), {
					key: 2,
					context: unref(islandContext)
				}, null, 8, ["context"])) : unref(SingleRenderer) ? (openBlock(), createBlock(resolveDynamicComponent(unref(SingleRenderer)), { key: 3 })) : (openBlock(), createBlock(unref(app_default), { key: 4 }))]),
				_: 1
			}, 8, ["onResolve"]);
		};
	}
};
// node_modules/nuxt/dist/app/entry.js
var entry;
{
	let vueAppPromise;
	entry = async function initApp() {
		if (vueAppPromise) return vueAppPromise;
		const isSSR = Boolean(window.__NUXT__?.serverRendered ?? document.getElementById("__NUXT_DATA__")?.dataset.ssr === "true");
		const vueApp = isSSR ? createSSRApp(_sfc_main) : createApp(_sfc_main);
		const nuxt = createNuxtApp({ vueApp });
		async function handleVueError(error) {
			await nuxt.callHook("app:error", error);
			nuxt.payload.error ||= createErrorFromThrown(error, { route: nuxt._route });
		}
		handleVueError.__nuxt_default = true;
		vueApp.config.errorHandler = handleVueError;
		nuxt.hook("app:suspense:resolve", () => {
			if (vueApp.config.errorHandler === handleVueError) vueApp.config.errorHandler = void 0;
		});
		if (!isSSR && appSpaLoaderAttrs.id) nuxt.hook("app:suspense:resolve", () => {
			document.getElementById(appSpaLoaderAttrs.id)?.remove();
		});
		try {
			await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_client_default);
		} catch (err) {
			handleVueError(err);
		}
		try {
			await nuxt.hooks.callHook("app:created", vueApp);
			await nuxt.hooks.callHook("app:beforeMount", vueApp);
			vueApp.mount(vueAppRootContainer);
			await nuxt.hooks.callHook("app:mounted", vueApp);
			await nextTick();
		} catch (err) {
			handleVueError(err);
		}
		return vueApp;
	};
	vueAppPromise = entry().catch((error) => {
		appDiagnostics.NUXT_E1009({ cause: error });
		throw error;
	});
}
export { createStaticVNode as a, renderSlot as c, createElementBlock as i, withCtx as l, NuxtLink as n, createVNode as o, createBaseVNode as r, openBlock as s, _plugin_vue_export_helper_default as t, toDisplayString as u };
