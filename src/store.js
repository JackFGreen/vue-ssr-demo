const Vue = require("vue");
const Vuex = require("vuex");

Vue.use(Vuex);

const { getList } = require("./api");

exports.createStore = () => {
  return new Vuex.Store({
    state: {
      list: []
    },
    actions: {
      async getList({ commit }) {
        const resp = await getList();
        const res = resp.data
        commit("setList", res);
      }
    },
    mutations: {
      setList(state, payload) {
        const data = payload
        state.list = data
      }
    }
  });
};
