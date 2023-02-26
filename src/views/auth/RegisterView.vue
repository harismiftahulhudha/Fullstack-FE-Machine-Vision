<template>
    <div class="container">
        <div class="card shadow-sm col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2">
            <div class="p-4">
                <h3 class="mb-4">REGISTER</h3>
                <form @submit.prevent="requestRegister" autocomplete="off">
                    <div class="mb-3">
                        <label class="form-label">Name <span class="text-danger">*</span></label>
                        <input type="text" v-model="name" class="form-control" autocomplete="off" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Username <span class="text-danger">*</span></label>
                        <input type="text" v-model="username" class="form-control" autocomplete="off" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email <span class="text-danger">*</span></label>
                        <input type="email" v-model="email" class="form-control" autocomplete="off" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password <span class="text-danger">*</span></label>
                        <input type="password" v-model="password" class="form-control" autocomplete="off" minlength="8" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
                        <input type="password" v-model="confirmPassword" class="form-control" autocomplete="off" minlength="8" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Upload Photo</label>
                        <input type="file" ref="file" v-on:change="handlePhotoUpload()"  class="form-control">
                    </div>
                    <img :src="urlFile" v-if="urlFile" class="img-fluid img-thumbnail rounded mb-3" :alt="urlFile">
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">REGISTER</button>
                        <router-link :to="{name: 'auth.login'}" class="btn btn-secondary">LOGIN</router-link>
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
import authRepositories from '@apis/authRepositories'
import SHA256 from 'crypto-js/sha256'

const $loading = useLoading()

const toast = inject('toast')

const router = useRouter()

const {registerError, register} = authRepositories()

const name = ref(null)
const username = ref(null)
const email = ref(null)
const password = ref(null)
const confirmPassword = ref(null)
const file = ref(null)
const urlFile = ref(null)
const handlePhotoUpload = async () => {
    urlFile.value = URL.createObjectURL(file.value.files[0])
}

const requestRegister = async () => {
    if (password.value !== confirmPassword.value) {
        toast.error('Password and Confirm Password is not match')
        return
    }

    const loader = $loading.show({})
    let formData = new FormData()
    formData.append('name', name.value)
    formData.append('username', username.value)
    formData.append('email', email.value)
    formData.append('password', SHA256(password.value).toString())
    if (file.value !== null) {
        formData.append('photo', file.value.files[0])
    }
    await register(formData)
    if (registerError.value) {
        loader.hide()
        toast.error(registerError.value)
        return
    }

    toast.success('Success Register')
    loader.hide()
    name.value = ''
    username.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    file.value = null
    urlFile.value = null

    await router.push({name: 'auth.login'})
}
</script>