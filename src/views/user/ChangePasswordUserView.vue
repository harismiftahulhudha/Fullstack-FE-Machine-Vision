<template>
    <div class="container">
        <div class="card shadow-sm col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2">
            <div class="p-4">
                <h3 class="mb-4">CHANGE PASSWORD</h3>
                <form @submit.prevent="requestChangePasswordUser" autocomplete="off">
                    <div class="mb-3">
                        <label class="form-label">Old Password <span class="text-danger">*</span></label>
                        <input type="password" v-model="oldPassword" class="form-control" autocomplete="off" minlength="8" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">New Password <span class="text-danger">*</span></label>
                        <input type="password" v-model="newPassword" class="form-control" autocomplete="off" minlength="8" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
                        <input type="password" v-model="confirmPassword" class="form-control" autocomplete="off" minlength="8" required>
                    </div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-success">UPDATE</button>
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
import userRepositories from '@apis/userRepositories'
import SHA256 from 'crypto-js/sha256'

const $loading = useLoading()

const toast = inject('toast')

const storeAuth = useStoreAuth()

const router = useRouter()

const {
    changePasswordSuccess, changePasswordError, changePassword,
} = userRepositories()

const oldPassword = ref(null)
const newPassword = ref(null)
const confirmPassword = ref(null)
const requestChangePasswordUser = async () => {
    if (newPassword.value !== confirmPassword.value) {
        toast.error('New Password and Confirm Password is not match')
        return
    }
    const loader = $loading.show({})
    let body = {
        oldPassword: SHA256(oldPassword.value).toString(),
        newPassword: SHA256(newPassword.value).toString(),
        confirmNewPassword: SHA256(confirmPassword.value).toString(),
    }
    await changePassword(body)
    loader.hide()
    if (changePasswordError.value) {
        toast.error(changePasswordError.value)
        if (changePasswordError.value === 'jwt expired') {
            storeAuth.updateToken(null)
            await router.push({name: 'auth.login'})
        }
        return
    }

    toast.success('Success Change Password User')
    loader.hide()
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
}
</script>