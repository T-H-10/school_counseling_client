import axiosInstance from './axiosInstance'

export const getSchools = () => axiosInstance.get('/schools/')
export const createSchool = (data) => axiosInstance.post('/schools/', data)
export const updateSchool = (id, data) => axiosInstance.patch(`/schools/${id}/`, data)
