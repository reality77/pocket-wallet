<template>
    <div class="text-sm text-slate-300
        hover:text-white hover:underline
        focus:outline-none focus:text-purple-100
        disabled:text-slate-500 flex flex-row cursor-pointer">
            <div class="flex-grow flex align-items:left">
                <slot></slot>
            </div>
            <div class="flex-initial ml-4">
                <i class="las la-angle-double-right text-slate-600" :class="{ 'text-white' : selected, 'font-bold' : selected }"></i>
            </div>
    </div>
</template>

<script>
export default {
    name: 'BasicButton',
    data : function() {
        return {
        };
    },
    props: {
        selected: Boolean
    },
    computed: {
    },
    components: {
    },
    emits: {
    },
    methods: {
    },
    async mounted() {
    },
}

</script>

<style>
</style>
