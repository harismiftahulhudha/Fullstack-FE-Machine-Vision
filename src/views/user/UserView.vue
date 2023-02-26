<template>
    <div class="container">
        <div class="card shadow-sm col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2">
            <div class="p-4">
                <h3 class="mb-4">USER DETAIL</h3>
                <form @submit.prevent="requestUpdateUser" autocomplete="off">
                    <div class="mb-3">
                        <label class="form-label">Name <span class="text-danger">*</span></label>
                        <input type="text" v-model="name" class="form-control" autocomplete="off" :disabled="!isEdited" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Username <span class="text-danger">*</span></label>
                        <input type="text" v-model="username" class="form-control" autocomplete="off" :disabled="!isEdited" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email <span class="text-danger">*</span></label>
                        <input type="email" v-model="email" class="form-control" autocomplete="off" :disabled="!isEdited" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Upload Photo</label>
                        <input type="file" ref="file" v-on:change="handlePhotoUpload()"  class="form-control" :disabled="!isEdited">
                    </div>
                    <img :src="urlFile" v-if="urlFile" class="img-fluid img-thumbnail rounded mb-3" :alt="urlFile">
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-primary" @click="isEdited = !isEdited">{{ isEdited ? 'CANCEL' : 'EDIT' }}</button>
                        <button type="submit" class="btn btn-success" :class="{disabled: !isEdited}" :disabled="!isEdited">SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, inject, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useLoading} from 'vue-loading-overlay'
import {useStoreAuth} from '@stores/storeAuth'
import userRepositories from '@apis/userRepositories'

const $loading = useLoading()

const toast = inject('toast')

const storeAuth = useStoreAuth()

const router = useRouter()

const {
    getUserDetailSuccess, getUserDetailError, getUserDetail,
    updateUserSuccess, updateUserError, updateUser,
} = userRepositories()

const isEdited = ref(false)
const name = ref(null)
const username = ref(null)
const email = ref(null)
const file = ref(null)
const urlFile = ref(null)
const handlePhotoUpload = async () => {
    urlFile.value = URL.createObjectURL(file.value.files[0])
}

const requestUpdateUser = async () => {

    const loader = $loading.show({})
    let formData = new FormData()
    formData.append('name', name.value)
    formData.append('username', username.value)
    formData.append('email', email.value)
    if (file.value !== null) {
        formData.append('photo', file.value.files[0])
    }
    await updateUser(formData)
    loader.hide()
    if (updateUserError.value) {
        toast.error(updateUserError.value)
        if (updateUserError.value === 'jwt expired') {
            storeAuth.updateToken(null)
            await router.push({name: 'auth.login'})
        }
        return
    }

    toast.success('Success Update User')
    file.value = null
    isEdited.value = false
}

onMounted(async () => {
    isEdited.value = false
    await getUserDetail()
    if (getUserDetailError.value) {
        toast.error(getUserDetailError.value)
        if (getUserDetailError.value === 'jwt expired') {
            storeAuth.updateToken(null)
            await router.push({name: 'auth.login'})
        }
        return
    }
    name.value = getUserDetailSuccess.value.data.name
    username.value = getUserDetailSuccess.value.data.username
    email.value = getUserDetailSuccess.value.data.email
    urlFile.value = getUserDetailSuccess.value.data.photo
})
</script>