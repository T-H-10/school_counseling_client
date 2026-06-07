import axiosInstance from './axiosInstance'

export const getSchoolYears = (params = {}) =>
  axiosInstance.get('/schoolYears/', { params }).then(r => r.data)
