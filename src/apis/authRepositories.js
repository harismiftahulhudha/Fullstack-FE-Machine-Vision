import {ref} from 'vue'
import axios from '@/utils/axios'

export const authRepositories = () => {

    const loginSuccess = ref(null)
    const loginError = ref(null)

    const login = async (body) => {
        loginError.value = null
        try {
            const { data } = await axios.post(`/auth/login`, body)
            loginSuccess.value = data
        } catch (err) {
            loginError.value = err.response.data.meta.message
        }
    }

    const registerSuccess = ref(null)
    const registerError = ref(null)

    const register = async (formData) => {
        registerError.value = null
        try {
            const { data } = await axios.post(`/auth/register`, formData)
            registerSuccess.value = data.data
        } catch (err) {
            registerError.value = err.response.data.meta.message
        }
    }

    const logoutSuccess = ref(null)
    const logoutError = ref(null)

    const logout = async (token) => {
        logoutError.value = null
        try {
            const headers = {
                Authorization: token
            }
            const { data } = await axios.post(`/auth/logout`, {headers})
            logoutSuccess.value = data.data
        } catch (err) {
            logoutError.value = err.response.data.meta.message
        }
    }

    return {
        loginSuccess, loginError, login,
        registerSuccess, registerError, register,
        logoutSuccess, logoutError, logout,
    }
}

export default authRepositories