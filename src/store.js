import Vue from "vue";
import Vuex from "vuex";
import { getList } from "./api";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      list: []
    },
    actions: {
      async getList({ commit }) {
        const resp = await getList();
        const res = resp.data;
        commit("setList", res);
      }
    },
    mutations: {
      setList(state, payload) {
        const data = payload;
        state.list = data;
      }
    }
  });
}
