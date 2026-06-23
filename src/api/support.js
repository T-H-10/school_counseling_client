import axiosInstance from './axiosInstance'

export const createSupportRequest = (data) => axiosInstance.post('/support/', data)
export const getSupportRequests = () => axiosInstance.get('/support/')
export const resolveSupportRequest = (id) => axiosInstance.post(`/support/${id}/resolve/`)
