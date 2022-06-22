<template>
    <div>
        <h2>Contract</h2>
        <div class="mt-2">
            <label>Address : </label><span class="data">{{ contract_address }}</span>
        </div>    
        <div class="mt-2">
            <label>Balance : </label><span class="data">{{ contract_balance }} Ξ</span>
        </div>    
        <div class="mt-2">
            <label>User : </label><span class="data">{{ user_address }}</span>
        </div>    
        <div v-if="is_controller" class="mt-2 flex flex-col">
            <div>
                <h3>Add funds</h3>
                <div class="mt-2">
                    <label>Amount : </label><input type="number" v-model="amount" class="ml-2" />
                </div>
                <PromiseButton :promiseFunction="addFunds" childClass="ml-2">Add funds</PromiseButton>            
            </div>
            <div>
                <h3>Replacer user</h3>
                <div class="mt-2">
                    <label>New user address : </label><input v-model="newUserAddress" class="ml-2" />
                </div>
                <PromiseButton :promiseFunction="registerUser" childClass="ml-2">Replace user</PromiseButton>            
            </div>
        </div>
        <div v-else>
            <span class="text-red-500">You are not a controller of this contract</span>
        </div>
    </div>   
</template>

<script>
import { ethers } from "ethers";
import PromiseButton from "./PromiseButton.vue"

export default {
    name: 'PocketWalletController',
    data: function () {
        return {
            amount: 0,
            newUserAddress: null,
        }
    },
    props: {
    },
    computed: {
        contract_balance() {
            if(this.$store.getters.contract_balance != null) {
                return ethers.utils.formatEther(this.$store.getters.contract_balance);
            } else {
                return null;
            }
        },
        contract_address() {
            return this.$store.getters.contract_address;
        },
        user_address() {
            return this.$store.getters.user_address;
        },        
        is_controller() {
            return this.$store.getters.is_controller;
        },
    },
    components: {
        PromiseButton
    },
    methods: {
        async addFunds() {
            await this.$store.dispatch("addFunds", this.$data.amount.toString());
        },
        async registerUser() {
            await this.$store.dispatch("registerUser", this.$data.newUserAddress);
        }        
    },
    emits: {
    },
    async mounted() {

        //var bus = this
        //bus.$store.dispatch("initializeProvider");
    },
}

</script>

<style>
</style>
