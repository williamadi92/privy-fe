<template>
  <b-container class="login-container">
    <h1 class="center">Login</h1>
    <b-row class="justify-content-md-center">
      <b-col cols="6">
        <div v-if="error != ''">
          <b-alert variant="danger" show>{{ error }}</b-alert>
        </div>
        <b-form @submit.prevent="onSubmit">
          <b-form-group id="input-group-1" label="Privy ID:" label-for="privy_id">
            <b-form-input
              id="privy_id"
              v-model="form.privy_id"
              type="text"
              required
              placeholder="Enter Privy ID"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Password:" label-for="password">
            <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Enter Password"
            ></b-form-input>
          </b-form-group>

          <b-button class="login-button" type="submit" variant="primary">
            <b-spinner v-if="isSubmit" small label="Spinning"></b-spinner>
            <span v-else>Login</span>
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        privy_id: "",
        password: ""
      },
      error: "",
      isSubmit: false
    };
  },
  methods: {
    onSubmit() {
      this.isSubmit = true;
      this.error = "";
      let privy_id = this.form.privy_id;
      let password = this.form.password;

      this.$store
        .dispatch("login", { privy_id, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
          this.isSubmit = false;
          this.error = "Privy ID atau Password Salah!";
        });
    }
  }
};
</script>

<style scoped>
.center {
  text-align: center;
}

.login-button {
  margin: 0px auto;
  display: flex;
  padding-left: 30px;
  padding-right: 30px;
}

.login-container {
  margin-top: 30px;
}
</style>