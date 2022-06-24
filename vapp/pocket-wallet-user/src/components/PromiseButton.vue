<template>
    <BasicButton @click="onExecuteFunction" :disabled="loading">
        <slot></slot>
        <i v-if="loading" class="las la-spinner ml-2 rotating"></i>
    </BasicButton>
</template>

<script>
import BasicButton from "./BasicButton.vue"

export default {
    name: 'App',
    data : function() {
        return {
            loading: false
        };
    },
    props: {
        childClass: String,
        promiseFunction: Function,
    },
    computed: {
    },
    components: {
        BasicButton,
    },
    emits: {
        promiseFinalized() { return true }
    },
    methods: {
        async onExecuteFunction(e) {
            e.preventDefault();
            console.log(`PromiseButton : ${e}`)
            if(this.promiseFunction) {
                try {
                    var promise = this.promiseFunction();
                    this.loading = true;
                    var result = await promise;
                    this.loading = false;
                    this.$emit("promiseFinalized", result, null);
                } catch(e) {
                    this.loading = false;
                    console.error(e);
                    this.$emit("promiseFinalized", null, e);
                }
            }
        }
    },
    async mounted() {

},
}

</script>

<style>
</style>
