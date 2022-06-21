import Vuex from "vuex";
import { ethers } from "ethers";

export default new Vuex.Store({
  state: {
    account: null,
    network: null,
    balance: null,
    factory_address : "0x"
  },
  getters: {
    account: (state) => state.account,
    network: (state) => state.network,
    error: (state) => state.error,
    balance: (state) => state.balance,
    factory_address: (state) => state.factory_address,
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setNetwork(state, network) {
      state.network = network;
    },
    setError(state, error) {
      state.error = error;
    },
    setBalance(state, balance) {
      state.balance = balance;
    },
  },
  actions: {

    async initializeProvider({ commit }) {

      if (typeof window.ethereum === 'undefined') {
        commit("setError", "Metamask is not installed !");
        return null;
      }

      const { ethereum } = window;
      return new ethers.providers.Web3Provider(ethereum);
    },
    
  },
});
