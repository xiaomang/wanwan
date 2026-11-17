import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

// app/pages/index.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "coming-soon" }, _attrs))} data-v-abb8b322><div class="hero" data-v-abb8b322><div class="blob blob-1" data-v-abb8b322></div><div class="blob blob-2" data-v-abb8b322></div><div class="blob blob-3" data-v-abb8b322></div><div class="hero-content" data-v-abb8b322><div class="badge" data-v-abb8b322>🚧 正在建设中</div><h1 class="title" data-v-abb8b322> 精彩即将 <span class="highlight" data-v-abb8b322>上线</span></h1><p class="subtitle" data-v-abb8b322> 我们正在努力打造一个有趣的平台，敬请期待～ </p></div></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-abb8b322"]]);

export { pages_default as default };
