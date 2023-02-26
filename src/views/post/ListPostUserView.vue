<template>
    <teleport to="body">
        <div class="modal fade" id="modalDetailCaption" tabindex="-1" aria-labelledby="modalDetailCaptionLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalDetailCaptionLabel">Detail Caption</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <p>{{ selectedCaption }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalFormPost" tabindex="-1" aria-labelledby="modalFormPostLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalFormPostLabel">{{ isCreatePost ? 'Create Post' : 'Edit Post' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="requestFormPost" autocomplete="off">
                            <div class="container-fluid">
                                <div class="mb-3">
                                    <label class="form-label">Upload Image <span class="text-danger">*</span></label>
                                    <input type="file" ref="inputFile" v-on:change="handlePhotoUpload()"  class="form-control" required>
                                </div>
                                <img :src="inputUrlFile" v-if="inputUrlFile" class="img-fluid img-thumbnail rounded mb-3" :alt="inputUrlFile">
                                <div class="mb-3">
                                    <label class="form-label">Caption</label>
                                    <textarea cols="30" rows="10" class="form-control" v-model="inputCaption" autocomplete="off"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Tags</label>
                                    <input type="text" v-model="inputTags" class="form-control" autocomplete="off" >
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-success" data-bs-dismiss="modal">SAVE</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <div class="container">
        <div class="row mb-2 mt-4">
            <div class="col-md-12">
                <h3>Post</h3>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="row mb-4">
                    <div class="col-sm-7 col-md-6 col-lg-6 mb-2">
                        <form @submit.prevent="getPosts(true)" autocomplete="off">
                            <div class="input-group flex-nowrap">
                                <input type="text" class="form-control" v-model="search" placeholder="Caption Or Tags">
                                <div class="input-group-append">
                                    <button class="btn btn-secondary" type="submit"><font-awesome-icon :icon="['fas', 'search']" /></button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col-sm-4 offset-sm-1 col-md-4 offset-md-2 col-lg-3 offset-lg-3 mb-2">
                        <a data-bs-toggle="modal" data-bs-target="#modalFormPost" @click="requestCreatePost()" class="btn custom-block-btn d-sm-block d-sm-inline-block btn-primary" title="Create Post">
                            Create Post
                        </a>
                    </div>
                </div>
                <div class="spinner-border text-success" style="width: 3rem; height: 3rem;" role="status" v-if="isLoading">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="row" v-if="!isLoading && lists.length === 0">
                    <div class="col-12">
                        {{ search !== null && search !== '' ? 'No data found' : 'No data available' }}
                    </div>
                </div>
                <div class="row" v-if="!isLoading && lists.length > 0">
                    <div class="col-md-3 mb-3" v-for="(post, index) in lists">
                        <div class="card" style="width: 18rem;">
                            <img :src="post.image" class="card-img-top" alt="..." style="height: 200px;">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h5 class="card-title">
                                        <font-awesome-icon :icon="['fas', 'heart']" class="post-like" :class="{liked: post.isLike}" @click="requestLike(index, post)"/>
                                        {{ post.likes.toString().split('.')[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}
                                    </h5>
                                    <div class="btn-group">
                                        <button class="btn btn-light white btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <font-awesome-icon :icon="['fas', 'ellipsis-v']"/>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalFormPost" @click="requestEditPost(index, post)">Edit</a></li>
                                            <li><a class="dropdown-item" @click="requestDeletePost(index, post)">Delete</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <h6 class="post-name">{{ post.user.username }}</h6>
                                <p class="card-text">
                                    {{ useTrimText(post.caption, 60) }} <button data-bs-toggle="modal" data-bs-target="#modalDetailCaption" v-if="post.caption.length > 60" class="btn btn-primary" @click="readMore(post)">Read More</button> <br><br>
                                    <template v-for="(tag, indexTag) in post.tags.split(' ')">
                                        <span class="post-tag" @click="clickTag(tag)">{{ tag }}{{ indexTag === post.tags.split(' ').length - 1 ? '' : ' ' }}</span>
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer" v-if="pagination.totalPages > 1">
                <Pagination v-model="page" :pagination="pagination" :query="queryParams" :routeName="'post.user'"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, inject, onMounted} from 'vue'
import {useRoute, useRouter, onBeforeRouteUpdate} from 'vue-router'
import {useLoading} from 'vue-loading-overlay'
import {useStoreAuth} from '@stores/storeAuth'
import postRepositories from '@apis/postRepositories'
import likeRepositories from '@apis/likeRepositories'
import Pagination from '@/components/Pagination.vue'
import {paginate} from "@/utils/pagination"
import {useTrimText} from '@use/useTrimText'
import {useParseJwt} from '@use/useParseJwt'
import {useHashtagBuilder} from '@use/useHashtagBuilder'

const $loading = useLoading()

const toast = inject('toast')

const storeAuth = useStoreAuth()

const jwtDecode = useParseJwt(storeAuth.token)

const route = useRoute()
const router = useRouter()

const {
    getListPostByUserIdSuccess, getListPostByUserIdError, getListPostByUserId,
    createPostSuccess, createPostError, createPost,
    editPostSuccess, editPostError, editPost,
    deletePostSuccess, deletePostError, deletePost,
} = postRepositories()

const {
    likePostSuccess, likePostError, likePost,
    unlikePostSuccess, unlikePostError, unlikePost
} = likeRepositories()

const pagination = ref({})
const isLoading = ref(false)
const isCreatePost = ref(true)
const isRedirectPage = ref(false)
const selectedCaption = ref(null)
const inputId = ref(null)
const inputIndex = ref(null)
const inputCaption = ref(null)
const inputTags = ref(null)
const inputFile = ref(null)
const inputUrlFile = ref(null)
const lists = ref([])
const queryParams = ref({})
const search = ref(route.query.search ? route.query.search : '')
const page = ref(route.query.page ? parseInt(route.query.page) : 1)

const handlePhotoUpload = async () => {
    inputUrlFile.value = URL.createObjectURL(inputFile.value.files[0])
}
const setQueryParams = () => {
    queryParams.value = {}
    if (search.value !== '') {
        queryParams.value.search = search.value
    }
    if (page.value > 1) {
        queryParams.value.page = page.value
    }
}
const clickTag = async (tag) => {
    search.value = tag
    await getPosts(true)
}

const getPosts = async (isRedirect = false) => {
    isLoading.value = true
    isRedirectPage.value = isRedirect
    setQueryParams()
    await getListPostByUserId(jwtDecode.userId, queryParams.value)
    if (getListPostByUserIdError.value) {
        toast.error(getListPostByUserIdError.value)
        if (getListPostByUserIdError.value === 'jwt expired') {
            storeAuth.updateToken(null)
            await router.push({name: 'auth.login'})
        }
        return
    }
    lists.value = getListPostByUserIdSuccess.value.data
    pagination.value = paginate(getListPostByUserIdSuccess.value.meta.pagination.totalAll, page.value)

    isLoading.value = false
    if (isRedirect) {
        router.push({name: 'post.user', query: queryParams.value})
    }
}

const requestLike = async (index, post) => {
    const loader = $loading.show({})
    if (post.isLike) {
        await unlikePost(post.id)
        loader.hide()
        if (unlikePostError.value) {
            toast.error(unlikePostError.value)
            if (unlikePostError.value === 'jwt expired') {
                storeAuth.updateToken(null)
                await router.push({name: 'auth.login'})
            }
            return
        }
        post.likes = parseInt(post.likes) - 1
        post.isLike = false
        lists.value.splice(index, 1, post)
        toast.success('Success Unlike Post')
    } else {
        await likePost(post.id)
        loader.hide()
        if (likePostError.value) {
            toast.error(likePostError.value)
            if (likePostError.value === 'jwt expired') {
                storeAuth.updateToken(null)
                await router.push({name: 'auth.login'})
            }
            return
        }
        post.likes = parseInt(post.likes) + 1
        post.isLike = true
        lists.value.splice(index, 1, post)
        toast.success('Success Like Post')
    }
}

const readMore = (post) => {
    selectedCaption.value = post.caption
}

const resetInput = () => {
    inputId.value = null
    inputIndex.value = null
    inputCaption.value = null
    inputTags.value = null
    inputFile.value.type = 'text'
    inputFile.value.type = 'file'
    inputFile.value = null
    inputUrlFile.value = null
}

const requestCreatePost = async () => {
    isCreatePost.value = true
    resetInput()
}

const requestEditPost = async (index, post) => {
    isCreatePost.value = false
    inputId.value = post.id
    inputIndex.value = parseInt(index)
    inputCaption.value = post.caption
    inputTags.value = post.tags
    inputFile.value.type = 'text'
    inputFile.value.type = 'file'
    inputFile.value = null
    inputUrlFile.value = post.image
}

const requestDeletePost = async (index, post) => {
    const loader = $loading.show({})
    await deletePost(post.id)
    loader.hide()
    if (deletePostError.value) {
        toast.error(deletePostError.value)
        if (deletePostError.value === 'jwt expired') {
            storeAuth.updateToken(null)
            await router.push({name: 'auth.login'})
        }
        return
    }
    toast.success('Success Delete Post')
    await getPosts()
}

const requestFormPost = async () => {
    const loader = $loading.show({})
    let formData = new FormData()
    if (inputCaption.value !== null && inputCaption.value !== '') {
        formData.append('caption', inputCaption.value)
    } else {
        formData.append('caption', null)
    }
    if (inputTags.value !== null && inputTags.value !== '') {
        formData.append('tags', useHashtagBuilder(inputTags.value))
    } else {
        formData.append('tags', null)
    }
    formData.append('image', inputFile.value.files[0])
    if (inputId.value !== null && inputId.value !== '') {
        await editPost(inputId.value, formData)
        loader.hide()
        if (editPostError.value) {
            toast.error(editPostError.value)
            if (editPostError.value === 'jwt expired') {
                storeAuth.updateToken(null)
                await router.push({name: 'auth.login'})
            }
            return
        }
        let post = lists.value[inputIndex.value]
        post.caption = editPostSuccess.value.data.caption
        post.tags = editPostSuccess.value.data.tags
        post.image = editPostSuccess.value.data.image
        lists.value.splice(inputIndex.value, 1, post)
        toast.success('Success Edit Post')
    } else {
        await createPost(formData)
        loader.hide()
        if (createPostError.value) {
            toast.error(createPostError.value)
            if (createPostError.value === 'jwt expired') {
                storeAuth.updateToken(null)
                await router.push({name: 'auth.login'})
            }
            return
        }
        toast.success('Success Create Post')
        await getPosts()
    }
    resetInput()
}

onBeforeRouteUpdate((to, from, next) => {
    page.value = to.query.page ? parseInt(to.query.page) : 1
    search.value = to.query.search ? to.query.search : ''
    if (!isRedirectPage.value) {
        getPosts()
    }
    isRedirectPage.value = false
    next()
})

onMounted(() => {
    getPosts()
})

</script>