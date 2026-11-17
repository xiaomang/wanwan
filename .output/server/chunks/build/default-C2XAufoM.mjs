import { _ as _plugin_vue_export_helper_default, N as NuxtLink } from '../virtual/entry.mjs';
import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import 'unhead/utils';

// app/layouts/default.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_NuxtLink = NuxtLink;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "layout" }, _attrs))} data-v-58710751><header class="layout-header" data-v-58710751>`);
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: "/",
		class: "logo"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`<span class="logo-icon" data-v-58710751${_scopeId}>玩</span><span class="logo-text" data-v-58710751${_scopeId}>玩玩</span>`);
			else return [createVNode("span", { class: "logo-icon" }, "玩"), createVNode("span", { class: "logo-text" }, "玩玩")];
		}),
		_: 1
	}, _parent));
	_push(`</header><main class="layout-main" data-v-58710751>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</main><footer class="layout-footer" data-v-58710751><p data-v-58710751>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} 玩玩 · 保留所有权利</p></footer></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-58710751"]]);

export { default_default as default };
