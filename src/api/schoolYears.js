import axiosInstance from './axiosInstance'

export const getSchoolYears = (params = {}) =>
  axiosInstance.get('/schoolYears/', { params }).then(r => r.data)
export const createSchoolYear = (data) => axiosInstance.post('/schoolYears/', data)
export const updateSchoolYear = (id, data) => axiosInstance.patch(`/schoolYears/${id}/`, data)
