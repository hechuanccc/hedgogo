<template>
    <select
        class="form-control w-sm c-select"
        v-model="myGame"
        :required="req"
        :disabled="!disabled"
    >
        <option value="">{{ $t('common.please_select') }}</option>
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
import { getGame } from '../service'
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
            default: ''
        }
    },
    data () {
        return {
            games: [],
            myGame: this.game,
            default_opt_fields: 'id,display_name'
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
        getGame('list', {
            params: {
                opt_fields: `${this.opt_fields && this.opt_fields + ','}${this.attribute && this.attribute + ','}${this.default_opt_fields}`
            }
        }).then(data => {
            this.games = data
        })
        this.myGame = this.game
    }
}
</script>

