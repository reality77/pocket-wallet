<template>
    <BasicPanel class="flex flex-col">
        <div class="flex-initial pb-4 border-slate-600 border-b">
            <span class="data text-3xl">{{ balance }} Ξ</span>
        </div>
        <div class="flex-initial my-4">
            <h2>Send money</h2>
        </div>
        <div class="flex-grow flex flex-row">
            <BasicPanel class="flex-initial rounded-none border-0">
                <ul class="divide-y divide-slate-700 overflow-y-auto snap-mandatory snap-y">
                    <li v-for="receipient in list_receipients" :key="receipient.receipient" class="p-2 snap-start">
                        <SelectionButton @click="selectReceipient(receipient)" :selected="(receipient == send_receipient)">
                            <span class="text-left text-sm sm:text-lg">{{ receipient.label }}</span>
                        </SelectionButton>
                    </li>
                    <li class="p-2 snap-start">
                        <SelectionButton @click="selectCustomReceipient()" :selected="custom_receipient">
                            <span class="text-left text-sm sm:text-lg">Other ...</span>
                        </SelectionButton>
                    </li>
                </ul>
            </BasicPanel>
            <div class="flex-grow mx-8 flex flex-col">
                <div v-if="custom_receipient" class="flex-initial mb-4">
                    <label>Receipient address : </label>
                    <input v-model="send_receipient.receipient" />
                </div>
                <div v-if="send_receipient.receipient" class="flex-initial flex flex-col">
                    <div class="flex-auto flex flex-col">
                        <div class="flex-initial mb-4">
                            <label>Amount : </label>
                        </div>
                        <div class="flex-auto">
                            <input v-model="send_amount" class="bg-transparent text-white border-slate-700 text-center text-2xl w-48" />
                            <span class="text-white text-2xl">Ξ</span>
                        </div>
                    </div>
                    <div class="flex-initial">
                        <PromiseButton :promiseFunction="sendAmountToReceipient" :disabled="!send_amount" class="mt-8 text-lg">
                            Send {{ send_amount }} Ξ to {{ send_receipient.label }}</PromiseButton>
                    </div>
                    <div v-if="custom_receipient" class="flex-initial flex flex-col">
                        <div class="flex-auto">
                            <span>Please check the receipient address is correct before sending money</span>
                        </div>
                        <div class="flex-auto">
                            <span v-for="chunk, index in split_receipient_address" :key="chunk" class="text-white text-lg" :class="[ { 'text-green-400':  (index % 2 == 1) } ]">{{ chunk }}&nbsp;</span>
                        </div>
                    </div>
                </div>
            </div>         
        </div>
        <div class="flex-initial mt-4" v-if="success_message">
            <p class="text-green-400">{{ success_message }}</p>
        </div>           
    </BasicPanel>
</template>

<script>
import { ethers } from 'ethers';
import PromiseButton from './PromiseButton.vue';
import BasicPanel from '@reality77/crypto-vue-lib';
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
        split_receipient_address() {
            let address = this.$data.send_receipient.receipient;
            var chunks = [];

            let nb_cars = 4;
            let i = 0;

            if(address.startsWith("0x")) {
                chunks.push(address.substring(0, 2));
                i = 2;
            }

            for (; i < address.length; i += nb_cars) {
                chunks.push(address.substring(i, i + nb_cars));
            }

            return chunks;
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
            this.$data.send_amount = 0;
        }
    },
    async mounted() {
        this.$data.pin = "";
    },
}

</script>

<style>
</style>
