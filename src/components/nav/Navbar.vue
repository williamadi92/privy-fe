<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand @click="route('/')" href="#">PRIVYID FE</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="route('/product')" href="#">Product</b-nav-item>
          <b-nav-item @click="route('/category')" href="#">Category</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">{{ user.nama }}</template>
            <b-dropdown-item @click="modalShow = !modalShow" href="#">Profile</b-dropdown-item>
            <b-dropdown-item @click="logout" href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal v-model="modalShow" title="User Profile">
      <table class="table table-hovered">
        <tr>
          <th>Privy ID</th>
          <td>{{ user.privy_id }}</td>
        </tr>
        <tr>
          <th>Nama</th>
          <td>{{ user.nama }}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>{{ user.email }}</td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>{{ user.phone }}</td>
        </tr>
        <tr>
          <th>Verified Status</th>
          <td>{{ user.verified_status }}</td>
        </tr>
      </table>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalShow: false,
      user: {}
    };
  },
  mounted: function() {
    if (localStorage.user) {
      this.user = JSON.parse(localStorage.user);
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    route: function(route) {
      this.$router.push(route);
    }
  }
};
</script>
