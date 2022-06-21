<template>
  <figure class="rounded-xl dark:bg-slate-800 drop-shadow-lg">
    <div v-if="account">
      <div class="p-2">
        <p>
          <i class="lar la-user-circle la-2x"></i><span class="data">{{ account_short }}</span>
        </p>
        <p>
          <i class="las la-coins la-2x"></i><span class="data">{{ balance_rounded }} Ξ</span>
        </p>
        <button @click="disconnect">
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
        case "0x3": return "Ropsten";
        case "0x4": return "Rinkeby";
        case "0x5": return "Goerli";
        case "0x2a": return "Kovan";
        case "0x539": return "Local";
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

    bus.$store.dispatch("initializeProvider");

    const { ethereum } = window;

    ethereum.on('connect', function (connectInfo) {
      console.log("Event connect" + connectInfo);
    });

    ethereum.on('chainChanged', function (chainId) {
      console.log("Chain changed : " + chainId);
      bus.$store.dispatch("changeNetwork");
      bus.$emit('chainChanged', chainId);
    });

    ethereum.on('accountsChanged', function (accounts) {
      console.log("Account changed : " + accounts);
      bus.$store.dispatch("changeAccount", accounts[0]);
      bus.$emit('accountsChanged', accounts);
    });
  },
}

</script>