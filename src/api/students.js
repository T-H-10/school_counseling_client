import axiosInstance from './axiosInstance'

export const getStudents = (params = {}) =>
  axiosInstance.get('/students/', { params }).then(r => r.data)
