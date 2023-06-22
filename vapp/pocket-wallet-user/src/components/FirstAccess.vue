<template>
    <div v-if="!wallet_address">
        <div v-if="newAccount === true">
            <span>PIN Code : </span>
            <EnterPin @canCancel="false" @ok="onNewAccountPinEntered" @cancel="onNewAccountCancel"></EnterPin>
        </div>
        <div v-else-if="newAccount === false">
            <input v-model="mnemonic"/>
            <BasicButton @click="onRestoreFromMnemonic">Restore</BasicButton>
        </div>
        <div v-else>
            <h2>Bonjour !</h2>
            <p>
                Don't have a Pocket Wallet yet ? 
                <BasicButton @click="onNewAccount">Create my pocket</BasicButton>
            </p>
            <p>
                Already have one ?  
            </p>
            <BasicButton @click="onRestoreAccount">Restore my pocket</BasicButton>
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
import BasicButton from './BasicButton.vue';

export default {
    name: 'FirstAccess',
    data : function() {
        return {
            newAccount: null,
            walletAddress: "",
            mnemonic: "",
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
    BasicButton
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
        async onRestoreFromMnemonic() {
            await this.$store.dispatch("restoreWallet", this.$data.mnemonic);
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
