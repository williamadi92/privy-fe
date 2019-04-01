<template>
  <div id="app">
    <Navbar v-if="isLoggedIn"></Navbar>
    {{ getCredential }}
    <router-view/>
  </div>
</template>

<script>
  import Navbar from '@/components/nav/Navbar';

  export default {
    computed: {
      isLoggedIn: function() {
        return this.$store.getters.isLoggedIn;
      },
      getCredential: function() {
        return this.$store.getters.getCredential;
      }
    },
    components: {
      Navbar
    }
  }
</script>