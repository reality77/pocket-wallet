<template>
    <div>
        <input type="password" v-model="pin" />
        <button @click="onOk">OK</button>
        <button @click="onCancel" v-show="canCancel">Cancel</button>
    </div>
</template>

<script>
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
