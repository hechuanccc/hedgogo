const types = {
    UPDATE_FEILD: 'UPDATE_FIELD',
    CLEAR_BUFFER: 'CLEAR_BUFFER'
}

const state = {
    playsetBuffer: {}
}

const getters = {
    getPlaysetBuffer: () => {
        return state.playsetBuffer
    }
}

const actions = {
    updateField ({commit}, config) {
        commit(types.UPDATE_FEILD, config)
    },
    clearBuffer ({commit}) {
        commit(types.CLEAR_BUFFER)
    }
}

const mutations = {
    [types.UPDATE_FEILD] (state, config) {
        const playset = config.playset
        const id = playset.id
        if (!state.playsetBuffer[id]) {
            state.playsetBuffer[id] = {
                id: id,
                index: playset.index,
                parent: playset.parent
            }
        }
        state.playsetBuffer[id][config.key] = config.value
    },
    [types.CLEAR_BUFFER] (state) {
        state.playsetBuffer = {}
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

