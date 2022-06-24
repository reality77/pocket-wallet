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
      <div v-if="wallet_address" class="flex flex-row h-full">
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
            <p>Contract <span>{{ contract_address }}</span></p>
            <p>Balance (pocket wallet) : <span>{{ balance }}</span></p>
            <p>Balance (working wallet) : <span>{{ wallet_balance }}</span></p>
            <SendBlock></SendBlock>
          </main>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" v-if="!contract_address">
    <FirstAccess></FirstAccess>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import FirstAccess from './FirstAccess.vue';
import SendBlock from './SendBlock.vue';

export default {
  name: 'AppUser',
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
    balance() {
      if(this.$store.getters.balance) {
        return ethers.utils.formatEther(this.$store.getters.balance);
      } else {
        return null;
      }
    },
    factory_address() {
      return this.$store.getters.factory_address;
    },
    wallet_address() {
      return this.$store.getters.wallet_address;
    },
    wallet_balance() {
      if(this.$store.getters.wallet_balance) {
        return ethers.utils.formatEther(this.$store.getters.wallet_balance);
      } else {
        return null;
      }
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
    }
  },
  components: {
    FirstAccess,
    SendBlock
},
  methods: {
  },
  emits: {
  },
  async mounted() {
    this.$store.dispatch("loadWallet");
  },
}

</script>

