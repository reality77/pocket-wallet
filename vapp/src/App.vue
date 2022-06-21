<template>
  <div class="flex flex-col h-full">
    <nav class="flex flex-row flex-wrap h-16 bg-slate-700">
      <ul class="grow flex flex-row flex-wrap h-16">
        <li class="flex-initial text-slate-300 ml-8 self-center"><h1>Pocket wallet</h1></li>
      </ul>
      <div class="flex-shrink overflow-visible p-2 z-30">
      </div>
    </nav>

    <div class="h-full">
      <div v-if="account && is_ready" class="flex flex-row h-full">
        <div class="flex-initial p-2 dark:bg-slate-800">
          <aside>
            <!-- Aside -->
          </aside>
        </div>
        <div class="flex-auto h-full flex flex-col p-4">
          <div v-if="!is_test_network" class="flex-initial bg-red-500/25 text-red-100">
            <p>This demo project is not expected to be deployed in a mainnet</p>
          </div>
          <main class="m-auto">
            <!-- Content -->
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PromiseButton from './components/PromiseButton.vue';

export default {
  name: 'App',
  data: function () {
    return {
    }
  },
  props: {
  },
  computed: {
    account() {
      return this.$store.getters.account;
    },
    network() {
      return this.$store.getters.network;
    },
    factory_address() {
      return this.$store.getters.factory_address;
    },
    error() {
      return this.$store.getters.error;
    },
    is_test_network() {
      switch(this.$store.getters.network) {
        case "0x2": 
        case "0x3": 
        case "0x4": 
        case "0x5": 
        case "0x2a": 
        case "0x539": 
          return true;
        default: 
          return false;
      }
    }
  },
  components: {
    PromiseButton,
  },
  methods: {
  },
  emits: {
  },
  async mounted() {

    var bus = this
    bus.$store.dispatch("initializeProvider");
  },
}

</script>

<style>

@font-face {
  font-family: "Avenir";
  src: url("./assets/fonts/AvenirLTStd-Book.otf") format("opentype");
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height:100%;
  width: 100%;
}
</style>
