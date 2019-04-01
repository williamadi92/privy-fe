<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">PRIVYID FE</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="route('/')" href="#">Home</b-nav-item>
          <b-nav-item @click="route('/about')" href="#">About</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">User</template>
            <b-dropdown-item @click="logout" href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    methods: {
      logout: function() {
        this.$store.dispatch("logout").then(() => {
          this.$router.push("/login");
        });
      },
      route: function(route){
        this.$router.push(route);
      }
    }
  };
</script>