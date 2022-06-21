<template>
    <div v-if="!wallet_address">
        <div v-if="newAccount === true">
            <EnterPin @canCancel="false" @ok="onNewAccountPinEntered" @cancel="onNewAccountCancel"></EnterPin>
        </div>
        <div v-else-if="newAccount === false">
            TODO : restore account from mnemonic or encrypted file ?
        </div>
        <div v-else>
            <h2>Bonjour !</h2>
            <p>
                Don't have a Pocket Wallet yet ? 
                <button @click="onNewAccount">Create my pocket</button>
            </p>
            <p>
                Already have one ?  
            </p>
            <button @click="onRestoreAccount">Restore my pocket</button>
        </div>
    </div>
    <div v-else>
        <div v-if="!contract_address">
        <div>
        </div>
            <p>
                This is your wallet address. Send it to your parent to finalize the creation of your pocket wallet 
            </p>
            <span>{{ wallet_address }}</span>
        </div>

    </div>
</template>

<script>
import EnterPin from './EnterPin.vue';

export default {
    name: 'FirstAccess',
    data : function() {
        return {
            newAccount: null,
            walletAddress: ""
        };
    },
    props: {
    },
    computed: {
    wallet_address() {
        return this.$store.getters.wallet_address;
    },
    contract_address() {
      return this.$store.getters.contract_address;
    },

    },
    components: {
        EnterPin,
    },
    emits: {
    },
    methods: {
        onNewAccount(e) {
            e.preventDefault();
            this.$data.newAccount = true;
            return true;
        },
        onRestoreAccount(e) {
            e.preventDefault();
            this.$data.newAccount = false;
            return true;
        },
        async onNewAccountPinEntered(pin) {
            await this.$store.dispatch("generateWallet", pin);
        },
        onNewAccountCancel() {
            return false;
        }
    },
    async mounted() {

    },
}

</script>

<style>
</style>
