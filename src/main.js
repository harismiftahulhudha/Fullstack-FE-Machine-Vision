import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import {useStoreAuth} from '@stores/storeAuth'

import './assets/main.css'

import { library } from "@fortawesome/fontawesome-svg-core"
import { faSearch, faHeart, faStepForward, faForward, faStepBackward, faBackward, faEllipsisV } from "@fortawesome/free-solid-svg-icons"
library.add(faStepForward)
library.add(faForward)
library.add(faStepBackward)
library.add(faBackward)
library.add(faSearch)
library.add(faHeart)
library.add(faEllipsisV)
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import Toaster from "@meforma/vue-toaster"

const app = createApp(App)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(Toaster, {
    position: 'top-right',
    duration: 1500
}).provide('toast', app.config.globalProperties.$toast)
app.use(VueLoading)
app.use(createPinia())
app.use(router)

const storeAuth = useStoreAuth()

import { createToaster } from "@meforma/vue-toaster"
const toast = createToaster({
    position: 'top-right',
    duration: 1500
})

router.beforeEach((from, after) => {
    if (from.meta.requiredAuth && !storeAuth.token) {
        toast.error('You already logged out !')
        router.push({name: 'auth.login'})
    } else if (!from.meta.requiredAuth && storeAuth.token) {
        toast.error('You already logged in !')
        router.push({name: 'home.index'})
    }
})

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.min'
