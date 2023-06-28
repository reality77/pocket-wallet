<template>
    <select v-model="selected_provider" @change="onProviderChanged" class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500">
        <option v-for="providerKey in Object.keys(providers)" :key="providerKey" :value="providerKey">{{  providers[providerKey].caption }}</option>
    </select>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const providers = computed(() => store.getters.providers);
const store_selected_provider = computed(() => store.getters.selected_provider);
const selected_provider = ref();

watch(store_selected_provider, async (newProvider) => {
    selected_provider.value = newProvider;
})

onMounted(() => {
    selected_provider.value = store.getters.selected_provider;
});

function onProviderChanged() {
    store.dispatch("setSelectedProvider", selected_provider.value);
    store.dispatch("loadWallet");
}

</script>