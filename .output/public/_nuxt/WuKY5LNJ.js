import { c as renderSlot, i as createElementBlock, l as withCtx, n as NuxtLink, o as createVNode, r as createBaseVNode, s as openBlock, t as _plugin_vue_export_helper_default, u as toDisplayString } from "#entry";
// app/layouts/default.vue
var _sfc_main = {};
var _hoisted_1 = { class: "layout" };
var _hoisted_2 = { class: "layout-header" };
var _hoisted_3 = { class: "layout-main" };
var _hoisted_4 = { class: "layout-footer" };
function _sfc_render(_ctx, _cache) {
	const _component_NuxtLink = NuxtLink;
	return openBlock(), createElementBlock("div", _hoisted_1, [
		createBaseVNode("header", _hoisted_2, [createVNode(_component_NuxtLink, {
			to: "/",
			class: "logo"
		}, {
			default: withCtx(() => [..._cache[0] || (_cache[0] = [createBaseVNode("span", { class: "logo-icon" }, "玩", -1), createBaseVNode("span", { class: "logo-text" }, "玩玩", -1)])]),
			_: 1
		})]),
		createBaseVNode("main", _hoisted_3, [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
		createBaseVNode("footer", _hoisted_4, [createBaseVNode("p", null, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " 玩玩 · 保留所有权利", 1)])
	]);
}
var default_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-58710751"]]);
export { default_default as default };
