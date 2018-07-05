import Notifications from './Notifications.vue'

const NotificationStore = {
    state: [], // here the notifications will be added

    removeNotification (index) {
        this.state.splice(index, this.state.length)
    },
    async notify (notification) {
        if (this.state.length) {
            await this.removeNotification(0)
        }
        this.state.push(notification)
    }
}

var NotificationsPlugin = {

    install (Vue) {
        Object.defineProperty(Vue.prototype, '$notifications', {
            get () {
                return NotificationStore
            }
        })
        Vue.component('Notifications', Notifications)
    }
}

export default NotificationsPlugin
