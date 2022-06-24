import Vuex from "vuex";
import { ethers } from "ethers";
import PocketWalletFactory from "../../../contracts/PocketWalletFactory.json"
import PocketWallet from "../../../contracts/PocketWallet.json"

export default new Vuex.Store({
  state: {
    network: null,
    balance: null,
    factory_address : "0xd1476bC527eEC759a03fd9cb5A0c227B700D49d3",
    wallet_address: null,
    wallet_mnemonic: null,
    wallet_private_key: null,
    wallet_balance: null,
    contract_address: null,
    list_receipients: null,
  },
  getters: {
    network: (state) => state.network,
    error: (state) => state.error,
    balance: (state) => state.balance,
    factory_address: (state) => state.factory_address,
    wallet_address: (state) => state.wallet_address,
    wallet_balance: (state) => state.wallet_balance,
    contract_address: (state) => state.contract_address,
    list_receipients: (state) => state.list_receipients,
  },
  mutations: {
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
    setWalletBalance(state, balance) {
      state.wallet_balance = balance;
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
    setListReceipients(state, listReceipients) {
      state.list_receipients = listReceipients;
    }
  },
  actions: {

    async getFactory(_, walletOrProvider) {
      return new ethers.Contract(this.getters.factory_address, PocketWalletFactory.abi, walletOrProvider);
    },

    async getContract(_, walletOrProvider) {
      return new ethers.Contract(this.getters.contract_address, PocketWallet.abi, walletOrProvider);
    },

    async getWallet() {
      const provider = ethers.getDefaultProvider("http://localhost:8545");
      
      let mnemonic = this.state.wallet_mnemonic;
      var wallet = ethers.Wallet.fromMnemonic(mnemonic);
      return wallet.connect(provider);
    },

    async generateWallet({ commit }, /*pin*/ ) {
      console.log("Generating your wallet");
      var wallet = ethers.Wallet.createRandom();
      const provider = ethers.getDefaultProvider("http://localhost:8545");
      wallet = wallet.connect(provider);

      commit("setWalletAddress", wallet.address)
      commit("setWalletMnemonic", wallet.mnemonic.phrase);
      commit("setWalletBalance", await wallet.getBalance());

      localStorage.setItem('wallet_address', wallet.address);
      console.log(`Wallet address : ${wallet.address}`);

      // TODO : Encrypt with PIN + salt
      localStorage.setItem('wallet_mnemonic', wallet.mnemonic.phrase);
    },

    async restoreWallet({ commit, dispatch }, mnemonic ) {
      commit("setWalletMnemonic", mnemonic);
      var wallet = await dispatch("getWallet");
      
      commit("setWalletAddress", wallet.address)
      commit("setWalletPrivateKey", wallet.privateKey);
      commit("setWalletBalance", await wallet.getBalance());

      localStorage.setItem('wallet_address', wallet.address);

      // TODO : Encrypt with PIN + salt
      localStorage.setItem('wallet_mnemonic', wallet.mnemonic.phrase);

      await dispatch("updateContract")
    },

    async loadWallet({ commit, dispatch }) {

      const provider = ethers.getDefaultProvider("http://localhost:8545");

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

      wallet.connect(provider);
      commit("setWalletBalance", await provider.getBalance(wallet.address));

      if(!contract) {
        console.log(`Searching for PocketWallet contract for the user ...`);

        var factory = await this.dispatch("getFactory", provider);
        contract = await factory.getUserContractAddress(address);
        
        if(contract != "0x0000000000000000000000000000000000000000") {
          console.log(`PocketWallet contract found : ${contract}`)
          commit("setContractAddress", contract);
        } else {
          console.log(`No PocketWallet contract found for this user`)
        }

        commit("setBalance", await provider.getBalance(contract));
        await dispatch("updateContract")

        return true;
      }
    },

    async sendAmount({dispatch}, receipientWithAmount) {
      var wallet = await dispatch("getWallet");
      var contract = await dispatch("getContract", wallet);

      console.log(receipientWithAmount.receipient);
      console.log(receipientWithAmount.amount);
      var trx = await contract.spend(receipientWithAmount.receipient, receipientWithAmount.amount);

      trx.wait();
      return trx;
    },

    async addReceipient({dispatch}, receipientWithLabel) {
      var wallet = await dispatch("getWallet");
      var contract = await dispatch("getContract", wallet);

      console.log(receipientWithLabel.receipient);
      console.log(receipientWithLabel.label);
      await contract.addReceipient(receipientWithLabel.receipient, receipientWithLabel.label);

      await dispatch("updateContract")
    },

    async removeReceipient({dispatch}, receipient) {
      var wallet = await dispatch("getWallet");
      var contract = await dispatch("getContract", wallet);

      await contract.removeReceipient(receipient);

      await dispatch("updateContract")
    },
    
    async updateContract({dispatch, commit}) {
      var wallet = await dispatch("getWallet");
      var contract = await dispatch("getContract", wallet);
      
      console.log(await contract.listReceipients());

      commit("setListReceipients", await contract.listReceipients());
    }
  },
});
