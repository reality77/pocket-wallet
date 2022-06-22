<template>
  <div class="flex flex-col h-full">
    <nav class="flex flex-row flex-wrap h-16 bg-slate-700">
      <ul class="grow flex flex-row flex-wrap h-16">
        <li class="flex-initial text-slate-300 ml-8 self-center"><h1>Pocket wallet - Admin</h1></li>
      </ul>
      <div class="flex-shrink overflow-visible p-2 z-30">
        <MyAccount></MyAccount>
      </div>
    </nav>

    <div class="h-full">
      <div v-if="account" class="flex flex-row h-full">
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
            <div v-if="contract_address">
              <p>
                <PocketWalletController></PocketWalletController>
              </p>
            </div>
            <div v-if="!is_controller">
              <input v-model="userAddress"/>
              <PromiseButton :promiseFunction="createContractForUser" childClass="ml-2">Create a Pocket Wallet</PromiseButton>            
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyAccount from './components/MyAccount.vue';
import PromiseButton from './components/PromiseButton.vue';
import PocketWalletController from "./components/PocketWalletController.vue";

export default {
  name: 'App',
  data: function () {
    return {
      userAddress: null,
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
    contract_address() {
      return this.$store.getters.contract_address;
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
        case "0x53a": 
          return true;
        default: 
          return false;
      }
    },
    is_controller() {
        return this.$store.getters.is_controller;
    },    
  },
  components: {
    MyAccount,
    PromiseButton,
    PocketWalletController,
  },
  methods: {
    async createContractForUser() {
      await this.$store.dispatch("createContract", this.$data.userAddress);
    },

  },
  emits: {
  },
  async mounted() {
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
  height: 100%;
  width: 100%;
}
</style>
