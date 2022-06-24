<template>
    <BasicPanel class="flex flex-col">
        <div>
            <span class="data text-2xl">{{ balance }} Ξ</span>
        </div>
        <div class="flex flex-row">
            <BasicPanel class="flex-initial">
                <ul class="grid grid-rows-1 divide-y divide-slate-700">
                    <li v-for="receipient in list_receipients" :key="receipient.receipient" class="p-2">
                        <SelectionButton @click="selectReceipient(receipient)" :selected="(receipient == send_receipient)">
                            <span class="text-left">{{ receipient.label }}</span>
                        </SelectionButton>
                    </li>
                    <li class="p-2">
                        <SelectionButton @click="selectCustomReceipient()" :selected="custom_receipient">
                            <span class="text-left">Other ...</span>
                        </SelectionButton>
                    </li>
                </ul>
            </BasicPanel>
            <div class="flex-grow m-auto">
                <div v-if="custom_receipient">
                    <label>Receipient address : </label>
                    <input v-model="send_receipient.receipient" />
                </div>
                <div v-if="send_receipient.receipient">
                    <div>
                        <label>Amount : </label>
                        <input type="number" v-model="send_amount" />
                    </div>
                    <PromiseButton :promiseFunction="sendAmountToReceipient" :disabled="!send_amount" childClass="ml-2">
                        Send {{ send_amount }} Ξ to {{ send_receipient.label }}</PromiseButton>
                    <div v-if="success_message">
                        <p class="text-green-400">{{ success_message }}</p>
                    </div>
                </div>
            </div>
        </div>
    </BasicPanel>
</template>

<script>
import { ethers } from 'ethers';
import PromiseButton from './PromiseButton.vue';
import BasicPanel from './BasicPanel.vue';
import SelectionButton from './SelectionButton.vue';

export default {
    name: 'FirstAccess',
    data: function () {
        return {
            custom_receipient: false,
            send_receipient: {
                receipient: null,
                label: null,
            },
            send_amount: 0,
            saved_custom_receipient_address: null,
            success_message: null,
        };
    },
    props: {
    },
    computed: {
        balance() {
            if (this.$store.getters.balance) {
                return ethers.utils.formatEther(this.$store.getters.balance);
            } else {
                return null;
            }
        },
        list_receipients() {
            return this.$store.getters.list_receipients;
        },
    },
    components: {
    PromiseButton,
    BasicPanel,
    SelectionButton
},
    emits: {
    },
    methods: {
        selectReceipient(receipient) {
            if(this.$data.custom_receipient) {
                this.$data.saved_custom_receipient_address = this.$data.send_receipient.receipient;
            }

            this.$data.send_receipient = receipient;
            this.$data.custom_receipient = false;
        },
        selectCustomReceipient() {
            this.$data.send_receipient = {
                receipient: this.$data.saved_custom_receipient_address,
                label: "Other"
            };
            this.$data.custom_receipient = true;
        },
        async sendAmountToReceipient() {
            console.log(this.$data.send_amount.toString());
            var trx = await this.$store.dispatch("sendAmount", { receipient: this.$data.send_receipient.receipient, amount: ethers.utils.parseEther(this.$data.send_amount.toString()) });

            console.log(trx);
            this.$data.success_message = `${this.$data.send_receipient.label} has received ${this.$data.send_amount} ether`
            this.$data.send_amount = null;
        }
    },
    async mounted() {
        this.$data.pin = "";
    },
}

</script>

<style>
</style>
