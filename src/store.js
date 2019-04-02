import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: localStorage.getItem("user") || {}
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, token) {
      state.status = "success";
      state.token = token;
    },
    auth_success_user(state, user) {
      state.status = "success";
      state.user = user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.user = "";
    }
  },
  actions: {
    async login({ commit }, user) {
      return await new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://pretest-qa.privydev.id/api/v1/auth",
          data: user,
          method: "POST"
        })
          .then(resp => {
            if (resp.data.data.code == 200) {
              //error
              commit("auth_error");
              localStorage.removeItem("token");
              reject(resp);
            } else {
              const token = resp.data.data.token;
              localStorage.setItem("token", token);

              axios.defaults.headers.common["Authorization"] = token;
              commit("auth_success", token);

              axios({
                url: "http://pretest-qa.privydev.id/api/v1/me",
                method: "GET"
              })
                .then(resp => {
                  const user_data = resp.data.data;
                  localStorage.setItem("user", JSON.stringify(user_data));
                  commit("auth_success_user", user_data);
                  resolve(resp);
                })
                .catch(err => {
                  commit("auth_error");
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  reject(err);
                });
            }
          })
          .catch(err => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
});
