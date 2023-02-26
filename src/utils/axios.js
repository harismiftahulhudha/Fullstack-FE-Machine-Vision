import { axios } from '@bundled-es-modules/axios'
axios.defaults.baseURL = import.meta.env.VITE_BASE_API
export default axios