import {ref} from 'vue'
import axios from '@/utils/axios'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

export const postRepositories = () => {

    const getListPostSuccess = ref(null)
    const getListPostError = ref(null)

    const getListPost = async (params = {}) => {
        getListPostError.value = null
        try {
            const { data } = await axios.get(`/post`, {params})
            getListPostSuccess.value = data
        } catch (err) {
            getListPostError.value = err.response.data.meta.message
        }
    }

    const getListPostByUserIdSuccess = ref(null)
    const getListPostByUserIdError = ref(null)

    const getListPostByUserId = async (id, params = {}) => {
        getListPostByUserIdError.value = null
        try {
            const { data } = await axios.get(`/post/user/${id}`, {params})
            getListPostByUserIdSuccess.value = data
        } catch (err) {
            getListPostByUserIdError.value = err.response.data.meta.message
        }
    }

    const createPostSuccess = ref(null)
    const createPostError = ref(null)

    const createPost = async (formData) => {
        createPostError.value = null
        try {
            const { data } = await axios.post(`/post`, formData)
            createPostSuccess.value = data
        } catch (err) {
            createPostError.value = err.response.data.meta.message
        }
    }

    const editPostSuccess = ref(null)
    const editPostError = ref(null)

    const editPost = async (id, formData) => {
        editPostError.value = null
        try {
            const { data } = await axios.put(`/post/${id}`, formData)
            editPostSuccess.value = data
        } catch (err) {
            editPostError.value = err.response.data.meta.message
        }
    }

    const deletePostSuccess = ref(null)
    const deletePostError = ref(null)

    const deletePost = async (id) => {
        deletePostError.value = null
        try {
            const { data } = await axios.delete(`/post/${id}`)
            deletePostSuccess.value = data
        } catch (err) {
            deletePostError.value = err.response.data.meta.message
        }
    }

    return {
        getListPostSuccess, getListPostError, getListPost,
        getListPostByUserIdSuccess, getListPostByUserIdError, getListPostByUserId,
        createPostSuccess, createPostError, createPost,
        editPostSuccess, editPostError, editPost,
        deletePostSuccess, deletePostError, deletePost,
    }
}

export default postRepositories