import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
    user: {
        level: {}
    },
    game: {

    }
}

const mutations = {
    FETCH_MEMBER (state, member) {
        state.user = member[0]
    },
    CLEAR_MEMBER (state) {
        state.user = {}
    },
    SET_GAME (state, game) {
        state.game = game
    }
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    strict: debug
})
