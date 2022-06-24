<template>
    <AppUser></AppUser>
</template>

<script>
import AppUser from './components/AppUser.vue';

export default {
  name: 'App',
  data: function () {
    return {
    }
  },
  props: {
  },
  computed: {
  },
  components: {
    AppUser
  },
  methods: {
    async mounted() {

    },
  },
  emits: {
  },
}

</script>

<style>
@font-face {
  font-family: "Avenir";
  src: url("./assets/fonts/AvenirLTStd-Book.otf") format("opentype");
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
}
</style>
