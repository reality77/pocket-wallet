import { openBlock, createElementBlock, renderSlot } from 'vue';

var script = {
    name: 'BasicPanel',
    data : function() {
        return {
        };
    },
    props: {
    },
    computed: {
    },
    components: {
    },
    emits: {
    },
    methods: {
    },
    async mounted() {
    },
};

const _hoisted_1 = { class: "rounded-xl drop-shadow-lg bg-slate-700/50 border-2 border-slate-500/75 p-4" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", _hoisted_1, [
    renderSlot(_ctx.$slots, "default")
  ]))
}

script.render = render;
script.__file = "src/BasicPanel.vue";

var components = { BasicPanel: script };

const plugin = {
  install (Vue) {
    for (const prop in components) {
      if (components.hasOwnProperty(prop)) {
        const component = components[prop];
        Vue.component(component.name, component);
      }
    }
  }
};

export { plugin as default };
