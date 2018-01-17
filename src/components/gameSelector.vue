<template>
    <select class="form-control w-sm c-select" v-model="myGame" :required="req" :disabled="!disabled">
        <option value="">{{ $t('common.game') }}</option>
        <option
            class="form-control"
            :value="e[attribute]"
            v-for="e in games"
            :key="e.id"
        >
            {{ e.display_name }}
        </option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: {
        req: {
            default: false
        },
        game: '',
        disabled: {
            default: true
        },
        attribute: {
            default: 'code'
        },
        opt_fields: {
            default: 'id,display_name,code'
        }
    },
    data () {
        return {
            games: [],
            myGame: this.game
        }
    },
    watch: {
        game (newObj, old) {
            this.myGame = newObj || ''
        },
        myGame (newObj, old) {
            if (this.myGame !== '0') {
                if (newObj !== undefined) {
                    this.$emit('game-select', newObj)
                }
            }
        }
    },
    created () {
        this.$http.get(`${api.game_list}${this.opt_fields !== '' ? '?opt_fields=' + this.opt_fields : ''}`).then(data => {
            this.games = data
        })
        this.myGame = this.game
    }
}
</script>

