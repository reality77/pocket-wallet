<template>
  <div class="flex flex-col h-full">
    <nav class="flex flex-row flex-wrap h-16 bg-slate-700">
      <ul class="grow flex flex-row flex-wrap h-16">
        <li class="flex-initial text-slate-300 ml-8 self-center"><h1>Pocket wallet</h1></li>
      </ul>
      <div class="flex-shrink overflow-visible p-2 z-30">
      </div>
    </nav>

    <div class="h-full overflow-y-auto">
      <div v-if="factory_found && wallet_address" class="flex flex-row h-full">
        <div class="flex-initial p-2 dark:bg-slate-800">
          <aside>
            <!-- Aside -->
          </aside>
        </div>
        <div class="flex-auto h-full flex flex-col p-4">
          <div v-if="!is_test_network" class="flex-initial bg-red-500/25 text-red-100">
            <p>This demo project is not expected to be deployed in a mainnet</p>
          </div>
          <main class="flex flex-col h-full">
            <div class="flex-grow flex flex-col">
              <div class="flex-shrink flex mt-8">
                <SendBlock class="m-auto"></SendBlock>
              </div>
            </div>
            <div class="flex-initial">
              <p class="text-xs">Contract <span class="data">{{ contract_address }}</span></p>
              <p class="text-xs">Wallet address : <span class="data">{{ wallet_address }}</span></p>
              <p class="text-xs">Wallet balance : <span class="data">{{ wallet_balance }} Ξ</span></p>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" v-if="!factory_found">
    <span>Pocket wallet is not deployed on this network yet !</span>
  </div>
  <div class="modal" v-else-if="!contract_address">
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
    factory_found() {
      return this.$store.getters.factory_found;
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
    var provider = await this.$store.dispatch("initializeProvider");
    await this.$store.dispatch("getFactory", provider);

    await this.$store.dispatch("loadWallet");
  },
}

</script>

