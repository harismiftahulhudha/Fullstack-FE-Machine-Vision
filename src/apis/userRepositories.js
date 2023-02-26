import {ref} from 'vue'
import axios from '@/utils/axios'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

export const userRepositories = () => {

    const getUserDetailSuccess = ref(null)
    const getUserDetailError = ref(null)

    const getUserDetail = async () => {
        getUserDetailError.value = null
        try {
            const { data } = await axios.get(`/user`)
            getUserDetailSuccess.value = data
        } catch (err) {
            getUserDetailError.value = err.response.data.meta.message
        }
    }

    const updateUserSuccess = ref(null)
    const updateUserError = ref(null)

    const updateUser = async (formData) => {
        updateUserError.value = null
        try {
            const { data } = await axios.put(`/user`, formData)
            updateUserSuccess.value = data
        } catch (err) {
            updateUserError.value = err.response.data.meta.message
        }
    }

    const changePasswordSuccess = ref(null)
    const changePasswordError = ref(null)

    const changePassword = async (body) => {
        changePasswordError.value = null
        try {
            const { data } = await axios.put(`/user/change-password`, body)
            changePasswordSuccess.value = data
        } catch (err) {
            changePasswordError.value = err.response.data.meta.message
        }
    }

    return {
        getUserDetailSuccess, getUserDetailError, getUserDetail,
        updateUserSuccess, updateUserError, updateUser,
        changePasswordSuccess, changePasswordError, changePassword,
    }
}

export default userRepositories