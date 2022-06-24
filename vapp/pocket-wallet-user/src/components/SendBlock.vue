<template>
    <div>
        <div>
            <ul class="flex flex-row justify-center">
                <li v-for="receipient in list_receipients" :key="receipient.receipient">
                    <button @click="selectReceipient(receipient)" :class="{ 'border-blue-500': (receipient == send_receipient), 'text-blue-800': (receipient == send_receipient), 'bg-blue-100' : (receipient == send_receipient) }">
                        {{ receipient.label }}
                    </button>
                </li>
                <li>
                    <button @click="selectCustomReceipient()">Other ...</button>
                </li>
            </ul>
        </div>
        <div class="m-auto">
            <div v-if="custom_receipient">
                <label>Receipient address : </label>
                <input v-model="send_receipient.receipient" />
            </div>
            <div>
                <label>Amount : </label>
                <input type="number" v-model="send_amount" />
            </div>
            <PromiseButton :promiseFunction="sendAmountToReceipient" childClass="ml-2">Send</PromiseButton>
            <div v-if="success_message">
                <p class="text-green-800">{{ success_message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ethers } from 'ethers';
import PromiseButton from './PromiseButton.vue';

export default {
    name: 'FirstAccess',
    data : function() {
        return {
            custom_receipient: false,
            send_receipient: {
                receipient: null,
                label: null,
            },
            send_amount: 0,
            success_message: null,
        };
    },
    props: {
    },
    computed: {
        list_receipients() {
            return this.$store.getters.list_receipients;
        },
    },
    components: {
    PromiseButton
    },
    emits: {
    },
    methods: {
        selectReceipient(receipient) {
            this.$data.send_receipient = receipient;
            this.$data.custom_receipient = false;
        },
        selectCustomReceipient() {
            this.$data.send_receipient.label = "Other";
            this.$data.custom_receipient = true;
        },
        async sendAmountToReceipient() {
            console.log(this.$data.send_amount.toString());
            var trx = await this.$store.dispatch("sendAmount", { receipient: this.$data.send_receipient.receipient, amount: ethers.utils.parseEther(this.$data.send_amount.toString()) });
            
            console.log(trx);
            this.$data.success_message = `${this.$data.send_receipient.label} has received ${this.$data.send_amount} ether`
        }
    },
    async mounted() {
        this.$data.pin = "";
    },
}

</script>

<style>
</style>
