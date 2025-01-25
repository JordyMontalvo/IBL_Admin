import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accounts: [{
      type:      'admin',
      email:     'IBL',
      password:  'ibl2025',
      id:        'admin',
      name:      'Administrador',
    },
    ],

    account: null,
  },
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
  },
})
