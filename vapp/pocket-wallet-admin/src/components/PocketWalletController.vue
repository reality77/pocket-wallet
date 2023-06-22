<template>
    <div>
        <h2>Contract</h2>
        <div>
            <div class="mt-2">
                <label>Address : </label><span class="data">{{ contract_address_short }}</span>
            </div>
            <div class="mt-2">
                <label>Balance : </label><span class="data">{{ contract_balance }} Ξ</span>
            </div>
            <div class="mt-2">
                <label>User : </label><span class="data">{{ user_address_short }}</span>
            </div>
            <div v-if="is_controller" class="mt-2 flex flex-col">
                <div>
                    <h3>Add funds</h3>
                    <div class="mt-2">
                        <label>Amount : </label><input type="number" v-model="amount" class="ml-2" />
                        <PromiseButton :promiseFunction="addFunds" childClass="ml-2">Add funds</PromiseButton>
                    </div>
                </div>
                <div>
                    <h3>Replace user</h3>
                    <div class="mt-2">
                        <label>New user address : </label><input v-model="newUserAddress" class="ml-2" />
                        <PromiseButton :promiseFunction="registerUser" childClass="ml-2">Replace user</PromiseButton>
                    </div>
                </div>
                <div>
                    <h3>Receipients</h3>
                    <div class="mt-2">
                        <ul class="grid grid-rows-1 divide-y divide-slate-700">
                            <li v-for="receipient in list_receipients" :key="receipient.receipient" class="p-2">
                                <p>
                                    <span class="">{{ receipient.label }}</span>&nbsp;
                                    <span class="">{{ receipient.receipient }}</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-2">
                        <label>Label : </label><input v-model="newReceipientLabel" class="ml-2" />
                        <label>Address : </label><input v-model="newReceipientAddress" class="ml-2" />
                        <PromiseButton :promiseFunction="addReceipient" childClass="ml-2">Add receipient</PromiseButton>
                    </div>
                </div>
            </div>
            <div v-else>
                <span class="text-red-500">You are not a controller of this contract</span>
            </div>
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
            newReceipientLabel: null,
            newReceipientAddress: null,
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
        contract_address_short() 
        {
            return `${this.$store.getters.contract_address.substr(0, 6)}...${this.$store.getters.contract_address.substr(-4)}`;
        },
        user_address() {
            return this.$store.getters.user_address;
        },
        user_address_short() 
        {
            if (this.$store.getters.user_address) {
                return `${this.$store.getters.user_address.substr(0, 6)}...${this.$store.getters.user_address.substr(-4)}`;
            } else {
                return ''
            }
        },    
        is_controller() {
            return this.$store.getters.is_controller;
        },
        list_receipients() {
            return this.$store.getters.list_receipients;
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
        },
        async addReceipient() {
            await this.$store.dispatch("addReceipient", { label: this.$data.newReceipientLabel, receipient: this.$data.newReceipientAddress });
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
