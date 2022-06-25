<template>
    <div>
        <input type="password" v-model="pin" />
        <BasicButton @click="onOk">OK</BasicButton>
        <BasicButton @click="onCancel" v-if="canCancel">Cancel</BasicButton>
    </div>
</template>

<script>
import BasicButton from './BasicButton.vue';

export default {
    name: 'FirstAccess',
    data : function() {
        return {
            pin: String,
        };
    },
    props: {
        canCancel: Boolean,
    },
    computed: {
    },
    components: {
    BasicButton
},
    emits: {
        ok() { return true},
        cancel: () => true,
    },
    methods: {
        onOk(e) {
            e.preventDefault();
            this.$emit('ok', this.$data.pin)
        },
        onCancel(e) {
            e.preventDefault();
            this.$emit('cancel')
        },        
    },
    async mounted() {
        this.$data.pin = "";
    },
}

</script>

<style>
</style>
