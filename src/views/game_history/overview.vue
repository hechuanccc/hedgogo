<template>
	<div class="card col">
		<div class="card-body">
			<table class="table table-bordered">
				<thead>
					<tr>
						<th scope="col">{{$t('game_history.game')}}</th>
						<th scope="col">{{$t('game_history.already_result')}}</th>
						<th scope="col">{{$t('game_history.notyet_result')}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for = "game in game_list" 
					    :keys = "game.id">
				        <router-link
					        :to = "'/game_history/' + game.id"
					        tag = "td"
					        class = "href-hover">
					        {{game.display_name}}
					    </router-link>
				    <td><span class="history-list__value">gaining...</span></td>
				    <td><span class="history-list__value">gaining...</span></td>
                    </tr>
				</tbody>
			</table>
		</div>
		</div>
</template>
<script>
import api from '../../api.js'

export default{
    data () {
        return {
            game_list: ''
        }
    },
    methods: {
        getGame () {
            this.$http.get(api.game_list).then(
                response => {
                    this.game_list = response.data
                },
                response => {
                    if (('' + response.status).indexOf('4') === 0) {
                        this.$router.push('/login?next=' + this.$route.path)
                    }
                })
        }
    },
    created () {
        this.getGame()
    }
}
</script>
<style lang="sass" scoped>
.history-list__value
  padding-right: 0.7em
  padding-left: 0.7em
  padding-top: 0.5em
  padding-bottom: 0.5em
  border-radius: 5px
  background-color: #E5E5E5
.href-hover
  cursor: pointer
  &:hover
    background-color: #E7E5E5
    transition: background-color .2s
</style>
