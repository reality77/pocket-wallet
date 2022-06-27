import Vuex from "vuex";
import { ethers } from "ethers";
import PocketWalletFactory from "../../../contracts/PocketWalletFactory.json"
import PocketWallet from "../../../contracts/PocketWallet.json"

export default new Vuex.Store({
  state: {
    account: null,
    network: null,
    balance: null,
    error: null,
    factory_address : "0xd1476bC527eEC759a03fd9cb5A0c227B700D49d3",
    factory_found: false,
    user_address: null,
    contract_address: null,
    contract_balance: null,
    is_controller: false,
    list_receipients: null,
  },
  getters: {
    account: (state) => state.account,
    network: (state) => state.network,
    balance: (state) => state.balance,
    error: (state) => state.error,
    factory_address: (state) => state.factory_address,
    user_address: (state) => state.user_address,
    contract_address: (state) => state.contract_address,
    contract_balance: (state) => state.contract_balance,
    is_controller: (state) => state.is_controller,
    list_receipients: (state) => state.list_receipients,
    factory_found: (state) => state.factory_found,
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
    setContractBalance(state, balance) {
      state.contract_balance = balance;
    },
    setIsController(state, isController) {
      state.is_controller = isController;
    },        
    setError(state, error) {
      state.error = error;
    },
    setListReceipients(state, listReceipients) {
      state.list_receipients = listReceipients;
    },
    setFactoryFound(state, factoryFound) {
      state.factory_found = factoryFound;
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

    async getFactory({ commit }, walletOrProvider) {

      console.log("Initializing factory");
      try {
        const factory = new ethers.Contract(this.getters.factory_address, PocketWalletFactory.abi, walletOrProvider);
        let ok = await factory.isInitialized();
        commit("setFactoryFound", ok);
        return factory;
      } catch(e) {
        console.log("Factory not found");
        commit("setFactoryFound", false);
        return null;
      }

    },

    async createContract({ dispatch }, userAddress) {
        const provider = await dispatch("initializeProvider");
        var factory = await dispatch("getFactory", provider.getSigner());

      if(!factory) {
        return;
      }
      
      try {

        var trx = await factory.createPocketWallet(userAddress, {
          type: 2,
          maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
          maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
          gasLimit: 2000000,
          value: ethers.utils.parseEther("10")
        });
  
        await trx.wait();

      } catch(e) {
        console.error(e);
      }

      await dispatch("updateContractData");

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
        await dispatch("updateContractData");

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
    
    async getContract({dispatch}) {
      var provider = await dispatch("initializeProvider");
      return new ethers.Contract(this.getters.contract_address, PocketWallet.abi, provider.getSigner());
    },

    async updateContractData({ commit, dispatch }) {
      console.log("Updating data");
      var provider = await dispatch("initializeProvider");
      var factory = await dispatch("getFactory", provider.getSigner());

      if(!factory) {
        return;
      }


      let contractAddress = await factory.getMyControlledContractAddress();

      if(contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000") {
        console.log(`Contract detected : ${contractAddress}`);
        commit("setContractAddress", contractAddress);

        var contract = await dispatch("getContract");

        //console.log(`Contract controllers : ${await contract.getControllers()}`);

        commit("setContractBalance", await provider.getBalance(contractAddress));
        commit("setIsController", true);
        commit("setUserAddress", await contract.getUser());
        commit("setListReceipients", await contract.listReceipients());

      } else {
        console.log(`No contract detected`);
        commit("setContractAddress", null);
        commit("setContractBalance", null);
        commit("setIsController", false);
        commit("setUserAddress", null);
        commit("setListReceipients", null);
      }
    }, 
    
    async addFunds({dispatch}, amount) {
      const provider = await dispatch("initializeProvider");

      let tx = {
        to: this.state.contract_address,
        value: ethers.utils.parseEther(amount)
      };

      var response = await provider.getSigner().sendTransaction(tx);
      await response.wait();

      await dispatch("updateBalance");
      await dispatch("updateContractData");

    },

    async registerUser({dispatch}, userAddress) {
      var contract = await dispatch("getContract");

      var response = await contract.register(userAddress);
      await response.wait();

      await dispatch("updateBalance");
      await dispatch("updateContractData");

    },

    async addReceipient({dispatch}, receipient) {
      var contract = await dispatch("getContract");

      var response = await contract.addReceipient(receipient.receipient, receipient.label);
      await response.wait();

      await dispatch("updateBalance");
      await dispatch("updateContractData");

    }
  },
});
