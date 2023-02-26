<template>
    <header id="header" class="fixed-top">
        <nav class="navbar navbar-expand-xxl navbar-dark bg-dark">
            <div class="container-fluid">
                <router-link class="navbar-brand" :to="{name: isLoggedIn ? 'home.index' : 'auth.login'}">Machine Vision</router-link>
                <button v-if="isLoggedIn" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div v-if="isLoggedIn" class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{ active: currentUrl === '/home' }" :to="{name: 'home.index'}">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{ active: currentUrl === '/user' }"  :to="{name: 'user.index'}">User</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{ active: currentUrl === '/user/change-password' }" :to="{name: 'user.changePassword'}">Change Password</router-link>
                        </li>
                        <li class="nav-item" :class="{ active: currentUrl === '/post' }">
                            <router-link class="nav-link" :class="{ active: currentUrl === '/post' }" :to="{name: 'post.user'}">Post</router-link>
                        </li>
                    </ul>
                    <ul class="navbar-nav d-flex mb-2 mb-lg-2">
                        <li class="nav-item">
                            <a class="btn btn-outline-success" @click="requestLogout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main id="main" style="margin-top: 62px;">
        <div style="margin-top: 100px; margin-bottom: 100px;">
            <RouterView />
        </div>
    </main>
    <footer id="footer"></footer>
</template>
<script setup>
import {computed, inject} from "vue"
import {RouterView, useRoute, useRouter} from 'vue-router'
import authRepositories from '@apis/authRepositories'
import {useStoreAuth} from '@stores/storeAuth'
import {useLoading} from "vue-loading-overlay"

const $loading = useLoading()

const toast = inject('toast')

const storeAuth = useStoreAuth()

const router = useRouter()

const route = useRoute()

const {logout} = authRepositories()

const isLoggedIn = computed(() => {
    return storeAuth.token !== null
})

const currentUrl = computed(() => {
    return route.path
})

const requestLogout = async () => {
    const loader = $loading.show({})
    await logout()
    loader.hide()
    toast.success('Success Logout')
    storeAuth.updateToken(null)
    await router.push({name: 'auth.login'})
}

</script>