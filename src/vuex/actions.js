import $ from '../utils/util'

export const fetchMember = (context, { successCb, errorCb }) => {
    $.fetchMember((member) => {
        context.commit('FETCH_MEMBER', member)
    }, successCb, errorCb)
}

export const setGame = ({commit}, game) => {
    commit('SET_GAME', game)
}
