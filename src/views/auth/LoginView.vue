<template>
    <div class="container">
        <div class="card shadow-sm col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2">
            <div class="p-4">
                <h3 class="mb-4">LOGIN</h3>
                <form @submit.prevent="requestLogin" autocomplete="off">
                    <div class="mb-3">
                        <label class="form-label">Username</label>
                        <input type="text" v-model="username" class="form-control" autocomplete="off" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" v-model="password" class="form-control" autocomplete="off" minlength="8" required>
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">LOGIN</button>
                        <router-link :to="{name: 'auth.register'}" class="btn btn-secondary">REGISTER</router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, inject} from 'vue'
import {useRouter} from 'vue-router'
import {useLoading} from 'vue-loading-overlay'
import {useStoreAuth} from '@stores/storeAuth'
import authRepositories from '@apis/authRepositories'
import SHA256 from 'crypto-js/sha256'

const $loading = useLoading()

const toast = inject('toast')

const storeAuth = useStoreAuth()

const router = useRouter()

const {loginSuccess, loginError, login} = authRepositories()

const username = ref('')
const password = ref('')

const requestLogin = async () => {
    const loader = $loading.show({})
    let body = {
        username: username.value,
        password: SHA256(password.value).toString()
    }
    await login(body)
    if (loginError.value) {
        loader.hide()
        storeAuth.updateToken(null)
        toast.error(loginError.value)
        return
    }

    storeAuth.updateToken(loginSuccess.value.data.token)
    toast.success('Success Login')
    loader.hide()
    username.value = ''
    password.value = ''
    window.location.replace("/home")
}

</script>