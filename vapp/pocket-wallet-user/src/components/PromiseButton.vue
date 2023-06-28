<template>
    <BasicButton @click="onExecuteFunction" :disabled="loading">
        <slot></slot>
        <i v-if="loading" class="las la-spinner ml-2 rotating"></i>
        <i v-if="error" class="las la-exclamation-circle ml-2 text-red-500 text-lg font-bold" :title="error"></i>
    </BasicButton>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import BasicButton from './BasicButton.vue';

const props = defineProps(['childClass', 'promiseFunction']);
const emit = defineEmits(['promiseFinalized']);

const loading = ref(false);
const error = ref();

async function onExecuteFunction(e) {
    e.preventDefault();
    console.log(`PromiseButton : ${e}`)
    error.value = null;
    if(props.promiseFunction) {
        try {
            var promise = props.promiseFunction();
            loading.value = true;
            var result = await promise;
            loading.value = false;
            emit("promiseFinalized", result, null);
        } catch(e) {
            loading.value = false;

            if(e.code != 4001) {    // 4001 = User rejected transaction
                error.value = e.message;
                console.error(e);
            }

            emit("promiseFinalized", null, e);
        }
    }
}

</script>

<style>
</style>
