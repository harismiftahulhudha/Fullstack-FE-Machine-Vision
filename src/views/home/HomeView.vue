<template>
    <teleport to="body">
        <div class="modal fade" id="modalDetailCaption" tabindex="-1" aria-labelledby="modalDetailTransactionLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalDetailTransactionLabel">Detail Caption</h5>
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
    </teleport>
    <div class="container">
        <div class="row mb-2 mt-4">
            <div class="col-md-12">
                <h3>Home</h3>
            </div>
        </div>
        <div class="card">
            <div class="card-body">

                <div class="row mb-4">
                    <div class="col-12">
                        <form @submit.prevent="getPosts(true)" autocomplete="off">
                            <div class="input-group flex-nowrap">
                                <input type="text" class="form-control" v-model="search" placeholder="Caption Or Tags">
                                <div class="input-group-append">
                                    <button class="btn btn-secondary" type="submit"><font-awesome-icon :icon="['fas', 'search']" /></button>
                                </div>
                            </div>
                        </form>
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
                                <h5 class="card-title"><font-awesome-icon :icon="['fas', 'heart']" class="post-like" :class="{liked: post.isLike}" @click="requestLike(index, post)"/> {{ post.likes.toString().split('.')[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}</h5>
                                <h6 class="post-name">{{ post.user.username }}</h6>
                                <p class="card-text">
                                    {{ useTrimText(post.caption, 60) }} <button  data-bs-toggle="modal" data-bs-target="#modalDetailCaption" v-if="post.caption.length > 60" class="btn btn-primary" @click="readMore(post)">Read More</button> <br><br>
                                    <template v-for="(tag, indexTag) in post.tags.split(' ')">
                                        <span class="post-tag" @click="clickTag(tag)">{{ tag }}{{ indexTag === post.tags.split(' ').length - 1 ? '' : ' ' }}</span>
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <Pagination v-model="page" :pagination="pagination" :query="queryParams" :routeName="'home.index'"/>
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

const $loading = useLoading()

const toast = inject('toast')

const storeAuth = useStoreAuth()

const route = useRoute()
const router = useRouter()

const {
    getListPostSuccess, getListPostError, getListPost
} = postRepositories()

const {
    likePostSuccess, likePostError, likePost,
    unlikePostSuccess, unlikePostError, unlikePost
} = likeRepositories()

const pagination = ref({})
const isLoading = ref(false)
const isRedirectPage = ref(false)
const selectedCaption = ref(null)
const lists = ref([])
const queryParams = ref({})
const search = ref(route.query.search ? route.query.search : '')
const page = ref(route.query.page ? parseInt(route.query.page) : 1)

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
    await getListPost(queryParams.value)
    if (getListPostError.value) {
        toast.error(getListPostError.value)
        if (getListPostError.value === 'jwt expired') {
            storeAuth.updateToken(null)
            await router.push({name: 'auth.login'})
        }
        return
    }
    lists.value = getListPostSuccess.value.data
    pagination.value = paginate(getListPostSuccess.value.meta.pagination.totalAll, page.value)

    isLoading.value = false
    if (isRedirect) {
        router.push({name: 'home.index', query: queryParams.value})
    }
}

const requestLike = async (index, post) => {
    const loader = $loading.show({})
    if (post.isLike) {
        await unlikePost(post.id)
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
        loader.hide()
    } else {
        await likePost(post.id)
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
        loader.hide()
    }
}

const readMore = (post) => {
    selectedCaption.value = post.caption
}

onBeforeRouteUpdate((to, from, next) => {
    page.value = to.query.page ? parseInt(to.query.page) : 1
    search.value = to.query.search ? to.query.search : ''
    setQueryParams()
    if (!isRedirectPage.value) {
        getPosts()
    }
    isRedirectPage.value = false
    next()
})

onMounted(() => {
    setQueryParams()
    getPosts()
})

</script>