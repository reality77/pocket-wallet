<template>
  <figure class="rounded-xl dark:bg-slate-800 drop-shadow-lg">
    <div v-if="account">
      <div class="p-2">
        <div class="flex flex-row items-center">
          <i class="lar la-user-circle la-2x"></i>
          <span class="data flex-grow">{{ account_short }}</span>
        </div>
        <div class="flex flex-row items-center ">
          <i class="las la-coins la-2x"></i>
          <span class="data flex-grow">{{ balance_rounded }} Ξ</span>
        </div>
        <button @click="disconnect" class="m-2">
          Disconnect
        </button>
      </div>
      <div class="bg-slate-700 rounded-br-lg rounded-bl-lg p-2">
          <p class="dark:text-slate-200">{{ network_text }}</p>
      </div> 
    </div>
    <div v-else class="p-2">
      <PromiseButton :promiseFunction="connect" childClass="ml-2">Connect Wallet</PromiseButton>
    </div>
    <div>
      <p class="error">{{ error }}</p>
    </div>
  </figure>
</template>

<script>
import { ethers } from "ethers";
import PromiseButton from "./PromiseButton.vue"

export default {
  name: 'MyAccount',
  data: function() {
    return {
    }
  },
  props: {
  },
  computed: {
    account() {
      return this.$store.getters.account;
    },
    account_short() {
      return `${this.$store.getters.account.substr(0, 6)}...${this.$store.getters.account.substr(-4)}`;
    },    
    network() {
      return this.$store.getters.network;
    },
    network_text() {
      switch(this.$store.getters.network) {
        case "0x1": return "Ethereum";
        case "0x2": return "Morden";
        case "0x3": return "Ropsten (testnet)";
        case "0x4": return "Rinkeby (testnet)";
        case "0x5": return "Goerli (testnet)";
        case "0x2a": return "Kovan (testnet)";
        case "0x539": return "Local";
        case "0xaa36a7": return "Sepolia (testnet)";
        case "0x118": return "ZkSync Era (testnet)";
        case "0x144": return "ZkSync Era";
        case "0xa": return "Optimism";
        case "0xfa": return "Fantom";
        case "0xa86a": return "Avalanche";
        case "0x38": return "Binance Smart Chain";
        case "0x89": return "Polygon";
        case "0xa4b1": return "Arbitrum One";
        case "0xa4ba": return "Arbitrum Nova";
        default: return this.$store.getters.network;
      }
    },    
    error() {
      return this.$store.getters.error;
    },
    balance() {
      if(this.$store.getters.balance == null) {
        return null;
      }
      return ethers.utils.formatEther(this.$store.getters.balance);
    },
    balance_rounded() {
      if(this.$store.getters.balance == null) {
        return null;
      }
      return Number.parseFloat(this.balance).toFixed(5);
    } 
  },
  components: {
    PromiseButton,
  },
  methods: {
    async connect() {
      await this.$store.dispatch("connect");
    },
    async disconnect() {
      await this.$store.dispatch("disconnect");
    },
  },
  emits: {
    accountsChanged: null,
    chainChanged: null,
  },
  async mounted() {

    var bus = this

    var provider = await bus.$store.dispatch("initializeProvider");

    provider.on('connect', function (connectInfo) {
      console.log("Event connect" + connectInfo);
    });

    provider.on('chainChanged', function (chainId) {
      console.log("Chain changed : " + chainId);
      bus.$store.dispatch("changeNetwork");
      bus.$emit('chainChanged', chainId);
    });

    provider.on('accountsChanged', function (accounts) {
      console.log("Account changed : " + accounts);
      bus.$store.dispatch("changeAccount", accounts[0]);
      bus.$emit('accountsChanged', accounts);
    });
  },
}

</script>