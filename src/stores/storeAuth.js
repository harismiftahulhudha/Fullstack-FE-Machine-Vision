import {defineStore} from 'pinia'

export const useStoreAuth = defineStore('storeAuth', {
    state: () => {
        return {
            token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
        }
    },
    getters: {},
    actions: {
        updateToken(token) {
            let dataToken = null
            if (token) {
                dataToken = `Bearer ${token}`
                localStorage.setItem('token', dataToken)
            } else {
                localStorage.removeItem('token')
            }
            this.token = dataToken
        },
    }
})
