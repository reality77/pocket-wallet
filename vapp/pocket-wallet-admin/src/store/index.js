import Vuex from "vuex";
import { ethers } from "ethers";
import PocketWalletFactory from "../../../contracts/PocketWalletFactory.json"

export default new Vuex.Store({
  state: {
    account: null,
    network: null,
    balance: null,
    error: null,
    factory_address : "0xd1476bC527eEC759a03fd9cb5A0c227B700D49d3",
    user_address: null,
    contract_address: null,
  },
  getters: {
    account: (state) => state.account,
    network: (state) => state.network,
    balance: (state) => state.balance,
    error: (state) => state.error,
    factory_address: (state) => state.factory_address,
    user_address: (state) => state.user_address,
    contract_address: (state) => state.contract_address,
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setNetwork(state, network) {
      state.network = network;
    },
    setBalance(state, balance) {
      state.balance = balance;
    },
    setUserAddress(state, address) {
      state.user_address = address;
    },
    setContractAddress(state, address) {
      state.contract_address = address;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {

    async initializeProvider({ commit }) {

      const DEBUG_MODE = true;

      if(DEBUG_MODE) {
        // Test wallet
        var wallet = ethers.Wallet.fromMnemonic("prison glow trip supreme drama strong delay dismiss antenna problem myself once");
        var provider = ethers.getDefaultProvider("http://localhost:8545");

        wallet.connect(provider);
        return provider;
  
      } else {
        if (typeof window.ethereum === 'undefined') {
          commit("setError", "Metamask is not installed !");
          return null;
        }

        const { ethereum } = window;
        return new ethers.providers.Web3Provider(ethereum);
      }
    },

    async getFactory({ dispatch }) {
      var provider = await dispatch("initializeProvider");
      return new ethers.Contract(this.getters.factory_address, PocketWalletFactory.abi, provider.getSigner());
    },

    async createContract({ commit, dispatch }, userAddress) {
      var factory = await dispatch("getFactory");
      
      try {

        var trx = await factory.createPocketWallet(userAddress, {
          type: 2,
          maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
          maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
          gasLimit: 2000000,
          value: ethers.utils.parseEther("10")
        });
  
        await trx.wait();

        commit("setUserAddress", userAddress);

      } catch(e) {
        console.error(e);
      }

      dispatch("updateData");

    },

    async connect({ commit, dispatch }) {
      try {
        await dispatch("initializeProvider");

        if (!(await dispatch("checkIfConnected"))) {
          await dispatch("requestAccess");
        }
        await dispatch("updateNetwork");
      } catch (error) {
        console.log(error);
        commit("setError", "Account request refused.");
      }

      await dispatch("afterConnect");
    },

    async afterConnect({ commit, dispatch }) {
      try {
        commit("setError", null);

        await dispatch("updateBalance");
        await dispatch("updateData");

      } catch (error) {
        console.log(error);
        commit("setError", "Account request refused.");
      }
      console.log("Ready");  
    },

    async disconnect({ commit }) {
      commit("setAccount", null);
      commit("setNetwork", null);
      commit("setError", null);
    },

    async changeAccount({ commit, dispatch }, account) {
      commit("setAccount", account);
      
      await dispatch("afterConnect");
    },

    async changeNetwork({ dispatch }) {
      await dispatch("updateNetwork");
      await dispatch("afterConnect");
    },

    async updateNetwork({ commit }) {
      const { ethereum } = window;

      console.log("Checking network");

      try {
        let network = await ethereum.request({ method: "eth_chainId" });
        commit("setNetwork", network);

      } catch (error) {
        // if the call of eth_chainId returns 4200, it means the provider does not support the chain id retrieval
        // in this case, we will just continue to switch the network
        if (error.code != 4200) {
          console.log(error);
          commit("setError", "Cannot get chain id.");
          return null;
        }
      }
    },

    async checkIfConnected({ dispatch, commit }) {
      var provider = await dispatch("initializeProvider");

      console.log("Checking if connected");
      const accounts = await provider.listAccounts();
      console.log(accounts);
      if (accounts.length !== 0) {
        commit("setAccount", accounts[0]);
        return 1;
      } else {
        return 0;
      }
    },

    async requestAccess({ commit }) {
      console.log("Requesting access");
      const { ethereum } = window;
      const accounts = await ethereum.request({ method:"eth_requestAccounts"});
      commit("setAccount", accounts[0]);
    },

    async updateBalance({ commit, dispatch }) {
      console.log("Updating balance");

      try {
        const provider = await dispatch("initializeProvider");
        const balance = await provider.getBalance(this.state.account);

        //const balance = await ethereum.request({ method: "eth_getBalance" , params: [ state.account, "latest" ]});
        commit("setBalance", balance);
      } catch(error) {
        console.log(error);
        commit("setBalance", null);
      }
    },
    
    async updateData({ commit, dispatch }) {
      console.log("Updating data");
      var factory = await dispatch("getFactory");

      let contractAddress = await factory.getMyControlledContractAddress();

      if(contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000") {
        console.log(`Contract detected : ${contractAddress}`);
        commit("setContractAddress", contractAddress);
      } else {
        console.log(`No contract detected`);
        commit("setContractAddress", null);
      }
  
    },  
  },
});
