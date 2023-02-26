import {ref} from 'vue'
import axios from '@/utils/axios'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

export const likeRepositories = () => {

    const likePostSuccess = ref(null)
    const likePostError = ref(null)

    const likePost = async (id) => {
        likePostError.value = null
        try {
            const { data } = await axios.put(`/post/like/${id}`)
            likePostSuccess.value = data
        } catch (err) {
            likePostError.value = err.response.data.meta.message
        }
    }

    const unlikePostSuccess = ref(null)
    const unlikePostError = ref(null)

    const unlikePost = async (id) => {
        unlikePostError.value = null
        try {
            const { data } = await axios.put(`/post/unlike/${id}`)
            unlikePostSuccess.value = data
        } catch (err) {
            unlikePostError.value = err.response.data.meta.message
        }
    }

    return {
        likePostSuccess, likePostError, likePost,
        unlikePostSuccess, unlikePostError, unlikePost,
    }
}

export default likeRepositories