<template>
    <div class="flex flex-col">
        <div class="border-slate-600 border-b pb-4 mb-4">
            <h2>
                <span>Contract</span> <span class="data">{{ contract_address }}</span>
            </h2>
        </div>
        <div class="p-4">
            <div>
                <span class="mr-2">
                    <i class="las la-coins la-3x"></i>
                </span>
                <span class="data text-3xl">{{ contract_balance }} Ξ</span>
            </div>
            <div class="mt-4">
                <label class="text-sm">User wallet address : </label><span class="data text-sm">{{ user_address }}</span>
            </div>
        </div>
        <div v-if="is_controller">
            <div class="p-4">
                <div class="text-xl font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul ref="tabs" class="flex flex-wrap -mb-px">
                        <li class="mr-2">
                            <a href="#" @click="selectTab(0)" :class="selected_tab_index == 0 ? getActiveTabClass() : getInactiveTabClass()" :aria-current="selected_tab_index == 0 ? 'page' : ''">Add funds</a>
                        </li>
                        <li class="mr-2">
                            <a href="#" @click="selectTab(1)" :class="selected_tab_index == 1 ? getActiveTabClass() : getInactiveTabClass()" :aria-current="selected_tab_index == 1 ? 'page' : ''">Replace user wallet</a>
                        </li>
                        <li class="mr-2">
                            <a href="#" @click="selectTab(2)" :class="selected_tab_index == 2 ? getActiveTabClass() : getInactiveTabClass()" :aria-current="selected_tab_index == 2 ? 'page' : ''">Receipients</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div v-if="selected_tab_index == 0">
                    <h3>Add funds to the user contract</h3>
                    <div class="mt-4 flex flex-col">
                        <div class="flex-auto">
                            <input type="number" v-model="amount" class="bg-transparent text-white border-slate-700 text-center text-2xl w-48">
                            <span class="text-white text-2xl">Ξ</span>
                        </div>
                        <div class="mt-2">
                            <PromiseButton :promiseFunction="addFunds">Add funds</PromiseButton>
                        </div>
                    </div>
                </div>
                <div v-if="selected_tab_index == 1">
                    <h3>You can change here the address of the user wallet who will benefit the contract if the wallet is lost</h3>
                    <div class="mt-4 flex flex-col">
                        <div class="flex-auto flex flex-row">
                            <label>New user address : </label>
                            <input v-model="newUserAddress" class="flex-grow bg-transparent text-white border-slate-700 min-w-48" />
                        </div>
                        <div class="mt-2">
                            <PromiseButton :promiseFunction="registerUser">Replace user</PromiseButton>
                        </div>
                    </div>
                </div>
                <div v-if="selected_tab_index == 2">
                    <h3>Here you can set preconfigured receipients to the user</h3>
                    <div class="mt-4 grid grid-cols-2 gap-2">
                        <template v-for="receipient in list_receipients" :key="receipient.receipient">
                            <div>
                                <span class="data font-bold">{{ receipient.label }}</span>
                            </div>
                            <div>
                                <span class="data">{{ receipient.receipient }}</span>
                            </div>
                        </template>
                        <div>
                            <label>Label : </label><input v-model="newReceipientLabel" class="ml-2 bg-transparent text-white border-slate-700 min-w-48" />
                        </div>
                        <div>
                            <label>Address : </label><input v-model="newReceipientAddress" class="ml-2 bg-transparent text-white border-slate-700 min-w-48" />
                            <PromiseButton :promiseFunction="addReceipient" childClass="ml-2">Add receipient</PromiseButton>
                        </div>            
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <span class="text-red-500">You are not a controller of this contract</span>
        </div>        
    </div>
</template>

<script setup>
import { ethers } from "ethers";
import PromiseButton from "./PromiseButton.vue"
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const tabs = ref()

const amount = ref(0)
const newUserAddress = ref()
const newReceipientLabel = ref()
const newReceipientAddress = ref()

const contract_balance = computed(() => {
            if(store.getters.contract_balance != null) {
                return ethers.utils.formatEther(store.getters.contract_balance);
            } else {
                return null;
            }
        });


const contract_address = computed(() => {
            return store.getters.contract_address;
        });

/*
const contract_address_short = computed(() => {
            return `${store.getters.contract_address.substr(0, 6)}...${store.getters.contract_address.substr(-4)}`;
        });
*/

const user_address = computed(() => {
            return store.getters.user_address;
        });

        /*
const user_address_short = computed(() => {
            if (store.getters.user_address) {
                return `${store.getters.user_address.substr(0, 6)}...${store.getters.user_address.substr(-4)}`;
            } else {
                return ''
            }
        });
*/

const is_controller = computed(() => store.getters.is_controller);

const list_receipients = computed(() => store.getters.list_receipients);

const selected_tab_index = ref(0);


function getInactiveTabClass() {
    return "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:text-gray-300";
}

function getActiveTabClass() {
    return "inline-block p-4 border-b-2 rounded-t-lg active text-purple-500 border-purple-500";
}


async function addFunds() {
    await store.dispatch("addFunds", amount.value.toString());
}

async function registerUser() {
    await store.dispatch("registerUser", newUserAddress.value);
}

async function addReceipient() {
    await store.dispatch("addReceipient", { label: newReceipientLabel.value, receipient: newReceipientAddress.value });
}

function selectTab(index) {
    selected_tab_index.value = index;

}

</script>

<style>

</style>
