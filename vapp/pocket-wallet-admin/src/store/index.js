import Vuex from "vuex";
import { ethers } from "ethers";
import PocketWalletFactory from "../contracts/PocketWalletFactory.json"

export default new Vuex.Store({
  state: {
    account: null,
    network: null,
    balance: null,
    factory_address : "0xd1476bC527eEC759a03fd9cb5A0c227B700D49d3",
    wallet_address: null,
    wallet_mnemonic: null,
    wallet_private_key: null,
    contract_address: null,
  },
  getters: {
    account: (state) => state.account,
    network: (state) => state.network,
    error: (state) => state.error,
    balance: (state) => state.balance,
    factory_address: (state) => state.factory_address,
    wallet_address: (state) => state.wallet_address,
    contract_address: (state) => state.contract_address,
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
    setWalletAddress(state, address) {
      state.wallet_address = address;
    },
    setWalletMnemonic(state, mnemonic) {
      state.wallet_mnemonic = mnemonic;
    },
    setWalletPrivateKey(state, privateKey) {
      state.wallet_private_key = privateKey;
    },    
    setContractAddress(state, address) {
      state.contract_address = address;
    },
  },
  actions: {

    async getFactory(_, walletOrProvider) {
      return new ethers.Contract(this.getters.factory_address, PocketWalletFactory.abi, walletOrProvider);
    },

    async generateWallet({ commit }, /*pin*/ ) {
      console.log("Generating your wallet");
      const wallet = ethers.Wallet.createRandom();
      
      commit("setWalletAddress", wallet.address)
      commit("setWalletMnemonic", wallet.mnemonic.phrase);

      localStorage.setItem('wallet_address', wallet.address);
      console.log(`Wallet address : ${wallet.address}`);

      // TODO : Encrypt with PIN + salt
      localStorage.setItem('wallet_mnemonic', wallet.mnemonic.phrase);
    },

    async restoreWallet({ commit }, mnemonic ) {
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);
      
      commit("setWalletAddress", wallet.address)
      commit("setWalletMnemonic", mnemonic);
      commit("setWalletPrivateKey", wallet.privateKey);

      localStorage.setItem('wallet_address', wallet.address);

      // TODO : Encrypt with PIN + salt
      localStorage.setItem('wallet_mnemonic', wallet.mnemonic.phrase);
    },

    async loadWallet({ commit }) {

      // TODO : Decrypt with PIN + salt
      let mnemonic = localStorage.getItem('wallet_mnemonic')
      let address = localStorage.getItem('wallet_address')
      let contract = localStorage.getItem('contract_address')
      
      // test if mnemonic is valid
      if(!ethers.utils.isValidMnemonic(mnemonic)) {
        console.log("Invalid mnemonic");
        return;
      }

      var wallet = ethers.Wallet.fromMnemonic(mnemonic);

      if(!ethers.utils.isAddress(address)) {
        console.warn("Invalid loaded wallet address. The wallet address has been rebuilt from the mnemonic");
        address = wallet.address;
      }

      commit("setWalletAddress", address);
      commit("setWalletMnemonic", mnemonic);

      if(!contract) {
        console.log(`Searching for PocketWallet contract for the user ...`);
        var provider = ethers.getDefaultProvider("http://localhost:8545");

        var factory = await this.dispatch("getFactory", provider);
        contract = await factory.getUserContractAddress(address);
        
        if(contract != "0x0000000000000000000000000000000000000000") {
          console.log(`PocketWallet contract found : ${contract}`)
          commit("setContractAddress", contract);
        } else {
          console.log(`No PocketWallet contract found for this user`)
        }
  
        return true;
      }
    }
  },
});
